'use server';

import { updateCommunityPublishStatus } from '@/lib/supabase/admin';
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