import Link from 'next/link';

export default function CommunitiesPreview() {
  const communities = [
    {
      id: 1,
      name: 'Астрономическое общество Иркутска',
      description: 'Любители астрономии и космоса. Регулярные встречи, наблюдения, лекции.',
      members: 127,
      category: 'Наука',
      upcomingEvents: 3,
    },
    {
      id: 2,
      name: 'Театральная студия "Маска"',
      description: 'Театральные постановки, мастер-классы по актёрскому мастерству.',
      members: 89,
      category: 'Культура',
      upcomingEvents: 5,
    },
    {
      id: 3,
      name: 'Клуб бегунов Иркутска',
      description: 'Совместные пробежки, марафоны, спортивные мероприятия.',
      members: 234,
      category: 'Спорт',
      upcomingEvents: 7,
    },
  ];

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Активные сообщества
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Найдите единомышленников и присоединяйтесь к сообществам
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-x-2 mb-3">
                <div className="flex-shrink-0">
                  <div className="size-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-xl">
                    {community.name.charAt(0)}
                  </div>
                </div>
                <div className="grow">
                  <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {community.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300">
                {community.name}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-neutral-400 text-sm">
                {community.description}
              </p>

              <div className="mt-4 flex items-center gap-x-4 text-sm text-gray-500 dark:text-neutral-500">
                <div className="flex items-center gap-x-1">
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{community.members} участников</span>
                </div>
                <div className="flex items-center gap-x-1">
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <span>{community.upcomingEvents} событий</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  href={`/communities/${community.id}`}
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

      <div className="mt-12 text-center">
        <Link href="/communities" className="py-3 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-blue-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
          Все сообщества
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
