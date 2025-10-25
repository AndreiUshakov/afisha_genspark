export default function WeekendEvents() {
  const weekendEvents = [
    {
      id: 1,
      title: 'Мастер-класс по рисованию',
      category: 'Семейное',
      day: 'Суббота',
      time: '11:00',
      duration: '2 часа',
      price: '800 ₽',
    },
    {
      id: 2,
      title: 'Экскурсия по историческим местам',
      category: 'Образование',
      day: 'Суббота',
      time: '14:00',
      duration: '3 часа',
      price: 'Бесплатно',
    },
    {
      id: 3,
      title: 'Концерт классической музыки',
      category: 'Культура',
      day: 'Воскресенье',
      time: '19:00',
      duration: '2.5 часа',
      price: 'от 1000 ₽',
    },
    {
      id: 4,
      title: 'Семейный пикник в парке',
      category: 'Активный отдых',
      day: 'Воскресенье',
      time: '12:00',
      duration: '4 часа',
      price: 'Бесплатно',
    },
  ];

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Как провести выходные
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Подборка мероприятий на субботу и воскресенье
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {weekendEvents.map((event) => (
          <div 
            key={event.id}
            className="group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 transition"
          >
            <div className="flex-shrink-0 relative rounded-lg overflow-hidden size-20 md:size-24">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="size-10 text-white/80" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              </div>
            </div>

            <div className="grow">
              <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {event.category}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white">
                {event.title}
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  <span className="font-semibold">{event.day}</span>, {event.time} • {event.duration}
                </p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {event.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
