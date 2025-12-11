'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface CreateCommunityData {
  name: string;
  slug: string;
  category_id: string;
  description: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    vk?: string;
    telegram?: string;
    website?: string;
    facebook?: string;
  };
  target_audience?: string[];
  wishes?: string[];
  age_category?: string;
  avatar_url?: string;
  cover_url?: string;
  page_content?: any;
  photo_albums?: any[];
}

export async function createCommunity(data: CreateCommunityData) {
  try {
    const supabase = await createClient();

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: 'Необходима авторизация' 
      };
    }

    // Проверяем подтверждение email
    if (!user.email_confirmed_at) {
      return {
        success: false,
        error: 'Необходимо подтвердить email для создания сообщества'
      };
    }

    // Проверяем уникальность slug
    const { data: existingCommunity } = await supabase
      .from('communities')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (existingCommunity) {
      return {
        success: false,
        error: 'URL-адрес уже занят. Пожалуйста, выберите другой.'
      };
    }

    // Создаем сообщество
    const { data: community, error: createError } = await supabase
      .from('communities')
      .insert({
        owner_id: user.id,
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        description: data.description,
        location: data.location || '',
        social_links: data.social_links || {},
        target_audience: data.target_audience || [],
        wishes: data.wishes || [],
        age_category: data.age_category || null,
        avatar_url: data.avatar_url || null,
        cover_url: data.cover_url || null,
        page_content: data.page_content || {},
        photo_albums: data.photo_albums || [],
        is_published: false, // По умолчанию черновик
        is_verified: false
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating community:', createError);
      return {
        success: false,
        error: 'Ошибка при создании сообщества: ' + createError.message
      };
    }

    // Обновляем кеш
    revalidatePath('/communities');
    revalidatePath('/dashboard/community');

    return {
      success: true,
      data: community
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Непредвиденная ошибка при создании сообщества'
    };
  }
}

export async function uploadCommunityImage(
  file: File,
  type: 'avatar' | 'cover',
  communitySlug: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Проверяем авторизацию
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Необходима авторизация' };
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${communitySlug}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `communities/${communitySlug}/${fileName}`;

    // Загружаем файл
    const { error: uploadError } = await supabase.storage
      .from('community-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Ошибка загрузки изображения' };
    }

    // Используем прокси URL для избежания mixed content ошибок
    // Вместо прямого URL от Supabase используем наш API endpoint
    const proxyUrl = `/api/storage/community-images/${filePath}`;

    return { success: true, url: proxyUrl };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Непредвиденная ошибка при загрузке' };
  }
}

export async function updateCommunity(
  communityId: string,
  data: Partial<CreateCommunityData>
) {
  try {
    const supabase = await createClient();

    // Проверяем авторизацию и владение сообществом
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Необходима авторизация' };
    }

    // Проверяем владение
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', communityId)
      .single();

    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав на редактирование этого сообщества' };
    }

    // Обновляем сообщество
    const { error: updateError } = await supabase
      .from('communities')
      .update(data)
      .eq('id', communityId);

    if (updateError) {
      console.error('Update error:', updateError);
      return { success: false, error: 'Ошибка при обновлении сообщества' };
    }

    revalidatePath('/communities');
    revalidatePath(`/communities/${data.slug}`);
    revalidatePath('/dashboard/community');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Непредвиденная ошибка при обновлении' };
  }
}

export async function publishCommunity(communityId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Необходима авторизация' };
    }

    // Проверяем владение
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id, slug')
      .eq('id', communityId)
      .single();

    if (!community || community.owner_id !== user.id) {
      return { success: false, error: 'У вас нет прав на публикацию этого сообщества' };
    }

    // Публикуем
    const { error: publishError } = await supabase
      .from('communities')
      .update({ is_published: true })
      .eq('id', communityId);

    if (publishError) {
      console.error('Publish error:', publishError);
      return { success: false, error: 'Ошибка при публикации сообщества' };
    }

    revalidatePath('/communities');
    revalidatePath(`/communities/${community.slug}`);
    revalidatePath('/dashboard/community');

    return { success: true, slug: community.slug };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Непредвиденная ошибка при публикации' };
  }
}