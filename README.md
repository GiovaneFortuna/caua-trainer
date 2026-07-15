# Gerenciamento de Alunos

Aplicação web responsiva para profissionais gerenciarem seus alunos.

**Stack:** Next.js (App Router) + React + JavaScript + Tailwind CSS no front-end,
Supabase (Auth + Postgres) no back-end.

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie um novo projeto (grátis).
2. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.
3. Vá em **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e execute.
   Isso cria as tabelas `profissionais` e `alunos`, com RLS já configurado
   para que cada profissional só veja seus próprios alunos.
4. (Opcional, recomendado) Em **Authentication > Settings**, desative a
   confirmação de e-mail obrigatória durante o desenvolvimento, para agilizar
   os testes de cadastro/login.

## 2. Configurar o projeto localmente

```bash
# instalar dependências
npm install

# copiar o exemplo de variáveis de ambiente
cp .env.local.example .env.local
```

Edite `.env.local` e cole a URL e a anon key do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000 — você será redirecionado para `/login`.

## 4. Fluxo da aplicação

- **Acesso restrito**: não existe cadastro público. Só e-mails inseridos na
  tabela `permitidos` (ver `supabase/migracao_acesso_restrito.sql`) conseguem
  logar — tanto o login quanto o RLS do banco checam essa allowlist.
- `/login` — login com Google ou Magic Link (sem senha).
- `/auth/callback` — troca o code por sessão e confere a allowlist; se o
  e-mail não for autorizado, derruba a sessão e manda para `/acesso-negado`.
- `/alunos` — rota protegida (via `middleware.js`) com o CRUD completo de
  alunos: listar, buscar, criar, editar e excluir. Layout responsivo:
  tabela no desktop, cards empilhados no mobile. A criação passa pela rota
  `app/api/alunos/route.js`, que insere no servidor usando o usuário da
  sessão (nunca confia em dado vindo do client).

### Configuração de acesso restrito no Supabase

1. Rode `supabase/schema.sql` (se ainda não rodou).
2. Rode `supabase/migracao_acesso_restrito.sql`, **trocando o e-mail de
   exemplo pelo seu e-mail real** antes de executar.
3. Em Authentication → Providers → Google, configure o Client ID/Secret.
4. Em Authentication → URL Configuration, adicione `/auth/callback` (local
   e produção) nas Redirect URLs.

## 5. Estrutura de pastas

```
app/
  login/page.js         -> tela de login
  cadastro/page.js       -> tela de cadastro do profissional
  alunos/
    layout.js            -> busca o perfil e monta o cabeçalho
    page.js               -> CRUD de alunos
    AlunoFormModal.js      -> modal de criar/editar aluno
    Header.js              -> cabeçalho com nome e logout
lib/
  supabaseClient.js       -> cliente Supabase para Client Components
  supabaseServer.js        -> cliente Supabase para Server Components
middleware.js              -> protege rotas e atualiza sessão
supabase/schema.sql        -> script de criação das tabelas + RLS
```

## Próximos passos sugeridos

- Adicionar paginação na listagem de alunos.
- Upload de foto do aluno (Supabase Storage).
- Página de detalhe do aluno com histórico de avaliações/agendamentos,
  reaproveitando a modelagem que você já tinha desenhado para o app de
  agendamento.
