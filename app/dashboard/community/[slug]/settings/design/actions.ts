'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCommunityDesign(formData: FormData) {
  try {
    const supabase = await createClient()

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const communityId = formData.get('communityId') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const avatarFile = formData.get('avatar') as File | null
    const coverFile = formData.get('cover') as File | null
    const removeAvatar = formData.get('removeAvatar') === 'true'
    const removeCover = formData.get('removeCover') === 'true'

    // Проверяем, что сообщество принадлежит пользователю
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, owner_id, slug, avatar_url, cover_url')
      .eq('id', communityId)
      .eq('owner_id', user.id)
      .single()

    if (communityError || !community) {
      return { success: false, error: 'Сообщество не найдено или у вас нет прав на его редактирование' }
    }

    let avatarUrl = community.avatar_url
    let coverUrl = community.cover_url

    // Обработка удаления аватара
    if (removeAvatar) {
      console.log('Removing avatar for community:', communityId)
      // Удаляем файл из storage если есть
      if (community.avatar_url) {
        try {
          // Извлекаем путь файла из URL (может быть прокси URL или прямой URL)
          const urlParts = community.avatar_url.split('communities/')
          const filePath = urlParts[1] || community.avatar_url.split('/').slice(-2).join('/')
          console.log('Deleting avatar file:', filePath)
          
          const { error: deleteError } = await supabase.storage
            .from('communities')
            .remove([filePath])
          
          if (deleteError) {
            console.error('Error deleting avatar file:', deleteError)
          }
        } catch (e) {
          console.log('Could not delete avatar:', e)
        }
      }
      avatarUrl = null
    }
    // Загрузка аватара если есть
    else if (avatarFile && avatarFile.size > 0) {
      console.log('Uploading new avatar for community:', communityId, 'Size:', avatarFile.size)
      
      // Проверка типа файла
      if (!avatarFile.type.startsWith('image/')) {
        return { success: false, error: 'Можно загружать только изображения' }
      }
      
      // Проверка размера файла (максимум 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Размер логотипа не должен превышать 5 МБ' }
      }
      
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${communityId}/${fileName}`

      // Удаляем старый аватар если есть
      if (community.avatar_url) {
        try {
          // Извлекаем путь файла из URL
          const urlParts = community.avatar_url.split('communities/')
          const filePath = urlParts[1] || community.avatar_url.split('/').slice(-2).join('/')
          console.log('Deleting old avatar file:', filePath)
          
          const { error: deleteError } = await supabase.storage
            .from('communities')
            .remove([filePath])
          
          if (deleteError) {
            console.error('Error deleting old avatar:', deleteError)
          }
        } catch (e) {
          console.log('Could not delete old avatar:', e)
        }
      }

      // Загружаем новый аватар
      console.log('Uploading avatar to path:', filePath)
      const { error: uploadError } = await supabase.storage
        .from('communities')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        console.error('Upload error details:', JSON.stringify(uploadError, null, 2))
        return { success: false, error: `Ошибка при загрузке логотипа: ${uploadError.message}` }
      }

      // Используем прокси URL для избежания mixed content ошибок
      avatarUrl = `/api/storage/communities/${filePath}`
    }

    // Обработка удаления обложки
    if (removeCover) {
      console.log('Removing cover for community:', communityId)
      // Удаляем файл из storage если есть
      if (community.cover_url) {
        try {
          // Извлекаем путь файла из URL (может быть прокси URL или прямой URL)
          const urlParts = community.cover_url.split('communities/')
          const filePath = urlParts[1] || community.cover_url.split('/').slice(-2).join('/')
          console.log('Deleting cover file:', filePath)
          
          const { error: deleteError } = await supabase.storage
            .from('communities')
            .remove([filePath])
          
          if (deleteError) {
            console.error('Error deleting cover file:', deleteError)
          }
        } catch (e) {
          console.log('Could not delete cover:', e)
        }
      }
      coverUrl = null
    }
    // Загрузка обложки если есть
    else if (coverFile && coverFile.size > 0) {
      console.log('Uploading new cover for community:', communityId, 'Size:', coverFile.size)
      
      // Проверка типа файла
      if (!coverFile.type.startsWith('image/')) {
        return { success: false, error: 'Можно загружать только изображения' }
      }
      
      // Проверка размера файла (максимум 5MB)
      if (coverFile.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Размер обложки не должен превышать 5 МБ' }
      }
      
      const fileExt = coverFile.name.split('.').pop()
      const fileName = `cover-${Date.now()}.${fileExt}`
      const filePath = `${communityId}/${fileName}`

      // Удаляем старую обложку если есть
      if (community.cover_url) {
        try {
          // Извлекаем путь файла из URL
          const urlParts = community.cover_url.split('communities/')
          const filePath = urlParts[1] || community.cover_url.split('/').slice(-2).join('/')
          console.log('Deleting old cover file:', filePath)
          
          const { error: deleteError } = await supabase.storage
            .from('communities')
            .remove([filePath])
          
          if (deleteError) {
            console.error('Error deleting old cover:', deleteError)
          }
        } catch (e) {
          console.log('Could not delete old cover:', e)
        }
      }

      // Загружаем новую обложку
      console.log('Uploading cover to path:', filePath)
      const { error: uploadError } = await supabase.storage
        .from('communities')
        .upload(filePath, coverFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading cover:', uploadError)
        console.error('Upload error details:', JSON.stringify(uploadError, null, 2))
        return { success: false, error: `Ошибка при загрузке обложки: ${uploadError.message}` }
      }

      // Используем прокси URL для избежания mixed content ошибок
      coverUrl = `/api/storage/communities/${filePath}`
    }

    // Обновляем данные сообщества
    const { error: updateError } = await supabase
      .from('communities')
      .update({
        name,
        description,
        location,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', communityId)
      .eq('owner_id', user.id)

    if (updateError) {
      console.error('Error updating community:', updateError)
      return { success: false, error: 'Ошибка при обновлении данных сообщества' }
    }

    // Инвалидируем кеш
    revalidatePath(`/dashboard/community/${community.slug}/settings/design`)
    revalidatePath(`/dashboard/community/${community.slug}`)
    revalidatePath(`/communities/${community.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateCommunityDesign:', error)
    return { success: false, error: 'Произошла непредвиденная ошибка' }
  }
}