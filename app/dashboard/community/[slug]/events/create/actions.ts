'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateEventBasicData {
  title: string
  description: string
  category_id: string
  start_date: string
  end_date: string | null
  is_recurring: boolean
  recurrence_pattern: string | null
  location_type: 'physical' | 'online' | 'hybrid'
  venue_name: string | null
  venue_address: string | null
  online_link: string | null
  is_free: boolean
  price_min: number | null
  price_max: number | null
  currency: string
  ticket_link: string | null
  capacity: number | null
  age_restriction: string | null
  tags: string[]
  event_type: string | null
  target_audience: string[]
  wishes: string[]
  age_categories: string[]
}

export interface CreateEventDesignData {
  cover_image_url: string | null
  gallery_images: string[]
  team_members: Array<{
    name: string
    role: string
    avatar_url: string | null
  }>
}

export interface CreateEventContentData {
  content_blocks: Array<{
    id: string
    type: 'heading' | 'text' | 'image' | 'carousel'
    order: number
    data: any
  }>
}

/**
 * Создать черновик мероприятия с основными настройками
 */
export async function createEventDraft(
  communityId: string,
  communitySlug: string,
  data: CreateEventBasicData
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
      .select('id, owner_id, name, avatar_url, target_audience, wishes, age_categories')
      .eq('id', communityId)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { 
        success: false, 
        error: 'Сообщество не найдено или у вас нет прав на создание мероприятий' 
      }
    }

    // Генерируем slug из названия
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()

    // Создаем мероприятие с автоматически заполненными полями
    const { data: event, error: createError } = await supabase
      .from('events')
      .insert({
        community_id: communityId,
        organizer_id: user.id,
        organizer_name: community.name,
        organizer_avatar: community.avatar_url,
        organizer_type: 'community',
        title: data.title,
        slug,
        description: data.description,
        category_id: data.category_id,
        start_date: data.start_date,
        end_date: data.end_date,
        is_recurring: data.is_recurring,
        recurrence_pattern: data.recurrence_pattern,
        location_type: data.location_type,
        venue_name: data.venue_name,
        venue_address: data.venue_address,
        online_link: data.online_link,
        is_free: data.is_free,
        price_min: data.price_min,
        price_max: data.price_max,
        currency: data.currency,
        ticket_link: data.ticket_link,
        capacity: data.capacity,
        age_restriction: data.age_restriction,
        tags: data.tags,
        event_type: data.event_type,
        target_audience: data.target_audience,
        wishes: data.wishes,
        age_categories: data.age_categories,
        is_published: false, // Черновик
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating event:', createError)
      return { success: false, error: 'Ошибка при создании мероприятия' }
    }

    // Инвалидируем кеш
    revalidatePath(`/dashboard/community/${communitySlug}/events`)

    return { success: true, data: event }
  } catch (error) {
    console.error('Unexpected error in createEventDraft:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

/**
 * Обновить основные настройки мероприятия
 */
export async function updateEventBasic(
  eventId: string,
  communitySlug: string,
  data: Partial<CreateEventBasicData>
) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    // Проверяем права доступа
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, organizer_id, communities!inner(owner_id)')
      .eq('id', eventId)
      .single()

    if (eventError || !event || (event as any).communities.owner_id !== user.id) {
      return { success: false, error: 'Мероприятие не найдено или у вас нет прав на его редактирование' }
    }

    // Обновляем данные
    const { error: updateError } = await supabase
      .from('events')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event:', updateError)
      return { success: false, error: 'Ошибка при обновлении мероприятия' }
    }

    revalidatePath(`/dashboard/community/${communitySlug}/events`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateEventBasic:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

/**
 * Обновить оформление мероприятия
 */
export async function updateEventDesign(formData: FormData) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const eventId = formData.get('eventId') as string
    const communitySlug = formData.get('communitySlug') as string
    const coverFile = formData.get('cover') as File | null
    const removeCover = formData.get('removeCover') === 'true'
    const galleryImagesJson = formData.get('galleryImages') as string

    // Проверяем права доступа
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, cover_image_url, gallery_images, communities!inner(owner_id)')
      .eq('id', eventId)
      .single()

    if (eventError || !event || (event as any).communities.owner_id !== user.id) {
      return { success: false, error: 'Мероприятие не найдено или у вас нет прав на его редактирование' }
    }

    let coverUrl = event.cover_image_url

    // Обработка обложки
    if (removeCover) {
      if (event.cover_image_url) {
        try {
          const urlParts = event.cover_image_url.split('events/')
          const filePath = urlParts[1] || event.cover_image_url.split('/').slice(-2).join('/')
          await supabase.storage.from('events').remove([filePath])
        } catch (e) {
          console.log('Could not delete cover:', e)
        }
      }
      coverUrl = null
    } else if (coverFile && coverFile.size > 0) {
      if (!coverFile.type.startsWith('image/')) {
        return { success: false, error: 'Можно загружать только изображения' }
      }
      
      if (coverFile.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Размер обложки не должен превышать 5 МБ' }
      }

      const fileExt = coverFile.name.split('.').pop()
      const fileName = `cover-${Date.now()}.${fileExt}`
      const filePath = `${eventId}/${fileName}`

      // Удаляем старую обложку
      if (event.cover_image_url) {
        try {
          const urlParts = event.cover_image_url.split('events/')
          const oldPath = urlParts[1] || event.cover_image_url.split('/').slice(-2).join('/')
          await supabase.storage.from('events').remove([oldPath])
        } catch (e) {
          console.log('Could not delete old cover:', e)
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, coverFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading cover:', uploadError)
        return { success: false, error: `Ошибка при загрузке обложки: ${uploadError.message}` }
      }

      coverUrl = `/api/storage/events/${filePath}`
    }

    // Обновляем данные мероприятия
    const { error: updateError } = await supabase
      .from('events')
      .update({
        cover_image_url: coverUrl,
        gallery_images: galleryImagesJson ? JSON.parse(galleryImagesJson) : event.gallery_images,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event design:', updateError)
      return { success: false, error: 'Ошибка при обновлении оформления мероприятия' }
    }

    revalidatePath(`/dashboard/community/${communitySlug}/events`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateEventDesign:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

/**
 * Опубликовать мероприятие
 */
export async function publishEvent(eventId: string, communitySlug: string) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    // Проверяем права доступа
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, description, start_date, communities!inner(owner_id)')
      .eq('id', eventId)
      .single()

    if (eventError || !event || (event as any).communities.owner_id !== user.id) {
      return { success: false, error: 'Мероприятие не найдено или у вас нет прав на его публикацию' }
    }

    // Валидация обязательных полей
    if (!event.title || !event.description || !event.start_date) {
      return { 
        success: false, 
        error: 'Заполните все обязательные поля перед публикацией' 
      }
    }

    // Публикуем мероприятие
    const { error: updateError } = await supabase
      .from('events')
      .update({
        is_published: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error publishing event:', updateError)
      return { success: false, error: 'Ошибка при публикации мероприятия' }
    }

    revalidatePath(`/dashboard/community/${communitySlug}/events`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in publishEvent:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

/**
 * Получить категории для мероприятий
 */
export async function getEventCategories() {
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

/**
 * Получить медиагалерею сообщества
 */
export async function getCommunityMedia(communityId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('community_media')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching community media:', error)
      return { success: false, error: error.message, data: [] }
    }
    
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Непредвиденная ошибка', data: [] }
  }
}