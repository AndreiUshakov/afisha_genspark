'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  // Валидация
  if (!email) {
    return { error: 'Email обязателен для заполнения' }
  }

  // Отправка письма для восстановления пароля
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    console.error('Ошибка запроса восстановления пароля:', error)
    return { error: 'Не удалось отправить письмо для восстановления пароля. Попробуйте позже.' }
  }

  return { success: true }
}