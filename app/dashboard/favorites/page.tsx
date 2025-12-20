import EventCard from '@/components/events/EventCard';
import { getUserFavorites } from '@/app/actions/favorites';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function FavoritesPage() {
  // Проверяем аутентификацию
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Получаем избранные мероприятия из БД
  const { favorites } = await getUserFavorites();
  
  // Преобразуем данные для EventCard
  const favoriteEvents = favorites
    .map(fav => {
      // events может быть объектом или массивом в зависимости от типизации Supabase
      const event = Array.isArray(fav.events) ? fav.events[0] : fav.events;
      if (!event) return null;
      
      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description || '',
        cover_image_url: event.cover_image_url || '',
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.venue_name || 'Онлайн',
        address: event.venue_address || '',
        price_type: event.is_free ? 'free' as const : 'paid' as const,
        price_min: event.price_min,
        price_max: event.price_max,
        organizer_name: event.organizer_name || '',
        organizer_avatar: event.organizer_avatar,
        tags: event.tags || [],
        is_published: event.is_published,
        format: event.location_type as 'online' | 'offline' | 'hybrid',
        registered_count: 0,
        views_count: 0,
        favorites_count: 0,
        is_featured: false,
        created_at: fav.created_at,
        updated_at: fav.created_at,
        organizer_type: 'community' as const,
        category_id: '',
      };
    })
    .filter((event): event is NonNullable<typeof event> => event !== null);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Избранное</h1>
      
      {favoriteEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEvents.map((event) => (
            <EventCard key={event.id} event={event} isFavorited={true} />
          ))}
        </div>
      ) : (
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
