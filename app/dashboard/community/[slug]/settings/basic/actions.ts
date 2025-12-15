'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UpdateBasicSettingsData {
  name: string
  description: string
  category_id: string
  target_audience: string[]
  wishes: string[]
  age_categories: string[]
  contact_email: string
  contact_phone?: string
  social_links: {
    vk?: string
    telegram?: string
    max?: string
    website?: string
  }
}

export async function updateBasicSettings(
  communityId: string,
  data: UpdateBasicSettingsData
) {
  try {
    const supabase = await createClient()

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    // Проверяем, что сообщество принадлежит пользователю
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, owner_id, slug')
      .eq('id', communityId)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { 
        success: false, 
        error: 'Сообщество не найдено или у вас нет прав на его редактирование' 
      }
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.contact_email)) {
      return { success: false, error: 'Некорректный email адрес' }
    }

    // Обновляем данные сообщества
    const { error: updateError } = await supabase
      .from('communities')
      .update({
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        target_audience: data.target_audience,
        wishes: data.wishes,
        age_categories: data.age_categories,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        social_links: data.social_links,
        updated_at: new Date().toISOString()
      })
      .eq('id', communityId)
      .eq('owner_id', user.id)

    if (updateError) {
      console.error('Error updating community:', updateError)
      return { success: false, error: 'Ошибка при обновлении данных сообщества' }
    }

    // Инвалидируем кеш
    revalidatePath(`/dashboard/community/${community.slug}/settings/basic`)
    revalidatePath(`/dashboard/community/${community.slug}`)
    revalidatePath(`/communities/${community.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateBasicSettings:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')
    
    if (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: error.message, data: [] }
    }
    
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Непредвиденная ошибка', data: [] }
  }
}