-- ============================================================
--  MAGOL · Esquema da base de dados (Supabase / PostgreSQL)
--  Como usar: Supabase -> SQL Editor -> New query -> cola isto
--  todo e carrega em "Run". Pode ser corrido mais que uma vez.
--  (A CLI aplica-o automaticamente via supabase db push.)
-- ============================================================

-- 1) CATALOGO CARROCARIAS -----------------------------------
create table if not exists public.carrocarias (
  id          uuid primary key default gen_random_uuid(),
  pos         int  not null default 0,
  no          text not null default '',
  title       text not null,
  tag         text not null default '',
  description text not null default '',
  image_url   text not null default '',
  images      jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
-- Migracao: galeria de trabalhos (portfolio) em bases ja existentes.
alter table public.carrocarias add column if not exists images jsonb not null default '[]'::jsonb;

-- 2) CATALOGO DROGARIA --------------------------------------
create table if not exists public.drogaria (
  id          uuid primary key default gen_random_uuid(),
  pos         int  not null default 0,
  title       text not null,
  count_label text not null default '',
  description text not null default '',
  image_url   text not null default '',
  created_at  timestamptz not null default now()
);

-- 3) DEFINICOES (contactos, estatisticas, textos) -----------
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 4) PEDIDOS / LEADS (formulario "Pedir Orcamento") ---------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  phone      text,
  subject    text,
  message    text,
  created_at timestamptz not null default now()
);

-- 5) ADMINS (quem pode escrever) ----------------------------
--    So os emails aqui dentro conseguem editar o site.
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Funcao que diz se a sessao atual e de um admin.
-- SECURITY DEFINER -> consegue ler a tabela admins mesmo com RLS ligado.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
--  - Catalogo + definicoes: leitura PUBLICA, escrita so ADMIN.
--  - Leads: qualquer visitante CRIA, so o ADMIN le/apaga.
--  - Admins: tabela fechada (so acessivel via funcao/servidor).
-- ============================================================
alter table public.carrocarias enable row level security;
alter table public.drogaria    enable row level security;
alter table public.settings    enable row level security;
alter table public.leads       enable row level security;
alter table public.admins      enable row level security;

-- Idempotente: limpar policies antes de recriar
drop policy if exists "public read carrocarias" on public.carrocarias;
drop policy if exists "admin write carrocarias" on public.carrocarias;
drop policy if exists "public read drogaria"    on public.drogaria;
drop policy if exists "admin write drogaria"    on public.drogaria;
drop policy if exists "public read settings"    on public.settings;
drop policy if exists "admin write settings"    on public.settings;
drop policy if exists "anyone create lead"      on public.leads;
drop policy if exists "admin read leads"        on public.leads;
drop policy if exists "admin delete leads"      on public.leads;

-- Leitura publica (qualquer pessoa ve o catalogo e as definicoes)
create policy "public read carrocarias" on public.carrocarias for select using (true);
create policy "public read drogaria"    on public.drogaria    for select using (true);
create policy "public read settings"    on public.settings    for select using (true);

-- Escrita so para ADMINS (email na tabela admins)
create policy "admin write carrocarias" on public.carrocarias for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write drogaria"    on public.drogaria    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write settings"    on public.settings    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Leads: visitante anonimo INSERE; so o admin LE / APAGA
create policy "anyone create lead" on public.leads for insert to anon, authenticated with check (true);
create policy "admin read leads"   on public.leads for select to authenticated using (public.is_admin());
create policy "admin delete leads" on public.leads for delete to authenticated using (public.is_admin());

-- (A tabela admins fica sem policies de API -> ninguem lhe acede de fora.
--  So a funcao is_admin() (security definer) e o servidor lhe tocam.)

-- ============================================================
--  ADMINS INICIAIS
-- ============================================================
insert into public.admins (email) values
  ('luis.a110686@gmail.com')
on conflict (email) do nothing;

-- ============================================================
--  DADOS INICIAIS (so corre se as tabelas estiverem vazias)
-- ============================================================
insert into public.carrocarias (pos, no, title, tag, description, image_url)
select * from (values
  (1, '01', 'Caixas Abertas', 'Carga geral', 'Plataformas e estrados com taipais para transporte de carga geral, materiais e paletes.', 'https://loremflickr.com/640/420/flatbed,truck?lock=31'),
  (2, '02', 'Basculantes', 'Obra & agricultura', 'Caixas basculantes traseiras e trilaterais, robustas para obra, entulho e agricultura.', 'https://loremflickr.com/640/420/dump,truck?lock=32'),
  (3, '03', 'Furgões & Caixas Fechadas', 'Transporte protegido', 'Estruturas fechadas em painel para mercadoria protegida das intempéries.', 'https://loremflickr.com/640/420/van,truck?lock=33'),
  (4, '04', 'Isotérmicas & Frigoríficas', 'Temperatura controlada', 'Carroçarias isotérmicas para transporte a temperatura controlada de alimentos e fármacos.', 'https://loremflickr.com/640/420/truck,delivery?lock=34'),
  (5, '05', 'Reboques & Semi-reboques', 'Sob medida', 'Fabrico e adaptação de reboques e semi-reboques à medida da sua atividade.', 'https://loremflickr.com/640/420/trailer,truck?lock=35'),
  (6, '06', 'Porta-Máquinas', 'Estrados rebaixados', 'Plataformas rebaixadas com rampas para transporte de máquinas e equipamento pesado.', 'https://loremflickr.com/640/420/excavator,transport?lock=36'),
  (7, '07', 'Estruturas em Alumínio', 'Leve & resistente', 'Taipais, gradeamentos e acessórios em alumínio que reduzem peso sem perder resistência.', 'https://loremflickr.com/640/420/metal,aluminium?lock=37'),
  (8, '08', 'Reparação & Manutenção', 'Oficina', 'Soldadura, chaparia e recuperação de carroçarias de todas as marcas.', 'https://loremflickr.com/640/420/welding,workshop?lock=38')
) as v
where not exists (select 1 from public.carrocarias);

