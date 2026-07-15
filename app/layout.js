import './globals.css'

export const metadata = {
  title: 'Cauã de Matos',
  description: 'Plataforma para Cauã de Matos',
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
