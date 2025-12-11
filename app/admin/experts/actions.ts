'use server';

import { updateExpertActiveStatus } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function toggleExpertActiveStatus(
  expertId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updateExpertActiveStatus(expertId, isActive);
    
    if (success) {
      revalidatePath('/admin/experts');
      revalidatePath('/admin');
      revalidatePath('/experts');
      return { success: true };
    }
    
    return { success: false, error: 'Не удалось обновить статус активности' };
  } catch (error) {
    console.error('Error toggling expert active status:', error);
    return { success: false, error: 'Произошла ошибка при обновлении статуса' };
  }
}