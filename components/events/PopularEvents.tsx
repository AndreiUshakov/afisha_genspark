import Link from 'next/link';

// Временные данные для демонстрации
const popularEvents = [
  {
    id: 1,
    title: 'Детский спектакль "Золушка"',
    category: 'Семейное',
    date: '28 октября 2025',
    time: '12:00',
    price: 'от 500 ₽',
    location: 'Драматический театр',
    image: '/images/events/event1.jpg',
    categoryColor: 'blue'
  },
  {
    id: 2,
    title: 'Выставка современного искусства',
    category: 'Культура',
    date: '30 октября 2025',
    time: '10:00 - 20:00',
    price: 'Бесплатно',
    location: 'Художественный музей',
    image: '/images/events/event2.jpg',
    categoryColor: 'purple'
  },
  {
    id: 3,
    title: 'Лекция по астрономии',
    category: 'Наука',
    date: '2 ноября 2025',
    time: '18:00',
    price: 'Бесплатно',
    location: 'ИГУ, главный корпус',
    image: '/images/events/event3.jpg',
    categoryColor: 'green'
  },
];

export default function PopularEvents() {
  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Популярные события недели
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Самые ожидаемые мероприятия Иркутска
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularEvents.map((event) => (
          <Link 
            key={event.id}
            href={`/events/${event.id}`}
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700"
          >
            <div className="h-52 flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl">
              <svg className="size-24 text-white/80" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
                <path d="M8 14h.01"/>
                <path d="M12 14h.01"/>
                <path d="M16 14h.01"/>
                <path d="M8 18h.01"/>
                <path d="M12 18h.01"/>
                <path d="M16 18h.01"/>
              </svg>
            </div>
            <div className="p-4 md:p-6">
              <span className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-${event.categoryColor}-100 text-${event.categoryColor}-800 dark:bg-${event.categoryColor}-900 dark:text-${event.categoryColor}-200`}>
                {event.category}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white">
                {event.title}
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-neutral-400">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  {event.date}, {event.time}
                </div>
                <div className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-neutral-400">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {event.location}
                </div>
                <div className="flex items-center gap-x-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="2" y2="22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {event.price}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  type="button"
                  className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                  В избранное
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/events" className="py-3 px-4 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-blue-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
          Все мероприятия
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
