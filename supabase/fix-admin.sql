-- ============================================================
--  MAGOL · Corrigir admin
--  Corre isto no SQL Editor se o painel disser
--  "new row violates row-level security policy" ao guardar.
--  Faz com que o email com que fizeste LOGIN seja reconhecido
--  como admin (sem precisares de saber qual e).
-- ============================================================

-- 1) Ver os utilizadores que existem (e se o email esta confirmado)
select email, email_confirmed_at from auth.users;

-- 2) Tornar admin TODOS os utilizadores existentes.
--    (So tens a tua conta, por isso e seguro.)
insert into public.admins (email)
select email from auth.users
where email is not null
on conflict (email) do nothing;

-- 3) Reforco: tornar a verificacao insensivel a maiusculas/minusculas
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

-- 4) Confirmar quem ficou admin
select email from public.admins;
