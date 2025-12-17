'use server';

import { updateCommunityPublishStatus } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleCommunityPublishStatus(
  communityId: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updateCommunityPublishStatus(communityId, isPublished);
    
    if (success) {
      revalidatePath('/admin/communities');
      revalidatePath('/admin');
      revalidatePath('/communities');
      return { success: true };
    }
    
    return { success: false, error: 'Не удалось обновить статус публикации' };
  } catch (error) {
    console.error('Error toggling community publish status:', error);
    return { success: false, error: 'Произошла ошибка при обновлении статуса' };
  }
}

/**
 * Восстановить мягко удаленное сообщество
 */
export async function restoreCommunity(
  communityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase.rpc('restore_community', {
      p_community_id: communityId,
    });

    if (error) {
      console.error('Error restoring community:', error);
      return { success: false, error: 'Ошибка при восстановлении сообщества' };
    }

    if (!result.success) {
      return { success: false, error: result.error || 'Не удалось восстановить сообщество' };
    }

    revalidatePath('/admin/communities');
    revalidatePath('/admin');
    revalidatePath('/communities');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error restoring community:', error);
    return { success: false, error: 'Произошла непредвиденная ошибка' };
  }
}

/**
 * Навсегда удалить сообщество из БД
 */
export async function hardDeleteCommunity(
  communityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase.rpc('hard_delete_community', {
      p_community_id: communityId,
    });

    if (error) {
      console.error('Error hard deleting community:', error);
      return { success: false, error: 'Ошибка при удалении сообщества' };
    }

    if (!result.success) {
      return { success: false, error: result.error || 'Не удалось удалить сообщество' };
    }

    revalidatePath('/admin/communities');
    revalidatePath('/admin');
    revalidatePath('/communities');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error hard deleting community:', error);
    return { success: false, error: 'Произошла непредвиденная ошибка' };
  }
}