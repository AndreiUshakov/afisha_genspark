import { createClient } from '@/lib/supabase/server';

export interface ModerationTask {
  id: string;
  content_type: 'community' | 'event' | 'post' | 'expert';
  content_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  assigned_to: string | null;
  reviewed_by: string | null;
  review_comment: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: any;
  created_at: string;
  reviewed_at: string | null;
  updated_at: string;
}

export interface ModerationStats {
  pending_count: number;
  in_review_count: number;
  approved_today: number;
  rejected_today: number;
}

/**
 * Получить роли пользователя
 * Проверяет:
 * - Роль admin в таблице profiles
 * - Наличие сообществ (роль community)
 * - Статус эксперта (роль expert)
 */
export async function getUserRole(userId: string): Promise<('user' | 'community' | 'expert' | 'admin')[]> {
  try {
    const supabase = await createClient();
    const roles: ('user' | 'community' | 'expert' | 'admin')[] = ['user'];
    
    // Проверяем роль в profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (profile?.role === 'admin') {
      roles.push('admin');
    }
    
    // Проверяем наличие сообществ
    const { data: communities } = await supabase
      .from('communities')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);
    
    if (communities && communities.length > 0) {
      roles.push('community');
    }
    
    // Проверяем статус эксперта
    const { data: expert } = await supabase
      .from('experts')
      .select('id')
      .eq('profile_id', userId)
      .eq('is_active', true)
      .limit(1)
      .single();
    
    if (expert) {
      roles.push('expert');
    }
    
    return roles;
  } catch (error) {
    console.error('Error getting user roles:', error);
    return ['user'];
  }
}

/**
 * Проверка, является ли пользователь администратором
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Получить задачи модерации
 */
export async function getModerationTasks(
  filters?: {
    status?: string;
    content_type?: string;
    limit?: number;
  }
): Promise<ModerationTask[]> {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('moderation_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.content_type) {
      query = query.eq('content_type', filters.content_type);
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching moderation tasks:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching moderation tasks:', error);
    return [];
  }
}

/**
 * Получить статистику модерации
 */
export async function getModerationStats(): Promise<ModerationStats | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.rpc('get_moderation_stats');
    
    if (error) {
      console.error('Error fetching moderation stats:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Unexpected error fetching moderation stats:', error);
    return null;
  }
}

/**
 * Обновить статус задачи модерации
 */
export async function updateModerationTask(
  taskId: string,
  updates: {
    status?: string;
    review_comment?: string;
  }
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { error } = await supabase
      .from('moderation_tasks')
      .update({
        ...updates,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', taskId);
    
    if (error) {
      console.error('Error updating moderation task:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating moderation task:', error);
    return false;
  }
}

/**
 * Опубликовать/снять с публикации сообщество
 */
export async function updateCommunityPublishStatus(
  communityId: string,
  isPublished: boolean
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('communities')
      .update({ is_published: isPublished })
      .eq('id', communityId);
    
    if (error) {
      console.error('Error updating community publish status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating community publish status:', error);
    return false;
  }
}

/**
 * Опубликовать/снять с публикации событие
 */
export async function updateEventPublishStatus(
  eventId: string,
  isPublished: boolean
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('events')
      .update({ is_published: isPublished })
      .eq('id', eventId);
    
    if (error) {
      console.error('Error updating event publish status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating event publish status:', error);
    return false;
  }
}

/**
 * Опубликовать/снять с публикации пост
 */
export async function updatePostPublishStatus(
  postId: string,
  isPublished: boolean
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('posts')
      .update({ is_published: isPublished })
      .eq('id', postId);
    
    if (error) {
      console.error('Error updating post publish status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating post publish status:', error);
    return false;
  }
}

/**
 * Активировать/деактивировать эксперта
 */
export async function updateExpertActiveStatus(
  expertId: string,
  isActive: boolean
): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('experts')
      .update({ is_active: isActive })
      .eq('id', expertId);
    
    if (error) {
      console.error('Error updating expert active status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating expert active status:', error);
    return false;
  }
}

/**
 * Получить все сообщества (включая неопубликованные) для админа
 */
export async function getAllCommunities() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        profiles:owner_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all communities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all communities:', error);
    return [];
  }
}

/**
 * Получить все события (включая неопубликованные) для админа
 */
export async function getAllEvents() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        profiles:organizer_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all events:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all events:', error);
    return [];
  }
}

/**
 * Получить все посты (включая неопубликованные) для админа
 */
export async function getAllPosts() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          email,
          full_name
        ),
        communities (
          name,
          slug
        ),
        experts (
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all posts:', error);
    return [];
  }
}

/**
 * Получить всех экспертов (включая неактивных) для админа
 */
export async function getAllExperts() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('experts')
      .select(`
        *,
        profiles:profile_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all experts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all experts:', error);
    return [];
  }
}