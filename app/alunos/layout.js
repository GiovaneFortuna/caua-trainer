import { createClient } from '@/lib/supabaseServer'
import Header from './Header'

export default async function AlunosLayout({ children }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: perfil } = await supabase
    .from('profissionais')
    .select('nome_completo')
    .eq('id', user?.id)
    .single()

  return (
    <div className="min-h-screen">
      <Header nome={perfil?.nome_completo} />
      <main className="px-4 py-6 sm:px-8">{children}</main>
    </div>
  )
}
