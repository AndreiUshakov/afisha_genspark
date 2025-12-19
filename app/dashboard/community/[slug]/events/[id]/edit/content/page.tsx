import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventContentBlocks } from './actions'
import EventContentBuilder from './components/EventContentBuilder'

interface EventContentPageProps {
  params: {
    slug: string
    id: string
  }
}

export default async function EventContentPage({ params }: EventContentPageProps) {
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

  // Получаем блоки контента
  const blocksResult = await getEventContentBlocks(id)
  const blocks = blocksResult.success ? blocksResult.data : []
return (
  <div className="max-w-7xl mx-auto">
    {/* Заголовок страницы */}
    <div className="mb-6">
      <Link
        href={`/dashboard/community/${slug}/events/${id}/edit`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-4"
      >
        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Вернуться к управлению мероприятием
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Страница события
      </h1>
      <p className="mt-2 text-gray-600 dark:text-neutral-400">
        Создайте детальное описание мероприятия с помощью блоков
      </p>
    </div>

    {/* Информационная карточка события */}
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 dark:bg-blue-900/20 dark:border-blue-600">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
              Информационная карточка события
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                Название: <span className="font-semibold">{event.title}</span>
              </p>
              <p className="mb-2">
                Статус: <span className={`font-semibold ${event.is_published ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {event.is_published ? 'Опубликовано' : 'Черновик'}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/events/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Предпросмотр страницы
        </Link>
      </div>
    </div>

            

      {/* Конструктор блоков контента */}
      <EventContentBuilder
        eventId={id}
        communityId={community.id}
        communitySlug={slug}
        initialBlocks={blocks}
      />
    </div>
  )
}