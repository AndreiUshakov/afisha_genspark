import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getExpertBySlug, getRelatedExperts, formatRating } from '@/data/mockExperts';
import ExpertActions from '@/components/experts/ExpertActions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExpertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);

  if (!expert) {
    notFound();
  }

  const relatedExperts = getRelatedExperts(slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Primary Visual Hierarchy */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <Image
            src={expert.cover_url}
            alt={expert.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Expert Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
              <Image
                src={expert.avatar_url}
                alt={expert.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Expert Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">{expert.name}</h1>
                {expert.is_verified && (
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <p className="text-xl md:text-2xl text-blue-200 font-semibold mb-3">{expert.specialization}</p>
              <p className="text-lg text-gray-200 mb-4 max-w-3xl">{expert.bio}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{formatRating(expert.rating)}</span>
                  <span className="text-gray-300">({expert.reviews_count} {expert.reviews_count === 1 ? 'отзыв' : expert.reviews_count < 5 ? 'отзыва' : 'отзывов'})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Опыт {expert.experience_years} {expert.experience_years === 1 ? 'год' : expert.experience_years < 5 ? 'года' : 'лет'}</span>
                </div>

                {expert.consultations_count > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>{expert.consultations_count} консультаций</span>
                  </div>
                )}

                {expert.response_time && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Ответ за {expert.response_time}</span>
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
            {/* Full Bio */}
            {expert.full_bio && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">О специалисте</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {expert.full_bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {expert.achievements && expert.achievements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Достижения и квалификация</h2>
                <div className="space-y-4">
                  {expert.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-900 dark:text-white font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {expert.services && expert.services.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Услуги</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expert.services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-md transition-shadow">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900 dark:text-white font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            {expert.education && expert.education.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Образование и сертификаты</h2>
                <div className="space-y-4">
                  {expert.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-r-xl">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      <span className="text-gray-900 dark:text-white">{edu}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Working Hours */}
            {expert.working_hours && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Время работы</h2>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-900 dark:text-white text-lg">{expert.working_hours}</span>
                </div>
              </div>
            )}

            {/* Languages */}
            {expert.languages && expert.languages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Языки</h2>
                <div className="flex flex-wrap gap-3">
                  {expert.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {expert.tags && expert.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Специализация</h2>
                <div className="flex flex-wrap gap-2">
                  {expert.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Secondary Visual Hierarchy */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sticky top-6">
              <ExpertActions 
                expertId={expert.id}
                expertName={expert.name}
              />

              {/* Pricing */}
              {expert.price_from && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Консультация от</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {expert.price_from.toLocaleString('ru-RU')} ₽
                    </p>
                    {expert.price_max && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        до {expert.price_max.toLocaleString('ru-RU')} ₽
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Рейтинг</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatRating(expert.rating)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Отзывов</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {expert.reviews_count}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Опыт работы</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {expert.experience_years} {expert.experience_years === 1 ? 'год' : expert.experience_years < 5 ? 'года' : 'лет'}
                  </span>
                </div>

                {expert.consultations_count > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Консультаций</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {expert.consultations_count}
                    </span>
                  </div>
                )}

                {expert.response_time && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Время ответа</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {expert.response_time}
                    </span>
                  </div>
                )}

                {expert.subscribers_count > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Подписчиков</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {expert.subscribers_count}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Methods */}
              {(expert.website || expert.email || expert.phone || expert.social_links) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Контакты</h3>
                  <div className="space-y-3">
                    {expert.website && (
                      <a
                        href={expert.website}
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
                    
                    {expert.email && (
                      <a
                        href={`mailto:${expert.email}`}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>Email</span>
                      </a>
                    )}

                    {expert.phone && (
                      <a
                        href={`tel:${expert.phone}`}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{expert.phone}</span>
                      </a>
                    )}

                    {/* Social Links */}
                    {expert.social_links && (
                      <div className="flex gap-3 pt-2">
                        {expert.social_links.vk && (
                          <a
                            href={expert.social_links.vk}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            aria-label="VK"
                          >
                            <span className="text-sm font-bold">VK</span>
                          </a>
                        )}
                        {expert.social_links.telegram && (
                          <a
                            href={expert.social_links.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            aria-label="Telegram"
                          >
                            <span className="text-xs font-bold">TG</span>
                          </a>
                        )}
                        {expert.social_links.instagram && (
                          <a
                            href={expert.social_links.instagram}
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

      {/* Related Experts - Tertiary Visual Hierarchy */}
      {relatedExperts.length > 0 && (
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Другие эксперты
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExperts.map((relatedExpert) => (
                <a
                  key={relatedExpert.id}
                  href={`/experts/${relatedExpert.slug}`}
                  className="group block bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedExpert.cover_url}
                      alt={relatedExpert.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Avatar overlay */}
                    <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={relatedExpert.avatar_url}
                        alt={relatedExpert.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {relatedExpert.is_verified && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                      {relatedExpert.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {relatedExpert.specialization}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {relatedExpert.bio}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{formatRating(relatedExpert.rating)}</span>
                        <span>({relatedExpert.reviews_count})</span>
                      </div>
                      
                      {relatedExpert.price_from && (
                        <div className="font-semibold text-gray-900 dark:text-white">
                          от {relatedExpert.price_from.toLocaleString('ru-RU')} ₽
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
