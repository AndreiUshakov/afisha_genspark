'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProfileData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  website: string | null
  social_links: Record<string, string>
  role: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  full_name?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  avatar_url?: string
}

/**
 * Получить данные профиля текущего пользователя
 */
export async function getProfile(): Promise<{ data: ProfileData | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'Пользователь не авторизован' }
    }

    // Получаем профиль из базы данных
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Ошибка получения профиля:', profileError)
      return { data: null, error: 'Не удалось загрузить профиль' }
    }

    return { data: profile as ProfileData, error: null }
  } catch (error) {
    console.error('Ошибка в getProfile:', error)
    return { data: null, error: 'Произошла ошибка при загрузке профиля' }
  }
}

/**
 * Обновить данные профиля
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    
    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    // Обновляем профиль
    const { error: updateError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)

    if (updateError) {
      console.error('Ошибка обновления профиля:', updateError)
      return { success: false, error: 'Не удалось обновить профиль' }
    }

    // Также обновляем user_metadata для синхронизации имени
    if (data.full_name !== undefined) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: data.full_name }
      })

      if (metadataError) {
        console.error('Ошибка обновления metadata:', metadataError)
      }
    }

    // Обновляем кеш всех страниц с данными профиля
    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    revalidatePath('/', 'layout') // Инвалидируем header на всех страницах
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Ошибка в updateProfile:', error)
    return { success: false, error: 'Произошла ошибка при обновлении профиля' }
  }
}

/**
 * Загрузить аватар пользователя
 */
export async function uploadAvatar(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { url: null, error: 'Пользователь не авторизован' }
    }

    const file = formData.get('avatar') as File
    
    if (!file) {
      return { url: null, error: 'Файл не выбран' }
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Можно загружать только изображения' }
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'Размер файла не должен превышать 5MB' }
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Загружаем файл в Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Ошибка загрузки файла:', uploadError)
      return { url: null, error: 'Не удалось загрузить файл' }
    }

    // Используем прокси API route для обхода проблемы Mixed Content (HTTP/HTTPS)
    // Вместо прямой ссылки на Supabase используем наш API endpoint
    const publicUrl = `/api/storage/profiles/${filePath}`

    // Обновляем профиль с новым URL аватара
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Ошибка обновления профиля:', updateError)
      return { url: null, error: 'Не удалось обновить профиль' }
    }

    // Также обновляем user_metadata для синхронизации
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })

    if (metadataError) {
      console.error('Ошибка обновления metadata:', metadataError)
    }

    // Обновляем кеш всех страниц с аватаром
    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    revalidatePath('/', 'layout') // Инвалидируем header на всех страницах

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Ошибка в uploadAvatar:', error)
    return { url: null, error: 'Произошла ошибка при загрузке аватара' }
  }
}

/**
 * Проверить, подтвержден ли email пользователя
 */
export async function checkEmailVerification(): Promise<{ verified: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { verified: false, error: 'Пользователь не авторизован' }
    }

    // Проверяем поле email_confirmed_at в auth.users
    const verified = !!user.email_confirmed_at

    return { verified, error: null }
  } catch (error) {
    console.error('Ошибка в checkEmailVerification:', error)
    return { verified: false, error: 'Произошла ошибка при проверке email' }
  }
}