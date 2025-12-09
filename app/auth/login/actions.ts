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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Ошибка входа:', error)
    
    // Обработка специфичных ошибок
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Неверный email или пароль' }
    }
    
    // Запрещаем вход с неподтвержденным email
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Пожалуйста, подтвердите ваш email. Проверьте почту и перейдите по ссылке из письма.' }
    }
    
    return { error: error.message || 'Ошибка при входе' }
  }

  // Дополнительная проверка подтверждения email на стороне клиента
  if (data?.user && !data.user.email_confirmed_at) {
    // Выходим из системы, если email не подтвержден
    await supabase.auth.signOut()
    return { error: 'Пожалуйста, подтвердите ваш email. Проверьте почту и перейдите по ссылке из письма.' }
  }

  // Успешный вход - перенаправляем в дашборд
  redirect('/dashboard')
}