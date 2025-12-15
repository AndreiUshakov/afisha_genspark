'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface MediaItem {
  id: string
  community_id: string
  file_path: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
}

export async function uploadCommunityMedia(formData: FormData) {
  try {
    const supabase = await createClient()

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const communityId = formData.get('communityId') as string
    
    // Собираем все файлы из FormData
    const files: File[] = []
    let index = 0
    while (true) {
      const file = formData.get(`file_${index}`) as File | null
      if (!file) break
      files.push(file)
      index++
    }

    if (!communityId) {
      return { success: false, error: 'ID сообщества не указан' }
    }

    if (files.length === 0) {
      return { success: false, error: 'Файлы не выбраны' }
    }

    // Проверяем, что сообщество принадлежит пользователю
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, slug, owner_id')
      .eq('id', communityId)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { success: false, error: 'Сообщество не найдено или у вас нет прав на его редактирование' }
    }

    // Проверяем текущее количество медиа
    const { count: currentCount } = await supabase
      .from('community_media')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)

    const maxCount = 200
    if ((currentCount || 0) + files.length > maxCount) {
      return { success: false, error: `Превышен лимит. Можно загрузить еще ${maxCount - (currentCount || 0)} фото` }
    }

    const uploadedMedia: MediaItem[] = []
    const errors: string[] = []

    // Загружаем файлы
    for (const file of files) {
      try {
        // Валидация
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Неподдерживаемый формат`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: Файл слишком большой (макс. 10MB)`)
          continue
        }

        // Генерируем уникальное имя файла
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${communityId}/${fileName}`

        // Загружаем в bucket community-media
        const { error: uploadError } = await supabase.storage
          .from('community-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Error uploading file:', uploadError)
          errors.push(`${file.name}: ${uploadError.message}`)
          continue
        }

        // Используем прокси URL
        const fileUrl = `/api/storage/community-media/${filePath}`

        // Сохраняем запись в БД
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
          errors.push(`${file.name}: Ошибка сохранения в БД`)
          continue
        }

        uploadedMedia.push(mediaRecord)
      } catch (error) {
        console.error('Error processing file:', error)
        errors.push(`${file.name}: Неожиданная ошибка`)
      }
    }

    // Инвалидируем кеш
    revalidatePath(`/dashboard/community/${community.slug}/media`)

    if (uploadedMedia.length === 0) {
      return { 
        success: false, 
        error: 'Не удалось загрузить ни одного файла', 
        errors 
      }
    }

    return { 
      success: true, 
      uploaded: uploadedMedia.length,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('Unexpected error in uploadCommunityMedia:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

export async function deleteCommunityMedia(mediaId: string, communitySlug: string) {
  try {
    const supabase = await createClient()

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    // Получаем медиа и проверяем права
    const { data: media, error: mediaError } = await supabase
      .from('community_media')
      .select(`
        *,
        communities!inner (
          id,
          owner_id,
          slug
        )
      `)
      .eq('id', mediaId)
      .single()

    if (mediaError || !media) {
      return { success: false, error: 'Медиа не найдено' }
    }

    // Проверяем, что пользователь владелец сообщества
    if (media.communities.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав на удаление этого медиа' }
    }

    // Удаляем файл из storage
    const { error: storageError } = await supabase.storage
      .from('community-media')
      .remove([media.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Продолжаем удаление записи из БД даже если файл не удалился
    }

    // Удаляем запись из БД
    const { error: deleteError } = await supabase
      .from('community_media')
      .delete()
      .eq('id', mediaId)

    if (deleteError) {
      console.error('Error deleting media record:', deleteError)
      return { success: false, error: 'Ошибка при удалении медиа' }
    }

    // Инвалидируем кеш
    revalidatePath(`/dashboard/community/${communitySlug}/media`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in deleteCommunityMedia:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}

export async function getCommunityMedia(communitySlug: string) {
  try {
    const supabase = await createClient()

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован', media: [] }
    }

    // Получаем сообщество
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, owner_id')
      .eq('slug', communitySlug)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { success: false, error: 'Сообщество не найдено', media: [] }
    }

    // Получаем медиа
    const { data: media, error: mediaError } = await supabase
      .from('community_media')
      .select('*')
      .eq('community_id', community.id)
      .order('uploaded_at', { ascending: false })

    if (mediaError) {
      console.error('Error fetching media:', mediaError)
      return { success: false, error: 'Ошибка при загрузке медиа', media: [] }
    }

    return { success: true, media: media || [] }
  } catch (error) {
    console.error('Unexpected error in getCommunityMedia:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка', media: [] }
  }
}