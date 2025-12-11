import { createClient } from '@/lib/supabase/server';

export interface Community {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  avatar_url: string | null;
  cover_url: string | null;
  category_id: string;
  location: string;
  social_links: {
    vk?: string;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  target_audience: string[];
  wishes: string[];
  age_category: string | null;
  page_content: any;
  photo_albums: any[];
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    slug: string;
  };
}

/**
 * Получить все опубликованные сообщества
 */
export async function getCommunities(): Promise<Community[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching communities:', error);
    return [];
  }
}

/**
 * Получить сообщество по slug
 */
export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching community by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching community:', error);
    return null;
  }
}

/**
 * Получить похожие сообщества (из той же категории)
 */
export async function getRelatedCommunities(
  currentSlug: string,
  categoryId: string,
  limit: number = 3
): Promise<Community[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('is_published', true)
      .eq('category_id', categoryId)
      .neq('slug', currentSlug)
      .limit(limit);

    if (error) {
      console.error('Error fetching related communities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching related communities:', error);
    return [];
  }
}

/**
 * Форматировать количество участников
 */
export function formatMembersCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Получить количество участников сообщества
 * (заглушка, пока нет таблицы community_members)
 */
export function getMembersCount(communityId: string): number {
  // TODO: Implement when community_members table is ready
  return 0;
}

/**
 * Получить количество событий сообщества
 * (заглушка, пока нет связи с events)
 */
export function getEventsCount(communityId: string): number {
  // TODO: Implement when events are linked to communities
  return 0;
}