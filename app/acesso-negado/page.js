import Link from 'next/link'

export default function AcessoNegadoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-red-600">
          Acesso não autorizado
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Este e-mail não tem permissão para acessar o painel. Se você
          acredita que isso é um engano, entre em contato com o
          administrador.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
