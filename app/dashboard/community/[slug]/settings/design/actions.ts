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

    // Загрузка аватара если есть
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${communityId}/${fileName}`

      // Удаляем старый аватар если есть
      if (community.avatar_url) {
        try {
          const oldFileName = community.avatar_url.split('/').pop()
          if (oldFileName) {
            await supabase.storage
              .from('communities')
              .remove([`${communityId}/${oldFileName}`])
          }
        } catch (e) {
          console.log('Could not delete old avatar:', e)
        }
      }

      // Загружаем новый аватар
      const { error: uploadError } = await supabase.storage
        .from('communities')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return { success: false, error: 'Ошибка при загрузке логотипа' }
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('communities')
        .getPublicUrl(filePath)

      avatarUrl = urlData.publicUrl
    }

    // Загрузка обложки если есть
    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split('.').pop()
      const fileName = `cover-${Date.now()}.${fileExt}`
      const filePath = `${communityId}/${fileName}`

      // Удаляем старую обложку если есть
      if (community.cover_url) {
        try {
          const oldFileName = community.cover_url.split('/').pop()
          if (oldFileName) {
            await supabase.storage
              .from('communities')
              .remove([`${communityId}/${oldFileName}`])
          }
        } catch (e) {
          console.log('Could not delete old cover:', e)
        }
      }

      // Загружаем новую обложку
      const { error: uploadError } = await supabase.storage
        .from('communities')
        .upload(filePath, coverFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading cover:', uploadError)
        return { success: false, error: 'Ошибка при загрузке обложки' }
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('communities')
        .getPublicUrl(filePath)

      coverUrl = urlData.publicUrl
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