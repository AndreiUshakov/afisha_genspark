import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface ContentEventPageProps {
  params: {
    slug: string
  }
  searchParams: {
    eventId?: string
  }
}

export default async function ContentEventPage({ params, searchParams }: ContentEventPageProps) {
  const supabase = await createClient()
  
  const { slug } = await params
  const { eventId } = await searchParams || {}
  
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

  // Если нет eventId, показываем сообщение
  if (!eventId) {
    return (
      <div>
        <div className="mb-8">
          <Link
            href={`/dashboard/community/${slug}/events/create`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-4"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Вернуться к выбору раздела
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Контент мероприятия
          </h1>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 dark:bg-yellow-900/20 dark:border-yellow-600">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                Сначала создайте мероприятие
              </h3>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                Для добавления контента необходимо сначала создать мероприятие в разделе "Основные настройки".
              </p>
              <div className="mt-4">
                <Link
                  href={`/dashboard/community/${slug}/events/create/basic`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Перейти к основным настройкам
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Получаем мероприятие
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('community_id', community.id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/community/${slug}/events/create`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Вернуться к выбору раздела
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Контент мероприятия
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Создайте детальное описание для "{event.title}" с помощью конструктора блоков
        </p>
      </div>

      {/* Информационный блок */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 dark:bg-blue-900/20 dark:border-blue-600">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
              Конструктор контента для мероприятий
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                Функционал находится в разработке. В будущем здесь будет доступен конструктор блоков 
                для создания детального описания мероприятия, аналогичный конструктору для страницы "О сообществе".
              </p>
              <p>
                Пока вы можете перейти к предпросмотру и публикации мероприятия. Краткое описание, 
                указанное в основных настройках, будет использовано для отображения мероприятия.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => window.location.href = `/dashboard/community/${slug}/events/create/design?eventId=${event.id}`}
          className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
        >
          ← Назад к оформлению
        </button>
        <button
          type="button"
          onClick={() => window.location.href = `/dashboard/community/${slug}/events/create/preview?eventId=${event.id}`}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-colors font-medium"
        >
          Продолжить к предпросмотру →
        </button>
      </div>
    </div>
  )
}