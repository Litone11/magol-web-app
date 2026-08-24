# MAGOL · Website Institucional & Painel de Gestão

> Website oficial da **MAGOL** (Carroçarias e Drogaria, Branca · Aveiro).  
> 🌐 **Disponível online em:** [magol.pt](https://magol.pt) (Deployed na [Vercel](https://vercel.com))

---

## 📌 Sobre o Projeto

Este projeto consiste na plataforma web da **MAGOL**, combinando um website público moderno e interativo com um **Painel de Gestão (Headless CMS)** integrado. 

A solução permite à empresa gerir autonomamente os conteúdos do site — incluindo catálogos de serviços (carroçarias), categorias da drogaria, informações de contacto, horários de funcionamento, estatísticas institucionais e pedidos de orçamento — sem necessidade de alterar o código-fonte.

---

## 🏗️ Arquitetura e Decisões Técnicas

### Stack Tecnológica
- **Frontend:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth & Storage)
- **Deployment:** [Vercel](https://vercel.com/)

---

### Principais Decisões de Arquitetura

#### 1. React + Vite (Single Page Application)
Optou-se por uma SPA com React e Vite para garantir um carregamento ultrarrápido, navegação fluida e excelente experiência do utilizador, mantendo a build leve e de fácil manutenção.

#### 2. Supabase como Headless CMS e Backend BaaS
A Supabase foi escolhida para gerir o conteúdo dinâmico e autenticação:
- **Row Level Security (RLS):** Toda a segurança de escrita é tratada diretamente ao nível da base de dados PostgreSQL. O acesso de leitura aos catálogos é público, enquanto as operações de edição (CRUD) exigem uma sessão válida de um utilizador registado na tabela de administradores (`is_admin()`).
- **Anon Key Pública:** O frontend utiliza apenas a chave anónima (`anon key`) pública da Supabase, sem expor chaves privilegiadas (`service_role`).
- **Supabase Storage:** Gestão de upload de imagens diretamente no painel para os catálogos da empresa.

#### 3. Resiliência & Fallback (Modo Demo Offline)
A camada de dados (`src/lib/content.js`) foi projetada com resiliência: se as variáveis de ambiente da Supabase não estiverem definidas ou se a ligação falhar, a aplicação entra automaticamente em **Modo Demo**, servindo dados de fallback locais. Isto permite testar e desenvolver a interface totalmente offline.

#### 4. Hash Routing para Alojamento Estático Simples
O painel de administração utiliza roteamento por hash (`/#admin`). Esta escolha simplifica o alojamento em plataformas estáticas/CDNs como a Vercel, evitando a necessidade de regras complexas de *rewrite* de servidor ou *fallback* de SPA para rotas secundárias.

#### 5. CI/CD e Alojamento na Vercel
O projeto encontra-se em produção na Vercel, integrado com deployment contínuo a partir do repositório Git, garantindo máxima performance através de distribuição por CDN global e certificados SSL automáticos no domínio customizado `magol.pt`.

---

## 📁 Estrutura do Código

```text
src/
├── main.jsx          # Ponto de entrada da aplicação React
├── App.jsx           # Roteador principal (Site público vs. Painel #admin)
├── ui.jsx            # Utilitários de UI e estilos dinâmicos
├── styles.css        # Estilos globais, tipografia e animações
├── lib/              # Serviços e integração de dados
│   ├── supabase.js   # Inicialização do cliente Supabase
│   ├── content.js    # Carregamento de dados (Supabase com Fallback)
│   ├── leads.js      # Submissão de pedidos de orçamento
│   └── storage.js    # Upload de imagens para o Supabase Storage
├── site/             # Componentes do site público
│   ├── Home.jsx, Carrocarias.jsx, Drogaria.jsx, etc.
│   └── Nav.jsx, Footer.jsx, Lightbox.jsx
└── admin/            # Painel de gestão privado
    ├── Admin.jsx     # Gestor de autenticação e navegação por abas
    └── editors.jsx   # Formulários CRUD para gestão de conteúdos
```

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

---

## 🔒 Painel de Administração

O painel de gestão é acessível através da rota `/#admin`. Permite gerir:
- **Carroçarias:** Adicionar, editar e remover serviços e imagens.
- **Drogaria:** Categorias de produtos, destaques e especificações.
- **Contactos e Horários:** Morada, contactos telefónicos e horários de atendimento.
- **Estatísticas e Textos:** Métricas operacionais e textos institucionais.
- **Pedidos:** Consulta de formulários de contacto e orçamentos submetidos pelos visitantes.
