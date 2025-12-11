'use server';

import { updateEventPublishStatus } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function toggleEventPublishStatus(
  eventId: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updateEventPublishStatus(eventId, isPublished);
    
    if (success) {
      revalidatePath('/admin/events');
      revalidatePath('/admin');
      revalidatePath('/events');
      return { success: true };
    }
    
    return { success: false, error: 'Не удалось обновить статус публикации' };
  } catch (error) {
    console.error('Error toggling event publish status:', error);
    return { success: false, error: 'Произошла ошибка при обновлении статуса' };
  }
}