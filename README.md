# MAGOL · Site + Painel de Gestão

Site da MAGOL (Carroçarias e Drogaria, Branca · Aveiro) em **React + Vite**, com o
conteúdo guardado na **Supabase**. O dono edita tudo (catálogos, contactos,
estatísticas, textos) num painel protegido por login, sem mexer no código.

```
/                  → site público (5 páginas + modal "Pedir Orçamento")
/#admin            → painel de gestão (precisa de login)
```

## Como funciona a segurança (resumo)

- A **anon key** vai no frontend e é **pública** — não dá poderes nenhuns sozinha.
- Quem manda na escrita são as **policies RLS** na Supabase.
- O **login** do admin emite um *token de sessão*; é esse token (não uma chave fixa)
  que prova "sou admin" em cada gravação.
- Quem pode escrever é decidido pela tabela **`admins`**: a função `is_admin()` verifica
  se o email da sessão está lá. Não basta ter conta — o email tem de estar em `admins`.
- A **service_role key** é secreta e **neste projeto nem é usada**. Nunca a ponhas no
  frontend nem no Vercel.

Regras RLS aplicadas (ficheiro `supabase/schema.sql`):

| Tabela        | Ler            | Escrever            |
|---------------|----------------|---------------------|
| `carrocarias` | toda a gente   | só admin (login)    |
| `drogaria`    | toda a gente   | só admin (login)    |
| `settings`    | toda a gente   | só admin (login)    |
| `leads`       | só admin       | qualquer visitante cria |

---

## Arrancar localmente (modo demo)

Não precisas da Supabase para ver o site a funcionar. Com os placeholders no
`.env.local`, ele corre em **modo demo** (dados locais, formulários simulados).

```bash
npm install
npm run dev          # abre http://localhost:5173
```

---

## Ligar à Supabase (passo a passo)

### 1. Criar o projeto
1. Vai a <https://supabase.com> → **New project**.
2. Dá um nome (ex.: `magol`), escolhe uma password para a base de dados e a região
   **West EU (Ireland)** (mais perto de Portugal). Cria.

### 2. Criar as tabelas + regras + dados
1. No projeto: menu lateral **SQL Editor** → **New query**.
2. Abre o ficheiro `supabase/schema.sql` deste repositório, copia **tudo** e cola.
3. Carrega em **Run**. Cria as 4 tabelas, as policies RLS e mete os dados iniciais
   (os 8 + 8 itens, contactos, etc.). Podes correr este script mais que uma vez sem
   problema.

### 3. Buscar as chaves (públicas)
1. Menu **Settings** (engrenagem) → **API**.
2. Copia o **Project URL** e a chave **anon public**.
3. No projeto, edita o ficheiro `.env.local`:

   ```
   VITE_SUPABASE_URL=https://o-teu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=a-tua-anon-public-key
   ```
4. Reinicia o `npm run dev` (o Vite só lê o `.env` no arranque).

### 4. Criar a conta de admin (a tua)
1. Menu **Authentication** → **Users** → **Add user** → **Create new user**.
2. Mete o **mesmo email** que está na tabela `admins` (o seed usa `luis.a110686@gmail.com`)
   e uma password. Marca **Auto Confirm User** (confirma logo).
3. Para adicionar mais admins no futuro: `insert into admins (email) values ('outro@email');`
   no SQL Editor, e cria-lhe o user em Authentication.
4. *(Opcional, reforço extra)* **Authentication → Sign In / Providers → Email** e desliga
   **"Allow new users to sign up"**. Mesmo que ficasse ligado, quem se registasse não
   conseguia escrever (não está em `admins`) — mas assim nem contas estranhas se criam.

### 5. Entrar no painel
1. Abre `http://localhost:5173/#admin`.
2. Faz login com o email/password do passo 4.
3. Edita os catálogos, contactos, estatísticas e textos. Tudo grava na Supabase e
   aparece no site na hora.

---

## Publicar no Vercel

1. Põe o projeto no GitHub (`git init`, commit, push).
2. Em <https://vercel.com> → **Add New → Project** → importa o repositório.
3. O Vercel deteta Vite sozinho (build `npm run build`, output `dist`).
4. Em **Settings → Environment Variables**, adiciona as **duas** variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   (São públicas — podem ir para aqui à vontade. A `service_role` **nunca**.)
5. Deploy. O painel fica em `https://o-teu-site.vercel.app/#admin`.

> Como o `/#admin` é routing por hash, funciona em estático no Vercel sem
> configuração extra de rewrites.

---

## Estrutura

```
index.html              Entrada Vite (fontes + <div id="root">)
supabase/schema.sql     Tabelas + RLS + dados iniciais (correr na Supabase)
src/
  main.jsx              Arranque do React
  App.jsx               Router simples: site vs #admin
  ui.jsx                Helpers s() (CSS string → estilo) e <El> (hover)
  styles.css            Reset, fontes, animação do ticker
  lib/
    supabase.js         Cliente Supabase + flag isConfigured
    content.js          Defaults + loadContent() (lê da BD, com fallback)
    leads.js            submitLead() (formulários → tabela leads)
    storage.js          uploadImage() (upload p/ Supabase Storage)
  site/                 Site público: Nav, Footer, QuoteModal + 5 páginas
  admin/                Painel: Admin (login/tabs) + editors (CRUD)
supabase/storage.sql    Bucket de imagens + regras (correr depois do schema.sql)
```

## O que é editável no painel

- **Carroçarias** — os 8 serviços (nº, título, etiqueta, descrição, imagem) · adicionar/remover.
- **Drogaria** — as 8 categorias (título, badge, descrição, imagem) · adicionar/remover.
- **Contactos & horário** — morada, telefones, email, horário (site + footer).
- **Estatísticas & textos** — os números do Início e os textos do hero/empresa.
- **Pedidos** — vê e apaga os pedidos enviados pelos formulários do site.

## Notas

- **Imagens do catálogo:** no painel, cada item tem um botão **"Carregar ficheiro"** que
  faz upload do teu computador para o **Supabase Storage** (bucket `images`) e preenche o
  URL automaticamente. Também podes colar um URL à mão. Para ativar, corre uma vez o
  `supabase/storage.sql` no SQL Editor (cria o bucket + regras: ler público, carregar só admin).
  Os placeholders iniciais são do `loremflickr.com`.
- O logótipo é um wordmark "MAGOL." em tipografia Oswald. Para usar o logótipo real,
  substitui o `<span className="mg-logo">` em `src/site/Nav.jsx` e `Footer.jsx`.
