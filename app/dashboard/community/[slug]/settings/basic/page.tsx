import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import BasicSettingsForm from './components/BasicSettingsForm'
import { getCategories } from './actions'

interface BasicSettingsPageProps {
  params: {
    slug: string
  }
}

export default async function BasicSettingsPage({ params }: BasicSettingsPageProps) {
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

  // Получаем список категорий
  const categoriesResult = await getCategories()
  const categories = categoriesResult.success ? categoriesResult.data : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Основная информация
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Редактируйте основные данные вашего сообщества
        </p>
      </div>

      <BasicSettingsForm community={community} categories={categories} />
    </div>
  )
}