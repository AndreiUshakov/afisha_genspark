'use server';

import { updatePostPublishStatus } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function togglePostPublishStatus(
  postId: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updatePostPublishStatus(postId, isPublished);
    
    if (success) {
      revalidatePath('/admin/posts');
      revalidatePath('/admin');
      revalidatePath('/blog');
      return { success: true };
    }
    
    return { success: false, error: 'Не удалось обновить статус публикации' };
  } catch (error) {
    console.error('Error toggling post publish status:', error);
    return { success: false, error: 'Произошла ошибка при обновлении статуса' };
  }
}