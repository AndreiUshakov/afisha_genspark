import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PublishEventButton from './components/PublishEventButton'

interface PreviewEventPageProps {
  params: {
    slug: string
  }
  searchParams: {
    eventId?: string
  }
}

export default async function PreviewEventPage({ params, searchParams }: PreviewEventPageProps) {
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
            Предпросмотр мероприятия
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
                Для просмотра и публикации необходимо сначала создать мероприятие в разделе "Основные настройки".
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

  // Получаем мероприятие с категорией
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('id', eventId)
    .eq('community_id', community.id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatLocation = () => {
    if (event.location_type === 'online') {
      return 'Онлайн-мероприятие'
    } else if (event.location_type === 'hybrid') {
      return 'Гибридный формат (Офлайн + Онлайн)'
    } else if (event.venue_name) {
      return event.venue_address 
        ? `${event.venue_name}, ${event.venue_address}`
        : event.venue_name
    }
    return 'Место уточняется'
  }

  const formatPrice = () => {
    if (event.is_free) {
      return 'Бесплатно'
    }
    if (event.price_min && event.price_max) {
      return `${event.price_min} - ${event.price_max} ₽`
    }
    if (event.price_min) {
      return `от ${event.price_min} ₽`
    }
    return 'Уточняется'
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Предпросмотр и публикация
            </h1>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              Проверьте как будет выглядеть ваше мероприятие
            </p>
          </div>
          {!event.is_published && (
            <PublishEventButton eventId={event.id} communitySlug={slug} />
          )}
        </div>
      </div>

      {/* Статус публикации */}
      {event.is_published ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6 dark:bg-green-900/20 dark:border-green-600">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                Мероприятие опубликовано!
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Ваше мероприятие отправлено на пост-модерацию. После проверки администраторами оно будет доступно пользователям.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 dark:bg-blue-900/20 dark:border-blue-600">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                Мероприятие в черновике
              </h3>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                Проверьте все данные и нажмите кнопку "Опубликовать", когда будете готовы. 
                После публикации мероприятие попадёт на пост-модерацию.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Превью мероприятия */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
        {/* Обложка */}
        <div className="relative w-full h-80">
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Информация поверх обложки */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {(event.categories as any)?.name || 'Без категории'}
              </span>
              {event.is_free && (
                <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                  Бесплатно
                </span>
              )}
              {event.age_restriction && (
                <span className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-full">
                  {event.age_restriction}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-lg text-gray-200">{event.description}</p>
          </div>
        </div>

        {/* Детали мероприятия */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Дата и время */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Дата и время</h3>
                <p className="text-gray-600 dark:text-neutral-400">{formatDate(event.start_date)}</p>
                {event.end_date && (
                  <p className="text-sm text-gray-500 dark:text-neutral-500">до {formatDate(event.end_date)}</p>
                )}
              </div>
            </div>

            {/* Место проведения */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Место</h3>
                <p className="text-gray-600 dark:text-neutral-400">{formatLocation()}</p>
                {event.online_link && (
                  <a href={event.online_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    Ссылка на трансляцию
                  </a>
                )}
              </div>
            </div>

            {/* Стоимость */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Стоимость</h3>
                <p className="text-gray-600 dark:text-neutral-400">{formatPrice()}</p>
                {event.ticket_link && (
                  <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    Купить билет
                  </a>
                )}
              </div>
            </div>

            {/* Вместимость */}
            {event.capacity && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Вместимость</h3>
                  <p className="text-gray-600 dark:text-neutral-400">До {event.capacity} человек</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">Зарегистрировано: {event.registered_count}</p>
                </div>
              </div>
            )}
          </div>

          {/* Теги */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Организатор */}
          <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Организатор</h3>
            <div className="flex items-center gap-4">
              {event.organizer_avatar ? (
                <Image
                  src={event.organizer_avatar}
                  alt={event.organizer_name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {event.organizer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{event.organizer_name}</h4>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {event.organizer_type === 'community' ? 'Сообщество' : 
                   event.organizer_type === 'expert' ? 'Эксперт' :
                   event.organizer_type === 'venue' ? 'Площадка' : 'Организатор'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => window.location.href = `/dashboard/community/${slug}/events/create/content?eventId=${event.id}`}
          className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
        >
          ← Назад к контенту
        </button>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/community/${slug}/events`}
            className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
          >
            Вернуться к мероприятиям
          </Link>
          {!event.is_published && (
            <PublishEventButton eventId={event.id} communitySlug={slug} />
          )}
        </div>
      </div>
    </div>
  )
}