'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Валидация
  if (!email || !password) {
    return { error: 'Email и пароль обязательны для заполнения' }
  }

  // Вход пользователя
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Ошибка входа:', error)
    
    // Обработка специфичных ошибок
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Неверный email или пароль' }
    }
    
    // Убрали проверку подтверждения email - пользователи могут входить с неподтвержденным email
    // Уведомление о необходимости подтверждения будет показано в личном кабинете
    
    return { error: error.message || 'Ошибка при входе' }
  }

  // Успешный вход - перенаправляем в дашборд
  redirect('/dashboard')
}