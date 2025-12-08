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

  // Получаем URL сайта из переменных окружения
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  console.log('=== НАЧАЛО РЕГИСТРАЦИИ ===')
  console.log('Email:', email)
  console.log('Site URL:', siteUrl)
  console.log('Password length:', password.length)
  
  try {
    // Регистрация пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          email,
        }
      }
    })

    if (error) {
      console.error('=== ОШИБКА ОТ SUPABASE ===')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error status:', error.status)
      console.error('Full error:', JSON.stringify(error, null, 2))
      console.error('========================')
      
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
      console.error('=== НЕТ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ===')
      console.error('Data object:', JSON.stringify(data, null, 2))
      console.error('==============================')
      return { error: 'Не удалось создать пользователя' }
    }

    console.log('=== УСПЕШНАЯ РЕГИСТРАЦИЯ ===')
    console.log('User ID:', data.user.id)
    console.log('User email:', data.user.email)
    console.log('Session:', data.session ? 'Создана' : 'Не создана')
    console.log('===========================')
  } catch (err) {
    // Подробное журналирование ошибки
    console.error('=== ОШИБКА РЕГИСТРАЦИИ ===')
    console.error('Тип ошибки:', err instanceof Error ? err.constructor.name : typeof err)
    console.error('Сообщение:', err instanceof Error ? err.message : String(err))
    console.error('Stack trace:', err instanceof Error ? err.stack : 'N/A')
    console.error('Полный объект ошибки:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
    console.error('Email:', email)
    console.error('=========================')
    
    // Возвращаем детальное сообщение об ошибке
    const errorMessage = err instanceof Error ? err.message : String(err)
    return {
      error: `Произошла неожиданная ошибка: ${errorMessage}. Проверьте консоль сервера для деталей.`
    }
  }

  // Успешная регистрация - редирект ПОСЛЕ try-catch
  // Профиль будет создан автоматически через триггер handle_new_user в БД
  redirect('/dashboard')
}