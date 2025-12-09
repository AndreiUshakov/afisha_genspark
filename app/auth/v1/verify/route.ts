import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const redirectTo = requestUrl.searchParams.get('redirect_to')
  
  // Используем NEXT_PUBLIC_SITE_URL из переменных окружения вместо requestUrl.origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  console.log('=== EMAIL VERIFICATION REQUEST ===')
  console.log('Token:', token ? 'present' : 'missing')
  console.log('Type:', type)
  console.log('Redirect to:', redirectTo)
  console.log('Site URL:', siteUrl)

  if (!token) {
    console.error('Токен подтверждения отсутствует')
    return NextResponse.redirect(
      `${siteUrl}/auth/login?error=Неверная ссылка подтверждения`
    )
  }

  if (type === 'signup') {
    // Это подтверждение регистрации
    const supabase = await createClient()
    
    try {
      // Используем verifyOtp для подтверждения email
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) {
        console.error('Ошибка подтверждения email:', error)
        return NextResponse.redirect(
          `${siteUrl}/auth/login?error=Не удалось подтвердить email. Попробуйте войти или запросите новое письмо.`
        )
      }

      console.log('Email успешно подтвержден:', data.user?.email)

      // Если redirectTo уже полный URL, используем его напрямую
      // Иначе добавляем к siteUrl
      let finalRedirect: string
      if (redirectTo) {
        // Проверяем, является ли redirectTo полным URL
        if (redirectTo.startsWith('http://') || redirectTo.startsWith('https://')) {
          finalRedirect = redirectTo
        } else {
          finalRedirect = `${siteUrl}${redirectTo}`
        }
      } else {
        finalRedirect = `${siteUrl}/dashboard`
      }
      
      return NextResponse.redirect(finalRedirect)
      
    } catch (err) {
      console.error('Неожиданная ошибка при подтверждении:', err)
      return NextResponse.redirect(
        `${siteUrl}/auth/login?error=Произошла ошибка при подтверждении email`
      )
    }
  }

  // Для других типов подтверждения (например, смена email)
  console.log('Неизвестный тип подтверждения:', type)
  return NextResponse.redirect(
    `${siteUrl}/auth/login?message=Проверьте вашу почту для завершения процесса`
  )
}