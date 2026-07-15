import './globals.css'

export const metadata = {
  title: 'Gerenciamento de Alunos',
  description: 'Plataforma para profissionais gerenciarem seus alunos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased text-gray-800">
        {children}
      </body>
    </html>
  )
}
