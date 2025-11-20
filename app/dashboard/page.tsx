export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Добро пожаловать!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Управляйте своим профилем и отслеживайте избранные события
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Избранные</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Подписки</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Ближайшие</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Посещено</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">27</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg dark:bg-orange-900/20">
              <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Быстрые действия
          </h2>
          <div className="space-y-3">
            <a href="/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <svg className="size-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Найти мероприятия</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Открыть каталог событий</p>
              </div>
            </a>
            <a href="/dashboard/favorites" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-red-50 rounded-lg dark:bg-red-900/20">
                <svg className="size-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Мое избранное</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Посмотреть сохраненные события</p>
              </div>
            </a>
            <a href="/dashboard/create-community" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
                <svg className="size-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Создать сообщество</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Стать организатором событий</p>
              </div>              
            </a>
            <a href="/dashboard/become-expert" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                <svg className="size-5 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Стать экспертом</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Предложить свои услуги</p>
              </div>              
            </a>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ближайшие события
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                15
                <span className="text-xs ml-1">окт</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Мастер-класс по рисованию</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">19:00 • Арт-галерея</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                18
                <span className="text-xs ml-1">окт</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Концерт симфонического оркестра</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">20:00 • Филармония</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                20
                <span className="text-xs ml-1">окт</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Театральная постановка</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">18:30 • Драмтеатр</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
