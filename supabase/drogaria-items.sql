-- ============================================================
--  MAGOL · Produtos da Drogaria (itens por categoria)
--  Corre isto no SQL Editor da Supabase DEPOIS do schema.sql.
--  Cria a tabela de PRODUTOS: cada produto pertence a uma
--  categoria da Drogaria e tem marca, referencia, descricao e
--  varias fotos. Leitura publica, escrita so para admins.
--  Pode ser corrido mais que uma vez (idempotente).
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
-- ids validos: 'promo', 'semana', 'top' (ver PRODUCT_TAGS em src/lib/content.js).
alter table public.drogaria_items add column if not exists tags jsonb not null default '[]'::jsonb;

create index if not exists drogaria_items_category_idx on public.drogaria_items (category_id);

-- ---- Row Level Security: ler publico, escrever so admin ----
alter table public.drogaria_items enable row level security;

drop policy if exists "public read drogaria_items" on public.drogaria_items;
drop policy if exists "admin write drogaria_items" on public.drogaria_items;

create policy "public read drogaria_items" on public.drogaria_items
  for select using (true);

create policy "admin write drogaria_items" on public.drogaria_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
--  DADOS DE EXEMPLO (so corre se a tabela estiver vazia).
--  Liga cada produto a uma categoria pela coincidencia do titulo.
-- ============================================================
insert into public.drogaria_items (pos, category_id, title, brand, reference, description, images, tags)
select v.pos, d.id, v.title, v.brand, v.reference, v.description, v.images::jsonb, v.tags::jsonb
from (values
  (1, 'Tintas & Vernizes', 'Tinta Plástica Mate Branco 15L', 'CIN', 'CIN-PM-15B', 'Tinta plástica de interior, acabamento mate, alto rendimento e fácil aplicação.', '["https://loremflickr.com/600/600/paint,white,wall?lock=101","https://loremflickr.com/600/600/paint,roller?lock=102"]', '["promo"]'),
  (2, 'Tintas & Vernizes', 'Esmalte Aquoso Acetinado 0,75L', 'Robbialac', 'RB-EA-075', 'Esmalte aquoso para madeiras e metais, secagem rápida e baixo odor.', '["https://loremflickr.com/600/600/paint,can?lock=103"]', '[]'),
  (3, 'Tintas & Vernizes', 'Verniz Marítimo Acetinado 1L', 'CIN', 'CIN-VM-1', 'Verniz de alta proteção para exteriores, resistente aos raios UV e à humidade.', '["https://loremflickr.com/600/600/varnish,wood?lock=104"]', '[]'),
  (4, 'Ferragens & Fixações', 'Caixa de Parafusos Sortidos 600 pç', '', 'FX-PAR-600', 'Sortido de parafusos para madeira e aglomerado em várias medidas, com caixa organizadora.', '["https://loremflickr.com/600/600/screws,bolts?lock=105"]', '[]'),
  (5, 'Ferragens & Fixações', 'Dobradiça Inox 100mm (par)', '', 'FX-DOB-100', 'Dobradiça reforçada em aço inox para portas e portões, par com parafusos.', '["https://loremflickr.com/600/600/hinge,metal?lock=106"]', '[]'),
  (6, 'Ferramentas', 'Berbequim com Percussão 750W', 'Bosch', 'BO-BP-750', 'Berbequim de percussão com mandril de 13mm, velocidade variável e reversível.', '["https://loremflickr.com/600/600/drill,tool?lock=107","https://loremflickr.com/600/600/power,drill?lock=108"]', '["semana","top"]'),
  (7, 'Ferramentas', 'Rebarbadora 125mm 900W', 'Makita', 'MK-REB-125', 'Rebarbadora angular compacta para corte e desbaste, com proteção de disco.', '["https://loremflickr.com/600/600/grinder,tool?lock=109"]', '["top"]'),
  (8, 'Ferramentas', 'Jogo de Chaves de Fendas 6 pç', 'Bosch', 'BO-CF-6', 'Conjunto de chaves de fendas plana e Phillips com punho ergonómico antiderrapante.', '["https://loremflickr.com/600/600/screwdriver,set?lock=110"]', '[]'),
  (9, 'Material Elétrico', 'Cabo Flexível H07V-K 2,5mm² (rolo 100m)', 'Legrand', 'EL-CABO-25', 'Cabo flexível para instalações elétricas, isolamento PVC, rolo de 100 metros.', '["https://loremflickr.com/600/600/electric,cable?lock=111"]', '[]'),
  (10, 'Material Elétrico', 'Tomada Schuko Branca', 'Legrand', 'EL-TOM-SK', 'Tomada de encastrar com terra lateral, acabamento branco, série moderna.', '["https://loremflickr.com/600/600/power,socket?lock=112"]', '["promo"]'),
  (11, 'Artigos Sanitários', 'Torneira Misturadora de Lavatório', 'Roca', 'SAN-MIST-LV', 'Misturadora monocomando para lavatório, acabamento cromado, arejador incluído.', '["https://loremflickr.com/600/600/faucet,tap?lock=113"]', '[]'),
  (12, 'Limpeza & Químicos', 'Diluente Universal 5L', '', 'LMP-DIL-5', 'Diluente universal para limpeza de ferramentas e diluição de tintas e esmaltes.', '["https://loremflickr.com/600/600/solvent,can?lock=114"]', '[]')
) as v(pos, cat_title, title, brand, reference, description, images, tags)
join public.drogaria d on d.title = v.cat_title
where not exists (select 1 from public.drogaria_items);

-- ============================================================
--  MARCAS (lista gerida usada no dropdown ao editar produtos).
--  Guardada em settings -> editavel no painel (Drogaria · marcas).
-- ============================================================
insert into public.settings (key, value)
values ('brands', '[{"name":"Bosch","logo":""},{"name":"CIN","logo":""},{"name":"Legrand","logo":""},{"name":"Makita","logo":""},{"name":"Robbialac","logo":""},{"name":"Roca","logo":""}]'::jsonb)
on conflict (key) do nothing;
