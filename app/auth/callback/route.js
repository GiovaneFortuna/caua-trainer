import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}/login`)
    }

    // Segunda camada de proteção (além do RLS no banco): confere a
    // allowlist via a função is_authorized() (security definer, já que a
    // tabela "permitidos" não tem policy de leitura para o client comum)
    // e derruba a sessão na hora se o e-mail não for autorizado.
    const { data: autorizado } = await supabase.rpc('is_authorized')

    if (!autorizado) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/acesso-negado`)
    }

    // Garante que o perfil existe em "profissionais", mesmo que o trigger
    // de auth.users não tenha disparado (ex: usuário já existia antes da
    // migração, ou já tinha tentado logar antes de entrar na allowlist).
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('profissionais').upsert(
        {
          id: user.id,
          nome_completo:
            user.user_metadata?.full_name ?? user.email,
          email: user.email,
        },
        { onConflict: 'id' }
      )
    }
  }

  return NextResponse.redirect(`${origin}/alunos`)
}