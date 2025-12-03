import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getEventBySlug, 
  getRelatedEvents, 
  formatPrice, 
  formatEventDate,
  getCapacityStatus 
} from '@/data/mockEvents';
import EventActions from '@/components/events/EventActions';
import EventCard from '@/components/events/EventCard';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = getRelatedEvents(slug, 3);
  const capacityStatus = getCapacityStatus(event);
  const priceText = formatPrice(event);
  const dateText = formatEventDate(event.event_date, event.end_date);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Primary Visual Hierarchy Level */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
        <Image
          src={event.cover_image_url}
          alt={event.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Breadcrumbs */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span>/</span>
              <Link href="/events" className="hover:text-white transition-colors">Мероприятия</Link>
              <span>/</span>
              <span className="text-white">{event.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <div className="container mx-auto px-4">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {event.category_name}
              </span>
            </div>

            {/* Title - Largest visual element */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {event.title}
            </h1>

            {/* Key Info Row */}
            <div className="flex flex-wrap gap-4 md:gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{dateText}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-lg">{priceText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Secondary Visual Hierarchy Level */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {event.description}
              </p>
              {event.full_description && (
                <div 
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: event.full_description.replace(/\n/g, '<br />') 
                  }}
                />
              )}
            </div>

            {/* Program Section */}
            {event.program && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Программа</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.program}
                </p>
              </div>
            )}

            {/* Requirements Section */}
            {event.requirements && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Важная информация</h3>
                    <p className="text-gray-700 leading-relaxed">{event.requirements}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Location Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Место проведения</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                    <p className="text-gray-600 text-sm mt-1">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {event.format === 'online' && 'Онлайн'}
                    {event.format === 'offline' && 'Оффлайн'}
                  </span>
                </div>
              </div>
              {/* Placeholder for map */}
              <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p>Карта будет добавлена позже</p>
                </div>
              </div>
            </div>

            {/* Organizer Section */}
            {event.organizer_name && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Организатор</h2>
                <div className="flex items-start gap-4">
                  {event.organizer_avatar && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={event.organizer_avatar}
                        alt={event.organizer_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {event.organizer_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {event.organizer_type === 'individual' && 'Частное лицо'}
                      {event.organizer_type === 'community' && 'Сообщество'}
                      {event.organizer_type === 'commercial' && 'Организация'}
                    </p>
                    {/* Contact info */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {event.contact_phone && (
                        <a href={`tel:${event.contact_phone}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {event.contact_phone}
                        </a>
                      )}
                      {event.contact_email && (
                        <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {event.contact_email}
                        </a>
                      )}
                    </div>
                    {/* Social links */}
                    {event.social_links && (
                      <div className="flex gap-3 mt-3">
                        {event.social_links.vk && (
                          <a href={event.social_links.vk} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.35 14.31h-1.55c-.54 0-.71-.43-1.67-1.39-.85-.83-1.22-.94-1.43-.94-.3 0-.38.08-.38.45v1.26c0 .34-.11.54-1 .54-1.47 0-3.1-.89-4.25-2.55-1.72-2.47-2.19-4.33-2.19-4.71 0-.21.08-.4.45-.4h1.55c.34 0 .47.15.6.51.65 1.94 1.76 3.64 2.21 3.64.17 0 .25-.08.25-.52V9.47c-.05-.88-.52-1-.52-1.31 0-.17.14-.34.37-.34h2.44c.29 0 .39.15.39.48v2.59c0 .29.13.38.21.38.17 0 .31-.09.63-.41 1-.1 1.72-2.04 1.72-2.04.09-.2.24-.4.61-.4h1.55c.37 0 .45.19.37.48-.15.71-.74 1.76-1.28 2.52-.15.2-.21.3 0 .53.15.18.64.62 1 1 .6.64 1.07 1.18 1.19 1.56.13.37-.07.56-.44.56z"/>
                            </svg>
                          </a>
                        )}
                        {event.social_links.telegram && (
                          <a href={event.social_links.telegram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                            </svg>
                          </a>
                        )}
                        {event.social_links.instagram && (
                          <a href={event.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        {event.website_url && (
                          <a href={event.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tags Section */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Теги</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Action Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  {/* Price */}
                  <div className="text-center py-4 border-b border-gray-200">
                    <div className="text-3xl font-bold text-gray-900">
                      {priceText}
                    </div>
                    {event.price_type === 'paid' && event.price_min && event.price_max && event.price_min !== event.price_max && (
                      <p className="text-sm text-gray-500 mt-1">в зависимости от билета</p>
                    )}
                  </div>

                  {/* Capacity Status */}
                  {event.capacity && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Занято мест</span>
                        <span className={`font-medium ${
                          capacityStatus.status === 'full' ? 'text-red-600' :
                          capacityStatus.status === 'limited' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {capacityStatus.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            capacityStatus.status === 'full' ? 'bg-red-500' :
                            capacityStatus.status === 'limited' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${capacityStatus.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <EventActions 
                    eventId={event.id} 
                    eventTitle={event.title}
                  />
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-sm">
                <h3 className="font-semibold text-gray-900 text-base mb-3">Детали мероприятия</h3>
                
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">Возрастное ограничение</p>
                    <p className="text-gray-900 font-medium">{event.age_restriction || 'Без ограничений'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">Просмотров</p>
                    <p className="text-gray-900 font-medium">{event.views_count.toLocaleString('ru-RU')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">В избранном</p>
                    <p className="text-gray-900 font-medium">{event.favorites_count.toLocaleString('ru-RU')}</p>
                  </div>
                </div>

                {event.registered_count > 0 && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-500">Зарегистрировано</p>
                      <p className="text-gray-900 font-medium">{event.registered_count.toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Events - Tertiary Visual Hierarchy Level */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Похожие мероприятия</h2>
              <Link 
                href={`/events?category=${event.category_id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
              >
                Смотреть все →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
