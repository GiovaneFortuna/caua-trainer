import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rotaProtegida = request.nextUrl.pathname.startsWith('/alunos')
  const rotaLogin = request.nextUrl.pathname.startsWith('/login')

  if (!user && rotaProtegida) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && rotaLogin) {
    return NextResponse.redirect(new URL('/alunos', request.url))
  }

  return response
}

export const config = {
  matcher: ['/alunos/:path*', '/login'],
}
