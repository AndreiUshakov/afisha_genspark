'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Event {
  id: string
  category_id: string | null
  organizer_id: string | null
  community_id: string | null
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  organizer_name: string
  organizer_avatar: string | null
  organizer_type: string | null
  start_date: string
  end_date: string | null
  is_recurring: boolean
  recurrence_pattern: string | null
  location_type: string | null
  venue_name: string | null
  venue_address: string | null
  venue_coordinates: any
  online_link: string | null
  is_free: boolean
  price_min: number | null
  price_max: number | null
  currency: string
  ticket_link: string | null
  capacity: number | null
  registered_count: number
  tags: string[]
  age_restriction: string | null
  social_links: any
  gallery_images: string[]
  is_published: boolean
  is_featured: boolean
  is_cancelled: boolean
  views_count: number
  favorites_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EventsStats {
  past: number
  ongoing: number
  upcoming: number
  total: number
}

/**
 * Получить все мероприятия сообщества
 */
export async function getCommunityEvents(communityId: string): Promise<Event[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('community_id', communityId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching community events:', error)
    throw error
  }
  
  return data as Event[]
}

/**
 * Получить статистику по мероприятиям
 */
export async function getEventsStats(communityId: string): Promise<EventsStats> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  
  // Прошедшие мероприятия
  const { count: pastCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId)
    .is('deleted_at', null)
    .lt('end_date', now)
  
  // Текущие мероприятия (начались, но еще не закончились)
  const { count: ongoingCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId)
    .is('deleted_at', null)
    .lte('start_date', now)
    .gte('end_date', now)
  
  // Запланированные мероприятия (еще не начались)
  const { count: upcomingCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId)
    .is('deleted_at', null)
    .gt('start_date', now)
  
  // Общее количество
  const { count: totalCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId)
    .is('deleted_at', null)
  
  return {
    past: pastCount || 0,
    ongoing: ongoingCount || 0,
    upcoming: upcomingCount || 0,
    total: totalCount || 0,
  }
}

/**
 * Удалить мероприятие (мягкое удаление)
 */
export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  // Проверяем, что мероприятие принадлежит пользователю
  const { data: event } = await supabase
    .from('events')
    .select('community_id, communities!inner(owner_id)')
    .eq('id', eventId)
    .single()
  
  if (!event || (event as any).communities.owner_id !== user.id) {
    throw new Error('Forbidden')
  }
  
  const { error } = await supabase
    .from('events')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', eventId)
  
  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }
  
  revalidatePath('/dashboard/community/[slug]/events', 'page')
}

/**
 * Переключить статус публикации мероприятия
 */
export async function toggleEventPublish(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  // Получаем текущий статус
  const { data: event } = await supabase
    .from('events')
    .select('is_published, community_id, communities!inner(owner_id)')
    .eq('id', eventId)
    .single()
  
  if (!event || (event as any).communities.owner_id !== user.id) {
    throw new Error('Forbidden')
  }
  
  const { error } = await supabase
    .from('events')
    .update({ is_published: !event.is_published })
    .eq('id', eventId)
  
  if (error) {
    console.error('Error toggling event publish status:', error)
    throw error
  }
  
  revalidatePath('/dashboard/community/[slug]/events', 'page')
}

/**
 * Переключить избранность мероприятия
 */
export async function toggleEventFeatured(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  // Получаем текущий статус
  const { data: event } = await supabase
    .from('events')
    .select('is_featured, community_id, communities!inner(owner_id)')
    .eq('id', eventId)
    .single()
  
  if (!event || (event as any).communities.owner_id !== user.id) {
    throw new Error('Forbidden')
  }
  
  const { error } = await supabase
    .from('events')
    .update({ is_featured: !event.is_featured })
    .eq('id', eventId)
  
  if (error) {
    console.error('Error toggling event featured status:', error)
    throw error
  }
  
  revalidatePath('/dashboard/community/[slug]/events', 'page')
}