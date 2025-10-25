import Link from 'next/link';
import Image from 'next/image';
import { mockExperts, formatRating } from '@/data/mockExperts';

export default function ExpertsPage() {
  const experts = mockExperts;

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Эксперты Иркутска
        </h1>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Профессионалы своего дела, которые делятся знаниями и опытом
        </p>
      </div>

      {/* Поиск */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
            <svg className="shrink-0 size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            className="py-3 ps-11 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Поиск экспертов..."
          />
        </div>
      </div>

      {/* Список экспертов */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Cover Image */}
            <div className="relative h-40 w-full">
              <Image
                src={expert.cover_url}
                alt={expert.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Avatar overlay */}
              <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={expert.avatar_url}
                  alt={expert.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {expert.is_verified && (
                <div className="absolute top-3 right-3">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 mb-1">
                  {expert.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {expert.specialization}
                </span>
              </div>

              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                {expert.bio}
              </p>

              <div className="flex items-center gap-x-4 text-sm mb-4">
                <div className="flex items-center gap-x-1">
                  <svg className="size-4 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span className="font-semibold text-gray-800 dark:text-neutral-200">{formatRating(expert.rating)}</span>
                  <span className="text-gray-500 dark:text-neutral-500">({expert.reviews_count})</span>
                </div>
                <div className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-500">
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                  <span>{expert.experience_years} {expert.experience_years === 1 ? 'год' : expert.experience_years < 5 ? 'года' : 'лет'}</span>
                </div>
              </div>

              {expert.price_from && (
                <div className="mb-4 text-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    от {expert.price_from.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/experts/${expert.slug}`}
                  className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Подробнее
                </Link>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  Подписаться
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
