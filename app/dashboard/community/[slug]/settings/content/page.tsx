import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Контент страницы
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Создайте уникальную страницу "О сообществе" с помощью конструктора блоков
        </p>
      </div>

      <ContentBuilder 
        communityId={community.id}
        initialBlocks={blocks}
      />
    </div>
  )
}