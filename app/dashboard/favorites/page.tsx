import EventCard from '@/components/events/EventCard';
import { mockEvents } from '@/data/mockEvents';

export default function FavoritesPage() {
  const favoriteEvents = mockEvents.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Избранное</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {favoriteEvents.length === 0 && (
        <div className="text-center py-12">
          <svg className="size-16 mx-auto text-gray-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Пока нет избранных событий
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            Добавьте интересные мероприятия в избранное
          </p>
          <a
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Найти события
          </a>
        </div>
      )}
    </div>
  );
}
