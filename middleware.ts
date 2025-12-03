import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Просто пропускаем все запросы без обработки Supabase
  // Аутентификация будет обрабатываться на уровне страниц
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}