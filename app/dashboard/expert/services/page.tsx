export default function ExpertServicesPage() {
  // Mock data for expert services
  const services = [
    {
      id: 1,
      title: 'Консультация по организации мероприятий',
      description: 'Помогу с планированием и организацией любых мероприятий от идеи до реализации',
      duration: 60,
      price: 3000,
      status: 'active',
      bookings: 24,
      rating: 4.9,
      image: 'https://picsum.photos/seed/service1/400/300'
    },
    {
      id: 2,
      title: 'Анализ и планирование события',
      description: 'Детальный анализ концепции и составление пошагового плана мероприятия',
      duration: 90,
      price: 4500,
      status: 'active',
      bookings: 18,
      rating: 5.0,
      image: 'https://picsum.photos/seed/service2/400/300'
    },
    {
      id: 3,
      title: 'Подбор площадки',
      description: 'Помогу выбрать идеальное место для вашего мероприятия',
      duration: 45,
      price: 2500,
      status: 'active',
      bookings: 31,
      rating: 4.8,
      image: 'https://picsum.photos/seed/service3/400/300'
    },
    {
      id: 4,
      title: 'Разработка концепции',
      description: 'Создам уникальную концепцию вашего события',
      duration: 120,
      price: 6000,
      status: 'paused',
      bookings: 12,
      rating: 4.9,
      image: 'https://picsum.photos/seed/service4/400/300'
    },
    {
      id: 5,
      title: 'Работа с подрядчиками',
      description: 'Консультация по выбору и работе с поставщиками услуг',
      duration: 60,
      price: 3500,
      status: 'active',
      bookings: 15,
      rating: 4.7,
      image: 'https://picsum.photos/seed/service5/400/300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Мои услуги
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Управление услугами, которые вы предоставляете
          </p>
        </div>
        <a
          href="/dashboard/expert/services/create"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить услугу
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium">
          Все ({services.length})
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
          Активные ({services.filter(s => s.status === 'active').length})
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
          На паузе ({services.filter(s => s.status === 'paused').length})
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                {service.status === 'active' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                    Активна
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500 text-white shadow-lg">
                    На паузе
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Длительность:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {service.duration} мин
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Стоимость:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Записей:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {service.bookings}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Рейтинг:</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <a
                  href={`/dashboard/expert/services/${service.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Редактировать
                </a>
                <button
                  className="px-3 py-2 text-gray-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 border border-gray-300 dark:border-neutral-600 rounded-lg hover:border-red-300 dark:hover:border-red-600 transition-colors"
                  title="Удалить"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {services.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            У вас пока нет услуг
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            Создайте свою первую услугу и начните принимать записи от клиентов
          </p>
          <a
            href="/dashboard/expert/services/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Добавить услугу
          </a>
        </div>
      )}
    </div>
  );
}
