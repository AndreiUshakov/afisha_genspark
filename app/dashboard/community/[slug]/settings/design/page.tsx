import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DesignSettingsForm from './components/DesignSettingsForm'

interface DesignSettingsPageProps {
  params: {
    slug: string
  }
}

export default async function DesignSettingsPage({ params }: DesignSettingsPageProps) {
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Дизайн и внешний вид
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Настройте визуальное оформление страницы сообщества
        </p>
      </div>

      <DesignSettingsForm community={community} />
    </div>
  )
}