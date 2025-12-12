'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Валидация
  if (!password || !confirmPassword) {
    return { error: 'Все поля обязательны для заполнения' }
  }

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают' }
  }

  if (password.length < 6) {
    return { error: 'Пароль должен содержать минимум 6 символов' }
  }

  // Обновление пароля
  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error('Ошибка сброса пароля:', error)
    return {
      error: 'Не удалось обновить пароль. Возможно, ссылка устарела. Попробуйте запросить новую.'
    }
  }

  // Успешное обновление пароля - перенаправляем на страницу входа
  redirect('/auth/login?password_updated=true')
}