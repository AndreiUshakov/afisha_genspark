import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface EditEventPageProps {
  params: {
    slug: string
    id: string
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const supabase = await createClient()
  
  // Ждем params (Next.js 15+)
  const { slug, id } = await params

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

  // Получаем мероприятие
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('community_id', community.id)
    .is('deleted_at', null)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Редактировать мероприятие
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Редактирование мероприятия "{event.title}"
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
              Форма редактирования мероприятия в разработке
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Форма редактирования мероприятия будет реализована на следующем этапе. 
                Пока вы можете вернуться к списку мероприятий.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Информация о мероприятии */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Текущие данные мероприятия
        </h2>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Название</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{event.title}</dd>
          </div>
          {event.description && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Описание</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{event.description}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Дата начала</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(event.start_date).toLocaleString('ru-RU')}
            </dd>
          </div>
          {event.end_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Дата окончания</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(event.end_date).toLocaleString('ru-RU')}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Статус</dt>
            <dd className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.is_published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {event.is_published ? 'Опубликовано' : 'Черновик'}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Заглушка формы */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-8">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Форма редактирования мероприятия
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Здесь будет расположена полная форма для редактирования мероприятия<br />
            с возможностью изменить все параметры события
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