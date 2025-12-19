'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadEventCoverImage(formData: FormData) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const eventId = formData.get('eventId') as string
    const communityId = formData.get('communityId') as string
    const coverFile = formData.get('coverFile') as File | null

    if (!coverFile) {
      return { success: false, error: 'Файл не выбран' }
    }

    // Проверяем права доступа к сообществу
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, slug, owner_id')
      .eq('id', communityId)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { success: false, error: 'Сообщество не найдено или у вас нет прав' }
    }

    // Валидация файла
    if (!coverFile.type.startsWith('image/')) {
      return { success: false, error: 'Можно загружать только изображения' }
    }

    if (coverFile.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Размер файла не должен превышать 10 МБ' }
    }

    // Генерируем уникальное имя файла
    const fileExt = coverFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${communityId}/${fileName}`

    // Загружаем в bucket community-media
    const { error: uploadError } = await supabase.storage
      .from('community-media')
      .upload(filePath, coverFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return { success: false, error: `Ошибка загрузки: ${uploadError.message}` }
    }

    // Используем прокси URL
    const fileUrl = `/api/storage/community-media/${filePath}`

    // Сохраняем запись в БД медиагалереи
    const { data: mediaRecord, error: dbError } = await supabase
      .from('community_media')
      .insert({
        community_id: communityId,
        file_path: filePath,
        file_url: fileUrl,
        file_name: coverFile.name,
        file_size: coverFile.size,
        mime_type: coverFile.type
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving media record:', dbError)
      // Удаляем файл из storage если не удалось сохранить в БД
      await supabase.storage.from('community-media').remove([filePath])
      return { success: false, error: 'Ошибка сохранения в БД' }
    }

    // Обновляем обложку мероприятия
    const { error: updateError } = await supabase
      .from('events')
      .update({
        cover_image_url: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event:', updateError)
      return { success: false, error: 'Ошибка обновления мероприятия' }
    }

    revalidatePath(`/dashboard/community/${community.slug}/events`)
    revalidatePath(`/dashboard/community/${community.slug}/events/${eventId}/edit`)
    revalidatePath(`/dashboard/community/${community.slug}/media`)

    return { success: true, mediaId: mediaRecord.id, fileUrl }
  } catch (error) {
    console.error('Unexpected error in uploadEventCoverImage:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

export async function updateEventDesignCover(formData: FormData) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const eventId = formData.get('eventId') as string
    const communitySlug = formData.get('communitySlug') as string
    const coverMediaId = formData.get('coverMediaId') as string | null
    const removeCover = formData.get('removeCover') === 'true'

    // Получаем мероприятие и проверяем права доступа
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, cover_image_url, community_id, communities!inner(owner_id, slug)')
      .eq('id', eventId)
      .single()

    if (eventError || !event || (event as any).communities.owner_id !== user.id) {
      return { success: false, error: 'Мероприятие не найдено или у вас нет прав на его редактирование' }
    }

    let coverUrl = event.cover_image_url

    // Обработка обложки
    if (removeCover) {
      coverUrl = null
    } else if (coverMediaId) {
      // Получаем URL из медиагалереи сообщества
      const { data: media, error: mediaError } = await supabase
        .from('community_media')
        .select('file_url')
        .eq('id', coverMediaId)
        .eq('community_id', event.community_id)
        .single()

      if (mediaError || !media) {
        return { success: false, error: 'Изображение не найдено в медиагалерее' }
      }

      coverUrl = media.file_url
    }

    // Обновляем данные мероприятия
    const { error: updateError } = await supabase
      .from('events')
      .update({
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event design:', updateError)
      return { success: false, error: 'Ошибка при обновлении оформления мероприятия' }
    }

    revalidatePath(`/dashboard/community/${communitySlug}/events`)
    revalidatePath(`/dashboard/community/${communitySlug}/events/${eventId}/edit`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateEventDesignCover:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}