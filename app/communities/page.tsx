import Link from 'next/link';
import Image from 'next/image';
import { mockCommunities, formatMembersCount } from '@/data/mockCommunities';

export default function CommunitiesPage() {
  const communities = mockCommunities.filter(community => community.is_published);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Сообщества Иркутска
        </h1>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Найдите единомышленников и присоединяйтесь к активным сообществам города
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
            placeholder="Поиск сообществ..."
          />
        </div>
      </div>

      {/* Список сообществ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Cover Image */}
            <div className="relative h-40 w-full">
              <Image
                src={community.cover_url}
                alt={community.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Avatar overlay */}
              <div className="absolute bottom-3 left-3 w-14 h-14 rounded-xl overflow-hidden border-2 border-white">
                <Image
                  src={community.avatar_url}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {community.is_verified && (
                <div className="absolute top-3 right-3">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 mb-2">
                {community.name}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                {community.description}
              </p>

              <div className="flex items-center gap-x-4 text-sm text-gray-500 dark:text-neutral-500 mb-4">
                <div className="flex items-center gap-x-1">
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{formatMembersCount(community.members_count)}</span>
                </div>
                {community.events_count > 0 && (
                  <div className="flex items-center gap-x-1">
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    <span>{community.events_count} {community.events_count === 1 ? 'событие' : community.events_count < 5 ? 'события' : 'событий'}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/communities/${community.slug}`}
                  className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Подробнее
                </Link>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  Вступить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
