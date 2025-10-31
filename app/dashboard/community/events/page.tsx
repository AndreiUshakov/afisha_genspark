export default function CommunityEventsPage() {
  // Mock data for community events
  const events = [
    {
      id: 1,
      title: 'Концерт рок-группы "Сплин"',
      date: '2024-11-15',
      time: '19:00',
      location: 'БКЗ Филармонии',
      status: 'published',
      views: 2543,
      registrations: 187,
      image: 'https://picsum.photos/seed/event1/400/300'
    },
    {
      id: 2,
      title: 'Мастер-класс по керамике',
      date: '2024-11-08',
      time: '15:00',
      location: 'Творческая мастерская',
      status: 'published',
      views: 876,
      registrations: 24,
      image: 'https://picsum.photos/seed/event2/400/300'
    },
    {
      id: 3,
      title: 'Детский спектакль "Теремок"',
      date: '2024-11-20',
      time: '11:00',
      location: 'Театр кукол',
      status: 'draft',
      views: 0,
      registrations: 0,
      image: 'https://picsum.photos/seed/event3/400/300'
    },
    {
      id: 4,
      title: 'Выставка современного искусства',
      date: '2024-11-10',
      time: '10:00',
      location: 'Галерея "Мир"',
      status: 'published',
      views: 1432,
      registrations: 0,
      image: 'https://picsum.photos/seed/event4/400/300'
    },
    {
      id: 5,
      title: 'Йога для начинающих',
      date: '2024-11-12',
      time: '18:30',
      location: 'Фитнес-центр "Энергия"',
      status: 'published',
      views: 654,
      registrations: 42,
      image: 'https://picsum.photos/seed/event5/400/300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Мои события
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Управление событиями вашего сообщества
          </p>
        </div>
        <a
          href="/dashboard/community/events/create"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать событие
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
          Все ({events.length})
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
          Опубликованные ({events.filter(e => e.status === 'published').length})
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
          Черновики ({events.filter(e => e.status === 'draft').length})
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Событие
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Дата и время
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Просмотры
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Записи
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-neutral-400">
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(event.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {event.status === 'published' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Опубликовано
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300">
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {event.views.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {event.registrations.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/dashboard/community/events/${event.id}/edit`}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
                        title="Редактировать"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state for when there are no events */}
      {events.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            У вас пока нет событий
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            Создайте своё первое событие и начните привлекать участников
          </p>
          <a
            href="/dashboard/community/events/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Создать событие
          </a>
        </div>
      )}
    </div>
  );
}
