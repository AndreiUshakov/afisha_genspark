'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ContentBlock, CreateBlockInput, UpdateBlockInput } from '@/lib/types/content-blocks'

export async function getEventContentBlocks(eventId: string) {
  try {
    const supabase = await createClient()
    
    const { data: blocks, error } = await supabase
      .from('event_content_blocks')
      .select('*')
      .eq('event_id', eventId)
      .order('position', { ascending: true })
    
    if (error) {
      console.error('Error fetching event content blocks:', error)
      return { success: false, error: error.message, data: [] }
    }
    
    return { success: true, data: blocks as ContentBlock[] }
  } catch (error) {
    console.error('Unexpected error fetching event content blocks:', error)
    return { success: false, error: 'Произошла ошибка при загрузке блоков', data: [] }
  }
}

export async function createEventContentBlock(eventId: string, input: CreateBlockInput) {
  try {
    const supabase = await createClient()
    
    // Проверяем, что пользователь - владелец сообщества события
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Необходима авторизация' }
    }
    
    // Проверяем права через событие и сообщество
    const { data: event } = await supabase
      .from('events')
      .select('community_id, deleted_at')
      .eq('id', eventId)
      .single()
    
    if (!event || event.deleted_at) {
      return { success: false, error: 'Событие не найдено' }
    }
    
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', event.community_id)
      .single()
    
    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав для редактирования этого события' }
    }
    
    // Создаем блок
    const { data: block, error } = await supabase
      .from('event_content_blocks')
      .insert({
        event_id: eventId,
        block_type: input.block_type,
        content: input.content,
        position: input.position
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating event content block:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath(`/dashboard/community/[slug]/events/[id]/edit/content`, 'page')
    
    return { success: true, data: block as ContentBlock }
  } catch (error) {
    console.error('Unexpected error creating event content block:', error)
    return { success: false, error: 'Произошла ошибка при создании блока' }
  }
}

export async function updateEventContentBlock(eventId: string, input: UpdateBlockInput) {
  try {
    const supabase = await createClient()
    
    // Проверяем права
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Необходима авторизация' }
    }
    
    const { data: event } = await supabase
      .from('events')
      .select('community_id, deleted_at')
      .eq('id', eventId)
      .single()
    
    if (!event || event.deleted_at) {
      return { success: false, error: 'Событие не найдено' }
    }
    
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', event.community_id)
      .single()
    
    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав для редактирования этого события' }
    }
    
    // Обновляем блок
    const updateData: any = {}
    if (input.content !== undefined) updateData.content = input.content
    if (input.position !== undefined) updateData.position = input.position
    
    const { data: block, error } = await supabase
      .from('event_content_blocks')
      .update(updateData)
      .eq('id', input.id)
      .eq('event_id', eventId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating event content block:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath(`/dashboard/community/[slug]/events/[id]/edit/content`, 'page')
    
    return { success: true, data: block as ContentBlock }
  } catch (error) {
    console.error('Unexpected error updating event content block:', error)
    return { success: false, error: 'Произошла ошибка при обновлении блока' }
  }
}

export async function deleteEventContentBlock(eventId: string, blockId: string) {
  try {
    const supabase = await createClient()
    
    // Проверяем права
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Необходима авторизация' }
    }
    
    const { data: event } = await supabase
      .from('events')
      .select('community_id, deleted_at')
      .eq('id', eventId)
      .single()
    
    if (!event || event.deleted_at) {
      return { success: false, error: 'Событие не найдено' }
    }
    
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', event.community_id)
      .single()
    
    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав для редактирования этого события' }
    }
    
    // Удаляем блок
    const { error } = await supabase
      .from('event_content_blocks')
      .delete()
      .eq('id', blockId)
      .eq('event_id', eventId)
    
    if (error) {
      console.error('Error deleting event content block:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath(`/dashboard/community/[slug]/events/[id]/edit/content`, 'page')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting event content block:', error)
    return { success: false, error: 'Произошла ошибка при удалении блока' }
  }
}

export async function reorderEventContentBlocks(eventId: string, blockIds: string[]) {
  try {
    const supabase = await createClient()
    
    // Проверяем права
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Необходима авторизация' }
    }
    
    const { data: event } = await supabase
      .from('events')
      .select('community_id, deleted_at')
      .eq('id', eventId)
      .single()
    
    if (!event || event.deleted_at) {
      return { success: false, error: 'Событие не найдено' }
    }
    
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', event.community_id)
      .single()
    
    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав для редактирования этого события' }
    }
    
    // Шаг 1: Устанавливаем временные позиции (отрицательные числа)
    // чтобы избежать конфликта с unique constraint
    for (let i = 0; i < blockIds.length; i++) {
      const { error } = await supabase
        .from('event_content_blocks')
        .update({ position: -(i + 1) })
        .eq('id', blockIds[i])
        .eq('event_id', eventId)
      
      if (error) {
        console.error(`Error setting temporary position for block ${blockIds[i]}:`, error)
        return { success: false, error: `Ошибка обновления позиции блока: ${error.message}` }
      }
    }
    
    // Шаг 2: Устанавливаем правильные позиции
    for (let i = 0; i < blockIds.length; i++) {
      const { error } = await supabase
        .from('event_content_blocks')
        .update({ position: i })
        .eq('id', blockIds[i])
        .eq('event_id', eventId)
      
      if (error) {
        console.error(`Error updating final position for block ${blockIds[i]}:`, error)
        return { success: false, error: `Ошибка обновления позиции блока: ${error.message}` }
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error reordering event content blocks:', error)
    return { success: false, error: 'Произошла ошибка при изменении порядка блоков' }
  }
}

export async function uploadEventBlockImage(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Необходима авторизация' }
    }
    
    const file = formData.get('image') as File
    const communityId = formData.get('communityId') as string
    
    if (!file || !communityId) {
      return { success: false, error: 'Отсутствует файл или ID сообщества' }
    }
    
    // Проверяем права
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', communityId)
      .single()
    
    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав для загрузки изображений в это сообщество' }
    }
    
    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const fileName = `${timestamp}-${randomStr}.${fileExt}`
    const filePath = `${communityId}/${fileName}`
    
    // Загружаем в bucket
    const { error: uploadError } = await supabase.storage
      .from('community-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return { success: false, error: uploadError.message }
    }
    
    // Используем прокси URL
    const fileUrl = `/api/storage/community-media/${filePath}`
    
    // Сохраняем запись в таблицу community_media
    const { data: mediaRecord, error: dbError } = await supabase
      .from('community_media')
      .insert({
        community_id: communityId,
        file_path: filePath,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single()
    
    if (dbError) {
      console.error('Error saving media record:', dbError)
      // Удаляем файл из storage если не удалось сохранить в БД
      await supabase.storage.from('community-media').remove([filePath])
      return { success: false, error: 'Ошибка сохранения в медиагалерею' }
    }
    
    // Инвалидируем кеш медиагалереи
    revalidatePath(`/dashboard/community/[slug]/media`, 'page')
    
    return { success: true, data: { url: fileUrl, path: filePath } }
  } catch (error) {
    console.error('Unexpected error uploading image:', error)
    return { success: false, error: 'Произошла ошибка при загрузке изображения' }
  }
}