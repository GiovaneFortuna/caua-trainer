import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(request) {
  const supabase = createClient()

  // 1) Confirma quem está autenticado a partir do cookie de sessão
  //    (nunca a partir de um campo enviado pelo client).
  const {
    data: { user },
    error: erroAuth,
  } = await supabase.auth.getUser()

  if (erroAuth || !user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body = await request.json()

  // 2) Validação mínima dos campos esperados.
  if (!body.nome || typeof body.nome !== 'string') {
    return NextResponse.json(
      { error: 'O campo "nome" é obrigatório.' },
      { status: 400 }
    )
  }

  // 3) Insert: profissional_id vem do usuário da sessão, nunca do body.
  const { data, error } = await supabase
    .from('alunos')
    .insert({
      nome: body.nome,
      email: body.email ?? null,
      telefone: body.telefone ?? null,
      data_nascimento: body.data_nascimento ?? null,
      observacoes: body.observacoes ?? null,
      profissional_id: user.id,
    })
    .select()
    .single()

  if (error) {
    // Loga no servidor para depuração; não vaza detalhes internos ao client.
    console.error('Erro ao inserir aluno:', error)

    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'Perfil de profissional não encontrado para este usuário.' },
        { status: 409 }
      )
    }

    if (error.code === '42501') {
      return NextResponse.json(
        { error: 'Acesso negado pela política de segurança do banco.' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Não foi possível cadastrar o aluno.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ aluno: data }, { status: 201 })
}
