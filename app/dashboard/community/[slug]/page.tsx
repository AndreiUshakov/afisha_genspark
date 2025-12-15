import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

interface CommunityPageProps {
  params: {
    slug: string
  }
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const supabase = await createClient()
  
  // Проверяем аутентификацию
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Ждем params (Next.js 15+)
  const { slug } = await params;

  // Проверяем, что сообщество существует и принадлежит пользователю
  const { data: community, error } = await supabase
    .from('communities')
    .select('id')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()
  
  if (!community) {
    notFound()
  }

  // Перенаправляем на страницу настроек
  redirect(`/dashboard/community/${slug}/settings`)
}