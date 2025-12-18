import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface CreateEventPageProps {
  params: {
    slug: string
  }
}

export default async function CreateEventPage({ params }: CreateEventPageProps) {
  const supabase = await createClient()
  
  // Ждем params (Next.js 15+)
  const { slug } = await params

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Проверяем, что сообщество принадлежит пользователю
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
    <div className="max-w-4xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Создать мероприятие
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Создание нового мероприятия для сообщества "{community.name}"
        </p>
      </div>

      {/* Информационное сообщение */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 dark:bg-blue-900/20 dark:border-blue-600">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
              Форма создания мероприятия в разработке
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Форма создания мероприятия будет реализована на следующем этапе. 
                Пока вы можете вернуться к списку мероприятий.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Заглушка формы */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-8">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Форма создания мероприятия
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Здесь будет расположена полная форма для создания нового мероприятия<br />
            с возможностью указать все детали события
          </p>
        </div>
      </div>

      {/* Ссылка назад */}
      <div className="mt-6">
        <Link
          href={`/dashboard/community/${slug}/events`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Вернуться к мероприятиям
        </Link>
      </div>
    </div>
  )
}