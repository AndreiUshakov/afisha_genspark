'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Вступить в сообщество
 */
export async function joinCommunity(communityId: string) {
  try {
    const supabase = await createClient();
    
    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: 'Необходимо авторизоваться для вступления в сообщество'
      };
    }

    // Проверяем, не является ли пользователь уже участником
    const { data: existingMember } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return {
        success: false,
        error: 'Вы уже являетесь участником этого сообщества'
      };
    }

    // Добавляем пользователя в участники
    const { error: insertError } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: user.id,
        role: 'member'
      });

    if (insertError) {
      console.error('Error joining community:', insertError);
      return {
        success: false,
        error: 'Не удалось вступить в сообщество'
      };
    }

    // Обновляем кеш страницы
    revalidatePath(`/communities/[slug]`, 'page');
    
    return {
      success: true,
      message: 'Вы успешно вступили в сообщество'
    };
  } catch (error) {
    console.error('Unexpected error joining community:', error);
    return {
      success: false,
      error: 'Произошла ошибка при вступлении в сообщество'
    };
  }
}

/**
 * Покинуть сообщество
 */
export async function leaveCommunity(communityId: string) {
  try {
    const supabase = await createClient();
    
    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('🚪 Leave community - User:', user?.id, 'Community:', communityId);
    
    if (userError || !user) {
      console.error('🚪 Leave community - Auth error:', userError);
      return {
        success: false,
        error: 'Необходимо авторизоваться'
      };
    }

    // Проверяем, что пользователь не является владельцем
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', communityId)
      .single();

    console.log('🚪 Leave community - Community owner:', community?.owner_id);

    if (communityError) {
      console.error('🚪 Leave community - Community fetch error:', communityError);
    }

    if (community?.owner_id === user.id) {
      console.log('🚪 Leave community - User is owner, cannot leave');
      return {
        success: false,
        error: 'Владелец не может покинуть свое сообщество'
      };
    }

    // Сначала проверяем, существует ли запись
    const { data: existingMembership, error: checkError } = await supabase
      .from('community_members')
      .select('id, role')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('🚪 Leave community - Existing membership:', existingMembership);
    
    if (checkError) {
      console.error('🚪 Leave community - Check error:', checkError);
    }

    if (!existingMembership) {
      console.log('🚪 Leave community - No membership found');
      return {
        success: false,
        error: 'Вы не являетесь участником этого сообщества'
      };
    }

    // Удаляем пользователя из участников
    const { data: deleteData, error: deleteError } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .select();

    console.log('🚪 Leave community - Delete result:', { deleteData, deleteError });

    if (deleteError) {
      console.error('🚪 Leave community - Delete error:', deleteError);
      return {
        success: false,
        error: `Не удалось покинуть сообщество: ${deleteError.message}`
      };
    }

    // Обновляем кеш страницы
    revalidatePath(`/communities/[slug]`, 'page');
    revalidatePath(`/communities`);
    
    console.log('🚪 Leave community - Success!');
    
    return {
      success: true,
      message: 'Вы покинули сообщество'
    };
  } catch (error) {
    console.error('🚪 Unexpected error leaving community:', error);
    return {
      success: false,
      error: 'Произошла ошибка при выходе из сообщества'
    };
  }
}

/**
 * Проверить, является ли пользователь участником сообщества
 */
export async function checkMembership(communityId: string): Promise<{
  isMember: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
}> {
  try {
    const supabase = await createClient();
    
    // Получаем текущего пользователя
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        isMember: false,
        isOwner: false,
        isAuthenticated: false
      };
    }

    // Проверяем, является ли владельцем
    const { data: community } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', communityId)
      .single();

    const isOwner = community?.owner_id === user.id;

    // Если владелец, автоматически считается участником
    if (isOwner) {
      return {
        isMember: true,
        isOwner: true,
        isAuthenticated: true
      };
    }

    // Проверяем членство
    const { data: membership } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    return {
      isMember: !!membership,
      isOwner: false,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error checking membership:', error);
    return {
      isMember: false,
      isOwner: false,
      isAuthenticated: false
    };
  }
}