insert into public.drogaria (pos, title, count_label, description, image_url)
select * from (values
  (1, 'Tintas & Vernizes', '+200 ref.', 'Tintas, esmaltes, vernizes e tudo para pintura interior e exterior.', 'https://loremflickr.com/520/360/paint,cans?lock=61'),
  (2, 'Ferragens & Fixações', '+500 artigos', 'Parafusos, dobradiças, fechaduras e fixações para cada trabalho.', 'https://loremflickr.com/520/360/screws,bolts?lock=62'),
  (3, 'Ferramentas', 'Manual & elétrica', 'Ferramenta manual e elétrica das melhores marcas.', 'https://loremflickr.com/520/360/tools,workshop?lock=63'),
  (4, 'Material Elétrico', 'Instalação', 'Cabos, tomadas, iluminação e material de instalação elétrica.', 'https://loremflickr.com/520/360/cables,plug?lock=64'),
  (5, 'Artigos Sanitários', 'Casa de banho', 'Loiças, torneiras, bases de duche e acessórios sanitários.', 'https://loremflickr.com/520/360/bathroom,faucet?lock=65'),
  (6, 'Limpeza & Químicos', 'Profissional', 'Produtos de limpeza, solventes e químicos para casa e indústria.', 'https://loremflickr.com/520/360/cleaning,detergent?lock=66'),
  (7, 'Proteção & EPI', 'Segurança', 'Luvas, calçado, capacetes e equipamento de proteção individual.', 'https://loremflickr.com/520/360/safety,helmet?lock=67'),
  (8, 'Jardim & Exterior', 'Estação', 'Ferramenta de jardim, mangueiras e artigos para o exterior.', 'https://loremflickr.com/520/360/garden,tools?lock=68')
) as v
where not exists (select 1 from public.drogaria);

insert into public.settings (key, value) values
  ('contacts', '{"address":"Rua da Indústria, 124\n3850-118 Branca · Albergaria-a-Velha\nAveiro, Portugal","phoneLandline":"+351 234 500 120","phoneMobile":"+351 912 000 340","email":"geral@magol.pt","hours":"Seg–Sex · 08:30–18:30\nSábado · 09:00–13:00"}'::jsonb),
  ('stats', '[{"value":"40+","label":"Anos de experiência"},{"value":"2","label":"Áreas de negócio"},{"value":"1500+","label":"Clientes servidos"},{"value":"100%","label":"Fabrico nacional"}]'::jsonb),
  ('texts', '{"heroPre":"Branca · Aveiro · desde 1985","heroTitle":"Carroçarias feitas para o trabalho","heroAccent":" a sério.","heroSub":"Fabrico, reparação e equipamento para o seu veículo de trabalho — e uma drogaria completa para a obra, a casa e a indústria. Tudo na Branca, Aveiro."}'::jsonb),
  ('images', '{"homeHero":"https://loremflickr.com/1600/900/truck,workshop,welding?lock=10","homeAreaCarro":"https://loremflickr.com/700/520/lorry,truck?lock=21","homeAreaDrog":"https://loremflickr.com/700/520/paint,hardware,store?lock=22","carroHero":"https://loremflickr.com/1400/800/truck,factory?lock=12","drogHero":"https://loremflickr.com/1400/800/hardware,store,shelves?lock=13","sobrePhoto":"https://loremflickr.com/720/880/factory,workshop,welding?lock=51"}'::jsonb),
  ('brands', '[{"name":"Bosch","logo":""},{"name":"CIN","logo":""},{"name":"Legrand","logo":""},{"name":"Makita","logo":""},{"name":"Robbialac","logo":""},{"name":"Roca","logo":""}]'::jsonb)
on conflict (key) do nothing;

-- ============================================================
--  6) PRODUTOS DA DROGARIA (itens por categoria)
--     Cada produto pertence a uma categoria (drogaria) e tem
--     marca, referencia, descricao e varias fotos.
--     Detalhe completo em supabase/drogaria-items.sql
-- ============================================================
create table if not exists public.drogaria_items (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.drogaria(id) on delete set null,
  pos         int  not null default 0,
  title       text not null default 'Novo produto',
  brand       text not null default '',
  reference   text not null default '',
  description text not null default '',
  images      jsonb not null default '[]'::jsonb,
  tags        jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
-- Migracao: garante a coluna de destaques em bases ja existentes.
alter table public.drogaria_items add column if not exists tags jsonb not null default '[]'::jsonb;
create index if not exists drogaria_items_category_idx on public.drogaria_items (category_id);

alter table public.drogaria_items enable row level security;
drop policy if exists "public read drogaria_items" on public.drogaria_items;
drop policy if exists "admin write drogaria_items" on public.drogaria_items;
create policy "public read drogaria_items" on public.drogaria_items for select using (true);
create policy "admin write drogaria_items" on public.drogaria_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
