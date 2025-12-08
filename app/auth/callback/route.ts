import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Ошибка обмена кода на сессию:', error)
      // Перенаправляем на страницу входа с сообщением об ошибке
      return NextResponse.redirect(
        `${origin}/auth/login?error=Не удалось подтвердить email. Попробуйте войти.`
      )
    }
  }

  // URL для перенаправления после подтверждения email
  return NextResponse.redirect(`${origin}${next}`)
}