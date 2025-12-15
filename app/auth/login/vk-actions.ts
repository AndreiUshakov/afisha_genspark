'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithVK() {
  const supabase = await createClient()

  // Получаем URL для редиректа после авторизации
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.gorodzhivet.ru'
  const redirectTo = `${siteUrl}/auth/callback?next=/dashboard`

  // Инициируем OAuth flow с VK
  // VK в Supabase использует название 'vk' (lowercase)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'vk' as any, // TypeScript может не знать о VK провайдере
    options: {
      redirectTo,
      scopes: 'email', // Запрашиваем доступ к email
    },
  })

  if (error) {
    console.error('Ошибка авторизации через VK:', error)
    redirect(`/auth/login?error=${encodeURIComponent('Ошибка авторизации через VK')}`)
  }

  if (data.url) {
    // Перенаправляем пользователя на страницу авторизации VK
    redirect(data.url)
  }

  // Если URL не получен, возвращаем на страницу входа с ошибкой
  redirect('/auth/login?error=Не удалось инициировать авторизацию через VK')
}