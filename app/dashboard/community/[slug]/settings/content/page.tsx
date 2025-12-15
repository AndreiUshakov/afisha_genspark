import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ContentBuilder from './components/ContentBuilder'
import { getContentBlocks } from './actions'

interface ContentSettingsPageProps {
  params: {
    slug: string
  }
}

export default async function ContentSettingsPage({ params }: ContentSettingsPageProps) {
  const supabase = await createClient()
  
  const { slug } = await params
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Получаем сообщество владельца
  const { data: community, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()
  
  if (!community) {
    notFound()
  }

  // Получаем блоки контента
  const blocksResult = await getContentBlocks(community.id)
  const blocks = blocksResult.success ? blocksResult.data : []

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/community/${slug}/settings`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Вернуться к настройкам сообщества
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Контент страницы
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Создайте уникальную страницу "О сообществе" с помощью конструктора блоков
        </p>
      </div>

      <ContentBuilder
        communityId={community.id}
        communitySlug={community.slug}
        initialBlocks={blocks}
      />
    </div>
  )
}