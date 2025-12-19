import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPreviewPage({ params }: EventPageProps) {
  const supabase = await createClient()
  
  // Ждем params (Next.js 15+)
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()

  // Получаем мероприятие с категорией и блоками контента
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      communities (
        id,
        name,
        slug,
        owner_id,
        avatar_url,
        description
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Проверяем права доступа: если событие не опубликовано,
  // то только владелец сообщества или админ могут его просматривать
  const isOwner = user && (event.communities as any)?.owner_id === user.id
  const isAdmin = user && user.user_metadata?.role === 'admin'

  if (!event.is_published && !isOwner && !isAdmin) {
    notFound()
  }

  // Получаем блоки контента
  const { data: contentBlocks } = await supabase
    .from('event_content_blocks')
    .select('*')
    .eq('event_id', id)
    .order('position', { ascending: true })

  // Получаем похожие мероприятия (той же категории)
  const { data: relatedEvents } = await supabase
    .from('events')
    .select(`
      id,
      title,
      slug,
      cover_image_url,
      start_date,
      location_type,
      venue_name,
      is_free,
      price_min,
      categories (name)
    `)
    .eq('category_id', event.category_id)
    .neq('id', id)
    .eq('is_published', true)
    .is('deleted_at', null)
    .limit(3)

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

  // Рендер блока контента
  const renderContentBlock = (block: any) => {
    switch (block.block_type) {
      case 'heading':
        return (
          <div key={block.id} className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {block.content.text}
            </h2>
          </div>
        )
      case 'text':
        return (
          <div key={block.id} className="mb-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {block.content.text}
              </p>
            </div>
          </div>
        )
      case 'image':
        return (
          <div key={block.id} className="mb-6">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={block.content.url}
                alt={block.content.alt || 'Изображение'}
                fill
                className="object-cover"
              />
            </div>
            {block.content.caption && (
              <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400 text-center">
                {block.content.caption}
              </p>
            )}
          </div>
        )
      case 'carousel':
        return (
          <div key={block.id} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {block.content.images?.map((img: any, idx: number) => (
                <div key={idx} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.alt || `Изображение ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Баннер для владельца, если событие в черновике */}
      {!event.is_published && isOwner && (
        <div className="bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Режим предпросмотра - Событие не опубликовано
                </span>
              </div>
              <Link
                href={`/dashboard/community/${(event.communities as any)?.slug}/events/${id}/edit`}
                className="text-sm text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium"
              >
                Вернуться к редактированию →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Обложка */}
      <div className="relative w-full h-80 md:h-96">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Информация поверх обложки */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
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
            {event.description && (
              <p className="text-lg text-gray-200">{event.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - контент */}
          <div className="lg:col-span-2 space-y-6">
            {/* Блоки контента */}
            {contentBlocks && contentBlocks.length > 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8 mb-6">
                {contentBlocks.map(renderContentBlock)}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8 mb-6">
                <p className="text-gray-500 dark:text-neutral-400 text-center">
                  Контент события будет добавлен позже
                </p>
              </div>
            )}

            {/* Дополнительная информация */}
            {(event.requirements || event.what_to_bring || event.accessibility_info) && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Дополнительная информация</h2>
                
                {event.requirements && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Требования</h3>
                    <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">{event.requirements}</p>
                  </div>
                )}

                {event.what_to_bring && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Что взять с собой</h3>
                    <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">{event.what_to_bring}</p>
                  </div>
                )}

                {event.accessibility_info && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Доступность</h3>
                    <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">{event.accessibility_info}</p>
                  </div>
                )}
              </div>
            )}

            {/* Контакты */}
            {(event.contact_email || event.contact_phone || event.website_url || event.social_links) && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Контакты</h2>
                <div className="space-y-3">
                  {event.contact_email && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:underline">
                        {event.contact_email}
                      </a>
                    </div>
                  )}
                  {event.contact_phone && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${event.contact_phone}`} className="text-blue-600 hover:underline">
                        {event.contact_phone}
                      </a>
                    </div>
                  )}
                  {event.website_url && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={event.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Веб-сайт
                      </a>
                    </div>
                  )}
                  {event.social_links && Object.keys(event.social_links).length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-neutral-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Социальные сети</p>
                      <div className="flex gap-3">
                        {event.social_links.vk && (
                          <a href={event.social_links.vk} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            VK
                          </a>
                        )}
                        {event.social_links.telegram && (
                          <a href={event.social_links.telegram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            Telegram
                          </a>
                        )}
                        {event.social_links.instagram && (
                          <a href={event.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Организатор */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Организатор</h2>
              <div className="flex items-start gap-4">
                {event.organizer_avatar ? (
                  <Image
                    src={event.organizer_avatar}
                    alt={event.organizer_name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : event.communities?.avatar_url ? (
                  <Image
                    src={event.communities.avatar_url}
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
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.organizer_name}</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                    {event.organizer_type === 'community' ? 'Сообщество' :
                     event.organizer_type === 'expert' ? 'Эксперт' :
                     event.organizer_type === 'venue' ? 'Площадка' : 'Организатор'}
                  </p>
                  {event.communities?.description && (
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{event.communities.description}</p>
                  )}
                  {event.communities && (
                    <Link
                      href={`/communities/${event.communities.slug}`}
                      className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Перейти в сообщество →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Похожие мероприятия */}
            {relatedEvents && relatedEvents.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Похожие мероприятия</h2>
                <div className="grid grid-cols-1 gap-4">
                  {relatedEvents.map((relEvent: any) => (
                    <Link
                      key={relEvent.id}
                      href={`/events/${relEvent.id}`}
                      className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      {relEvent.cover_image_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={relEvent.cover_image_url}
                            alt={relEvent.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{relEvent.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                          {new Date(relEvent.start_date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        {relEvent.is_free ? (
                          <span className="text-sm text-green-600 dark:text-green-400">Бесплатно</span>
                        ) : relEvent.price_min ? (
                          <span className="text-sm text-gray-600 dark:text-neutral-400">от {relEvent.price_min} ₽</span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - детали и фильтры */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Детали мероприятия */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Детали мероприятия</h3>
                
                {/* Дата и время */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Дата и время</h4>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm">{formatDate(event.start_date)}</p>
                    {event.end_date && (
                      <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">до {formatDate(event.end_date)}</p>
                    )}
                    {event.duration && (
                      <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">Длительность: {event.duration}</p>
                    )}
                  </div>
                </div>

                {/* Место проведения */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Место</h4>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm">{formatLocation()}</p>
                    {event.online_link && (
                      <a href={event.online_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-1">
                        Ссылка на трансляцию →
                      </a>
                    )}
                    {event.venue_capacity && (
                      <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">Вместимость площадки: {event.venue_capacity}</p>
                    )}
                  </div>
                </div>

                {/* Стоимость */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Стоимость</h4>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm">{formatPrice()}</p>
                    {event.ticket_link && (
                      <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-1">
                        Купить билет →
                      </a>
                    )}
                    {event.registration_link && (
                      <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-1">
                        Зарегистрироваться →
                      </a>
                    )}
                  </div>
                </div>

                {/* Вместимость */}
                {event.capacity && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Вместимость</h4>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm">До {event.capacity} человек</p>
                      {event.registered_count > 0 && (
                        <>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">Зарегистрировано: {event.registered_count}</p>
                          <div className="mt-2 bg-gray-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Характеристики и фильтры */}
              {(event.event_type || event.target_audience?.length > 0 || event.wishes?.length > 0 || event.age_categories?.length > 0) && (
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Характеристики</h3>
                  
                  {event.event_type && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2">Тип мероприятия</h4>
                      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {event.event_type}
                      </span>
                    </div>
                  )}

                  {event.target_audience && event.target_audience.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2">Для кого</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.target_audience.map((audience: string, index: number) => (
                          <span key={index} className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.wishes && event.wishes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2">Я хочу</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.wishes.map((wish: string, index: number) => (
                          <span key={index} className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                            {wish}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.age_categories && event.age_categories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2">Возрастные категории</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.age_categories.map((category: string, index: number) => (
                          <span key={index} className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Теги */}
              {event.tags && event.tags.length > 0 && (
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Языки */}
              {event.languages && event.languages.length > 0 && (
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Языки</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.languages.map((language: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Статистика */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Статистика</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Просмотры</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{event.views_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">В избранном</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{event.favorites_count || 0}</span>
                  </div>
                  {event.registered_count > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">Регистраций</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{event.registered_count}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}