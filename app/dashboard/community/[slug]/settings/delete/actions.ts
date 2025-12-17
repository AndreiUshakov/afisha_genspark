'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface DeleteResult {
  success: boolean;
  error?: string;
  deleted_events?: number;
  future_events_count?: number;
}

/**
 * Получить информацию о событиях сообщества для предпросмотра удаления
 */
export async function getCommunityEventsInfo(communitySlug: string): Promise<{
  totalEvents: number;
  futureEvents: number;
  pastEvents: number;
  futureEventsList: Array<{ id: string; title: string; start_date: string }>;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Не авторизован');
    }

    // Получаем сообщество
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id')
      .eq('slug', communitySlug)
      .eq('owner_id', user.id)
      .single();

    if (communityError || !community) {
      console.error('Community error:', communityError);
      throw new Error('Сообщество не найдено');
    }

    // Получаем все события сообщества
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_date')
      .eq('community_id', community.id)
      .order('start_date', { ascending: true });

    if (eventsError) {
      console.error('Events error:', eventsError);
      // Не бросаем ошибку, если просто нет событий
      return {
        totalEvents: 0,
        futureEvents: 0,
        pastEvents: 0,
        futureEventsList: [],
      };
    }

    const now = new Date();
    const futureEvents = events?.filter(e => new Date(e.start_date) > now) || [];
    const pastEvents = events?.filter(e => new Date(e.start_date) <= now) || [];

    return {
      totalEvents: events?.length || 0,
      futureEvents: futureEvents.length,
      pastEvents: pastEvents.length,
      futureEventsList: futureEvents.slice(0, 10), // Показываем только первые 10
    };
  } catch (error) {
    console.error('Error getting community events info:', error);
    return {
      totalEvents: 0,
      futureEvents: 0,
      pastEvents: 0,
      futureEventsList: [],
    };
  }
}

/**
 * Мягкое удаление сообщества
 */
export async function softDeleteCommunity(
  communitySlug: string,
  communityName: string,
  confirmationName: string,
  deleteOption: 'all' | 'future'
): Promise<DeleteResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Не авторизован' };
    }

    // Проверяем правильность введенного имени
    if (confirmationName.trim() !== communityName.trim()) {
      return {
        success: false,
        error: 'Имя сообщества введено неверно. Пожалуйста, введите точное название сообщества.',
      };
    }

    // Получаем сообщество
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id, name')
      .eq('slug', communitySlug)
      .eq('owner_id', user.id)
      .single();

    if (communityError || !community) {
      return { success: false, error: 'Сообщество не найдено или у вас нет прав на его удаление' };
    }

    // Вызываем функцию мягкого удаления
    const { data: result, error: deleteError } = await supabase.rpc('soft_delete_community', {
      p_community_id: community.id,
      delete_option: deleteOption,
    });

    if (deleteError) {
      console.error('Error soft deleting community:', deleteError);
      return { success: false, error: 'Ошибка при удалении сообщества' };
    }

    if (!result.success) {
      return { success: false, error: result.error || 'Не удалось удалить сообщество' };
    }

    // Инвалидируем кеш
    revalidatePath('/dashboard/community');
    revalidatePath('/communities');
    revalidatePath(`/communities/${communitySlug}`);

    return {
      success: true,
      deleted_events: result.deleted_events,
      future_events_count: result.future_events_count,
    };
  } catch (error) {
    console.error('Unexpected error soft deleting community:', error);
    return { success: false, error: 'Произошла непредвиденная ошибка' };
  }
}