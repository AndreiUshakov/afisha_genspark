import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  // Используем NEXT_PUBLIC_SITE_URL из переменных окружения вместо requestUrl.origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Ошибка обмена кода на сессию:', error)
      // Перенаправляем на страницу входа с сообщением об ошибке
      return NextResponse.redirect(
        `${siteUrl}/auth/login?error=Не удалось подтвердить email. Попробуйте войти.`
      )
    }
    
    // Добавляем параметр success для отображения сообщения об успешном подтверждении
    const separator = next.includes('?') ? '&' : '?'
    return NextResponse.redirect(`${siteUrl}${next}${separator}verified=true`)
  }

  // URL для перенаправления после подтверждения email
  return NextResponse.redirect(`${siteUrl}${next}`)
}