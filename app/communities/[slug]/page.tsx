import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCommunityBySlug, getRelatedCommunities, formatMembersCount, getMembersCount, getEventsCount } from '@/lib/supabase/communities';
import CommunityActions from '@/components/communities/CommunityActions';
import ImageGallery from '@/components/communities/ImageGallery';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const relatedCommunities = await getRelatedCommunities(slug, community.category_id);
  
  // Получаем данные для отображения
  const membersCount = getMembersCount(community.id);
  const eventsCount = getEventsCount(community.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Primary Visual Hierarchy */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <Image
            src={community.cover_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'}
            alt={community.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Community Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
              <Image
                src={community.avatar_url || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'}
                alt={community.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Community Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-5xl font-bold">{community.name}</h1>
                {community.is_verified && (
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl">{community.description}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{formatMembersCount(membersCount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{community.location}</span>
                </div>
                {eventsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{eventsCount} {eventsCount === 1 ? 'событие' : eventsCount < 5 ? 'события' : 'событий'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Secondary Visual Hierarchy */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {community.description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">О сообществе</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {community.description}
                  </p>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {community.target_audience && community.target_audience.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Целевая аудитория</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {community.target_audience.map((audience, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900 dark:text-white font-medium">{audience}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishes */}
            {community.wishes && community.wishes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Пожелания участникам</h2>
                <div className="space-y-3">
                  {community.wishes.map((wish, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{wish}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Albums */}
            {community.photo_albums && community.photo_albums.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Фотоальбомы</h2>
                <div className="text-gray-600 dark:text-gray-400">
                  {community.photo_albums.length} {community.photo_albums.length === 1 ? 'альбом' : community.photo_albums.length < 5 ? 'альбома' : 'альбомов'}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Secondary Visual Hierarchy */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sticky top-6">
              <CommunityActions 
                communityId={community.id}
                communityName={community.name}
              />

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Участников</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatMembersCount(membersCount)}
                  </span>
                </div>

                {eventsCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Событий</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {eventsCount}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Локация</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {community.location}
                  </span>
                </div>

                {community.created_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Создано</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(community.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Links */}
              {(community.social_links?.website || community.social_links?.vk || community.social_links?.telegram || community.social_links?.instagram) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Контакты</h3>
                  <div className="space-y-3">
                    {community.social_links?.website && (
                      <a
                        href={community.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                        </svg>
                        <span>Веб-сайт</span>
                      </a>
                    )}

                    {/* Social Links */}
                    {(community.social_links?.vk || community.social_links?.telegram || community.social_links?.instagram) && (
                      <div className="flex gap-3">
                        {community.social_links?.vk && (
                          <a
                            href={community.social_links.vk}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            aria-label="VK"
                          >
                            <span className="text-sm font-bold">VK</span>
                          </a>
                        )}
                        {community.social_links?.telegram && (
                          <a
                            href={community.social_links.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            aria-label="Telegram"
                          >
                            <span className="text-xs font-bold">TG</span>
                          </a>
                        )}
                        {community.social_links?.instagram && (
                          <a
                            href={community.social_links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity"
                            aria-label="Instagram"
                          >
                            <span className="text-xs font-bold">IG</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Communities - Tertiary Visual Hierarchy */}
      {relatedCommunities.length > 0 && (
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Похожие сообщества
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCommunities.map((relatedCommunity) => (
                <a
                  key={relatedCommunity.id}
                  href={`/communities/${relatedCommunity.slug}`}
                  className="group block bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedCommunity.cover_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'}
                      alt={relatedCommunity.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Avatar overlay */}
                    <div className="absolute bottom-3 left-3 w-16 h-16 rounded-xl overflow-hidden border-2 border-white">
                      <Image
                        src={relatedCommunity.avatar_url || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'}
                        alt={relatedCommunity.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {relatedCommunity.name}
                      </h3>
                      {relatedCommunity.is_verified && (
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {relatedCommunity.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>{formatMembersCount(getMembersCount(relatedCommunity.id))}</span>
                      </div>
                      {getEventsCount(relatedCommunity.id) > 0 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{getEventsCount(relatedCommunity.id)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
