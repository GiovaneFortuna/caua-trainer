'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function Header({ nome }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
      <div>
        <p className="text-sm text-gray-500">Bem-vindo(a),</p>
        <h1 className="text-lg font-semibold text-primary">{nome || 'Profissional'}</h1>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
      >
        Sair
      </button>
    </header>
  )
}
