'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  // Валидация
  if (!email || !password || !confirmPassword) {
    return { error: 'Все поля обязательны для заполнения' }
  }

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают' }
  }

  if (password.length < 8) {
    return { error: 'Пароль должен содержать минимум 8 символов' }
  }

  // Email валидация
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Некорректный email адрес' }
  }

  try {
    // Регистрация пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email,
        }
      }
    })

    if (error) {
      console.error('Ошибка регистрации:', error)
      
      // Игнорируем ошибку email если пользователь создан
      if (error.message.includes('confirmation email') && data?.user) {
        // Пользователь создан, но email не отправлен - это OK для self-hosted
        console.log('Пользователь создан, email подтверждение пропущено')
      } else if (error.message.includes('already registered')) {
        return { error: 'Пользователь с таким email уже зарегистрирован' }
      } else {
        return { error: error.message || 'Ошибка при регистрации' }
      }
    }

    if (!data.user) {
      return { error: 'Не удалось создать пользователя' }
    }

    // Успешная регистрация - сразу входим в систему
    // Профиль будет создан автоматически через триггер handle_new_user в БД
    redirect('/dashboard')
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    return { error: 'Произошла неожиданная ошибка' }
  }
}