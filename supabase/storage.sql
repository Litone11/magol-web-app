-- ============================================================
--  MAGOL · Storage de imagens
--  Corre isto no SQL Editor da Supabase DEPOIS do schema.sql.
--  Cria o bucket publico "images" e as regras: ler publico,
--  carregar/alterar/apagar so para admins (tabela admins).
-- ============================================================

-- Bucket publico (as imagens sao servidas por URL publico)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Idempotente
drop policy if exists "public read images"  on storage.objects;
drop policy if exists "admin upload images" on storage.objects;
drop policy if exists "admin update images" on storage.objects;
drop policy if exists "admin delete images" on storage.objects;

-- Qualquer pessoa le as imagens do bucket
create policy "public read images" on storage.objects
  for select using (bucket_id = 'images');

-- So admins carregam / alteram / apagam
create policy "admin upload images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());

create policy "admin update images" on storage.objects
  for update to authenticated
  using (bucket_id = 'images' and public.is_admin());

create policy "admin delete images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());
