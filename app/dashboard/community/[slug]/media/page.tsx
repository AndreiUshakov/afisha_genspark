import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import CommunityMediaClient from './CommunityMediaClient'

interface CommunityMediaPageProps {
  params: {
    slug: string
  }
}

async function getCommunityWithMedia(slug: string, userId: string) {
  const supabase = await createClient()
  
  // Получаем сообщество
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('id, name, slug, owner_id')
    .eq('slug', slug)
    .eq('owner_id', userId)
    .single()
  
  if (communityError || !community) {
    return null
  }

  // Получаем медиа
  const { data: media, error: mediaError } = await supabase
    .from('community_media')
    .select('*')
    .eq('community_id', community.id)
    .order('uploaded_at', { ascending: false })

  if (mediaError) {
    console.error('Error fetching media:', mediaError)
  }

  return {
    community,
    media: media || []
  }
}

export default async function CommunityMediaPage({ params }: CommunityMediaPageProps) {
  const supabase = await createClient()
  
  // Проверяем аутентификацию
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Ждем params
  const { slug } = await params

  // Получаем данные сообщества и медиа
  const data = await getCommunityWithMedia(slug, user.id)
  
  if (!data) {
    notFound()
  }

  const { community, media } = data

  return (
    <CommunityMediaClient
      community={community}
      initialMedia={media}
    />
  )
}