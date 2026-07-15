-- =========================================================
-- Migração: acesso restrito a profissionais pré-autorizados
-- Execute no SQL Editor do Supabase, DEPOIS do schema.sql original
-- =========================================================

-- 1) Tabela de allowlist: só quem estiver aqui pode logar/acessar dados.
create table if not exists permitidos (
  email text primary key,
  criado_em timestamp with time zone default now()
);

-- Insira aqui o(s) e-mail(is) autorizado(s). Troque pelo seu e-mail real.
insert into permitidos (email) values ('seuemail@gmail.com')
on conflict (email) do nothing;

alter table permitidos enable row level security;

-- Ninguém acessa essa tabela pelo client (só o backend/painel do Supabase).
-- Nenhuma policy = acesso bloqueado por padrão com RLS habilitado.

-- 2) Função que verifica se o usuário autenticado está na allowlist.
-- security definer para poder ler a tabela "permitidos" mesmo sem policy pública.
create or replace function public.is_authorized()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from permitidos
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- 3) Substitui as policies antigas por versões que exigem is_authorized().

drop policy if exists "Profissional visualiza o próprio perfil" on profissionais;
drop policy if exists "Profissional insere o próprio perfil" on profissionais;
drop policy if exists "Profissional atualiza o próprio perfil" on profissionais;

create policy "Somente autorizado visualiza o próprio perfil"
  on profissionais for select
  using (auth.uid() = id and is_authorized());

create policy "Somente autorizado insere o próprio perfil"
  on profissionais for insert
  with check (auth.uid() = id and is_authorized());

create policy "Somente autorizado atualiza o próprio perfil"
  on profissionais for update
  using (auth.uid() = id and is_authorized());

drop policy if exists "Profissional visualiza seus alunos" on alunos;
drop policy if exists "Profissional insere alunos vinculados a si" on alunos;
drop policy if exists "Profissional atualiza seus alunos" on alunos;
drop policy if exists "Profissional exclui seus alunos" on alunos;

create policy "Somente autorizado visualiza seus alunos"
  on alunos for select
  using (auth.uid() = profissional_id and is_authorized());

create policy "Somente autorizado insere alunos vinculados a si"
  on alunos for insert
  with check (auth.uid() = profissional_id and is_authorized());

create policy "Somente autorizado atualiza seus alunos"
  on alunos for update
  using (auth.uid() = profissional_id and is_authorized());

create policy "Somente autorizado exclui seus alunos"
  on alunos for delete
  using (auth.uid() = profissional_id and is_authorized());

-- 4) Trigger: quando o profissional autorizado loga pela 1ª vez (Google/Magic Link),
-- cria automaticamente o registro em "profissionais" (não existe mais tela de cadastro).
create or replace function public.criar_perfil_profissional()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from permitidos where email = new.email) then
    insert into public.profissionais (id, nome_completo, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
      new.email
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.criar_perfil_profissional();
