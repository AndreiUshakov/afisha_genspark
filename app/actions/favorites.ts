'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Favorite {
  id: string
  user_id: string
  event_id: string | null
  community_id: string | null
  expert_id: string | null
  created_at: string
}

/**
 * Добавить мероприятие в избранное
 */
export async function addToFavorites(eventId: string) {
  try {
    const supabase = await createClient()
    
    // Проверяем аутентификацию
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Необходимо войти в систему',
        requiresAuth: true
      }
    }

    // Получаем информацию о событии для извлечения community_id и expert_id
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, community_id, organizer_id, organizer_type')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      console.error('Error fetching event:', eventError)
      return {
        success: false,
        error: 'Мероприятие не найдено'
      }
    }

    // Определяем expert_id на основе organizer_type
    let expertId = null
    if (event.organizer_type === 'expert' || event.organizer_type === 'individual') {
      // Если организатор - эксперт, ищем его профиль
      const { data: expert } = await supabase
        .from('experts')
        .select('id')
        .eq('profile_id', event.organizer_id)
        .single()
      
      if (expert) {
        expertId = expert.id
      }
    }

    // Добавляем в избранное
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        event_id: eventId,
        community_id: event.community_id,
        expert_id: expertId
      })
      .select()
      .single()

    if (error) {
      // Проверяем на дубликат
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Мероприятие уже в избранном'
        }
      }
      console.error('Error adding to favorites:', error)
      return {
        success: false,
        error: 'Ошибка при добавлении в избранное'
      }
    }

    // Обновляем кэш страниц
    revalidatePath('/dashboard/favorites')
    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Unexpected error in addToFavorites:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка'
    }
  }
}

/**
 * Удалить мероприятие из избранного
 */
export async function removeFromFavorites(eventId: string) {
  try {
    const supabase = await createClient()
    
    // Проверяем аутентификацию
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Необходимо войти в систему',
        requiresAuth: true
      }
    }

    // Удаляем из избранного
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId)

    if (error) {
      console.error('Error removing from favorites:', error)
      return {
        success: false,
        error: 'Ошибка при удалении из избранного'
      }
    }

    // Обновляем кэш страниц
    revalidatePath('/dashboard/favorites')
    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)

    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error in removeFromFavorites:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка'
    }
  }
}

/**
 * Проверить, находится ли мероприятие в избранном
 */
export async function checkIsFavorite(eventId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    // Проверяем аутентификацию
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return false
    }

    // Проверяем наличие в избранном
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle()

    if (error) {
      console.error('Error checking favorite status:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Unexpected error in checkIsFavorite:', error)
    return false
  }
}

/**
 * Получить все избранные мероприятия пользователя
 */
export async function getUserFavorites() {
  try {
    const supabase = await createClient()
    
    // Проверяем аутентификацию
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Необходимо войти в систему',
        requiresAuth: true,
        favorites: []
      }
    }

    // Получаем избранные мероприятия с JOIN к таблице events
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        event_id,
        community_id,
        expert_id,
        created_at,
        events (
          id,
          title,
          slug,
          description,
          cover_image_url,
          start_date,
          end_date,
          location_type,
          venue_name,
          venue_address,
          is_free,
          price_min,
          price_max,
          organizer_name,
          organizer_avatar,
          tags,
          is_published
        )
      `)
      .eq('user_id', user.id)
      .not('event_id', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return {
        success: false,
        error: 'Ошибка при загрузке избранного',
        favorites: []
      }
    }

    return {
      success: true,
      favorites: data || []
    }
  } catch (error) {
    console.error('Unexpected error in getUserFavorites:', error)
    return {
      success: false,
      error: 'Произошла непредвиденная ошибка',
      favorites: []
    }
  }
}

/**
 * Переключить статус избранного (добавить/удалить)
 */
export async function toggleFavorite(eventId: string) {
  const isFavorite = await checkIsFavorite(eventId)
  
  if (isFavorite) {
    return await removeFromFavorites(eventId)
  } else {
    return await addToFavorites(eventId)
  }
}