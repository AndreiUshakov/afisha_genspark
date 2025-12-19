'use server';

import { createClient } from '@/lib/supabase/server';

export interface EventFilters {
  categoryId?: string;
  wishes?: string[];
  targetAudience?: string[];
  ageCategories?: string[];
  format?: 'online' | 'offline' | 'hybrid';
  price?: 'free' | 'paid';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'date' | 'popularity' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface EventsResponse {
  events: any[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
  const supabase = await createClient();
  
  const {
    categoryId,
    wishes = [],
    targetAudience = [],
    ageCategories = [],
    format,
    price,
    dateFrom,
    dateTo,
    search,
    sortBy = 'date',
    sortOrder = 'asc',
    page = 1,
    perPage = 12,
  } = filters;

  // Начинаем запрос
  let query = supabase
    .from('events')
    .select(`
      *,
      community:communities(id, name, slug, avatar_url)
    `, { count: 'exact' })
    .eq('is_published', true)
    .is('deleted_at', null);

  // Применяем фильтры
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (wishes.length > 0) {
    query = query.overlaps('wishes', wishes);
  }

  if (targetAudience.length > 0) {
    query = query.overlaps('target_audience', targetAudience);
  }

  if (ageCategories.length > 0) {
    query = query.overlaps('age_categories', ageCategories);
  }

  if (format) {
    // Маппинг format на location_type, с учетом что в БД может быть 'physical' вместо 'offline'
    const locationType = format === 'offline' ? 'physical' : format;
    query = query.eq('location_type', locationType);
  }

  if (price) {
    if (price === 'free') {
      query = query.eq('is_free', true);
    } else if (price === 'paid') {
      query = query.eq('is_free', false);
    }
  }

  if (dateFrom) {
    query = query.gte('start_date', dateFrom);
  }

  if (dateTo) {
    query = query.lte('start_date', dateTo);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Сортировка
  switch (sortBy) {
    case 'popularity':
      query = query.order('views_count', { ascending: sortOrder === 'asc' });
      break;
    case 'price':
      query = query.order('price_min', { ascending: sortOrder === 'asc', nullsFirst: false });
      break;
    case 'date':
    default:
      query = query.order('start_date', { ascending: sortOrder === 'asc' });
      break;
  }

  // Пагинация
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data: events, error, count } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return {
      events: [],
      total: 0,
      page,
      perPage,
      totalPages: 0,
    };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    events: events || [],
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

export async function getCategoriesWithCount() {
  const supabase = await createClient();
  
  // Получаем категории
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return [];
  }

  if (!categories) return [];

  // Для каждой категории получаем количество опубликованных событий
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count, error: countError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true)
        .is('deleted_at', null);

      if (countError) {
        console.error('Error counting events for category:', category.id, countError);
        return { ...category, event_count: 0 };
      }

      return { ...category, event_count: count || 0 };
    })
  );

  // Возвращаем только категории с событиями
  return categoriesWithCount.filter(cat => cat.event_count > 0);
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      community:communities(id, name, slug, avatar_url),
      category:categories(id, name, slug, icon, color)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  // Увеличиваем счетчик просмотров
  if (event) {
    await supabase
      .from('events')
      .update({ views_count: (event.views_count || 0) + 1 })
      .eq('id', event.id);
  }

  return event;
}

export async function getRelatedEvents(categoryId: string, currentEventId: string, limit: number = 3) {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      community:communities(id, name, slug, avatar_url)
    `)
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .is('deleted_at', null)
    .neq('id', currentEventId)
    .order('views_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related events:', error);
    return [];
  }

  return events || [];
}

export async function getFeaturedEvents(limit: number = 8) {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      community:communities(id, name, slug, avatar_url)
    `)
    .eq('is_published', true)
    .is('deleted_at', null)
    .eq('is_featured', true)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }

  return events || [];
}

export async function getUpcomingEvents(limit: number = 10) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      community:communities(id, name, slug, avatar_url),
      category:categories(id, name, slug, icon, color)
    `)
    .eq('is_published', true)
    .is('deleted_at', null)
    .gte('start_date', now)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  return events || [];
}