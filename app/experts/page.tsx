import Link from 'next/link';

export default function ExpertsPage() {
  const experts = [
    {
      id: 1,
      name: 'Анна Петрова',
      specialization: 'Театральный режиссёр',
      bio: 'Профессиональный режиссёр с 15-летним опытом. Организует театральные постановки и мастер-классы.',
      rating: 4.9,
      reviews: 42,
      upcomingEvents: 3,
    },
    {
      id: 2,
      name: 'Дмитрий Соколов',
      specialization: 'Астроном',
      bio: 'Кандидат физико-математических наук. Читает лекции по астрономии и космологии.',
      rating: 5.0,
      reviews: 67,
      upcomingEvents: 5,
    },
    {
      id: 3,
      name: 'Екатерина Волкова',
      specialization: 'Художник',
      bio: 'Художник-живописец, член Союза художников. Проводит мастер-классы по живописи и рисунку.',
      rating: 4.8,
      reviews: 38,
      upcomingEvents: 4,
    },
    {
      id: 4,
      name: 'Иван Смирнов',
      specialization: 'Спортивный тренер',
      bio: 'Мастер спорта по лёгкой атлетике. Организует беговые тренировки и марафоны.',
      rating: 4.9,
      reviews: 55,
      upcomingEvents: 7,
    },
    {
      id: 5,
      name: 'Мария Козлова',
      specialization: 'Психолог',
      bio: 'Практикующий психолог. Проводит лекции и тренинги по саморазвитию и психологии.',
      rating: 5.0,
      reviews: 89,
      upcomingEvents: 6,
    },
    {
      id: 6,
      name: 'Александр Новиков',
      specialization: 'Фотограф',
      bio: 'Профессиональный фотограф с опытом более 10 лет. Проводит фотопрогулки и мастер-классы.',
      rating: 4.7,
      reviews: 31,
      upcomingEvents: 2,
    },
  ];

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
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="size-20 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-3xl mb-3">
                  {expert.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300">
                  {expert.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 py-1 px-3 mt-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {expert.specialization}
                </span>
              </div>

              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 text-center">
                {expert.bio}
              </p>

              <div className="flex items-center justify-center gap-x-4 text-sm mb-4">
                <div className="flex items-center gap-x-1 text-yellow-500">
                  <svg className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span className="font-semibold text-gray-800 dark:text-neutral-200">{expert.rating}</span>
                  <span className="text-gray-500 dark:text-neutral-500">({expert.reviews})</span>
                </div>
                <div className="flex items-center gap-x-1 text-gray-500 dark:text-neutral-500">
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <span>{expert.upcomingEvents} событий</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/experts/${expert.id}`}
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
