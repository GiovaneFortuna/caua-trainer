-- =========================================================
-- Script de criação do banco de dados - Gerenciamento de Alunos
-- Execute no SQL Editor do seu projeto Supabase
-- =========================================================

-- Tabela de profissionais (perfil vinculado ao auth.users)
create table if not exists profissionais (
  id uuid primary key references auth.users (id) on delete cascade,
  nome_completo text not null,
  email text not null,
  criado_em timestamp with time zone default now()
);

-- Tabela de alunos
create table if not exists alunos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais (id) on delete cascade,
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  observacoes text,
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now()
);

-- Índice para acelerar buscas por profissional
create index if not exists idx_alunos_profissional_id on alunos (profissional_id);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================

alter table profissionais enable row level security;
alter table alunos enable row level security;

-- Profissional só pode ver/editar o próprio perfil
create policy "Profissional visualiza o próprio perfil"
  on profissionais for select
  using (auth.uid() = id);

create policy "Profissional insere o próprio perfil"
  on profissionais for insert
  with check (auth.uid() = id);

create policy "Profissional atualiza o próprio perfil"
  on profissionais for update
  using (auth.uid() = id);

-- Profissional só acessa os alunos que ele mesmo cadastrou
create policy "Profissional visualiza seus alunos"
  on alunos for select
  using (auth.uid() = profissional_id);

create policy "Profissional insere alunos vinculados a si"
  on alunos for insert
  with check (auth.uid() = profissional_id);

create policy "Profissional atualiza seus alunos"
  on alunos for update
  using (auth.uid() = profissional_id);

create policy "Profissional exclui seus alunos"
  on alunos for delete
  using (auth.uid() = profissional_id);

-- =========================================================
-- Trigger para manter atualizado_em em dia
-- =========================================================

create or replace function atualizar_timestamp()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_atualizar_alunos
before update on alunos
for each row
execute function atualizar_timestamp();
