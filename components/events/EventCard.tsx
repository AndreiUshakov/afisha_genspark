import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';

// Support both old simple format and new detailed format
interface SimpleEvent {
  id: number | string;
  title: string;
  category: string;
  date: string;
  time: string;
  price: string;
  location: string;
  ageCategory?: string;
  format?: string;
}

interface DetailedEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  category_name?: string;
  event_date: string;
  location: string;
  price_type: 'free' | 'paid' | 'donation';
  price_min?: number;
  price_max?: number;
  format: 'online' | 'offline' | 'hybrid';
  age_restriction?: string;
}

type Event = SimpleEvent | DetailedEvent;

interface EventCardProps {
  event: Event;
  isFavorited?: boolean;
}

// Type guard to check if event is DetailedEvent
function isDetailedEvent(event: Event): event is DetailedEvent {
  return 'slug' in event && 'cover_image_url' in event;
}

export default function EventCard({ event, isFavorited = false }: EventCardProps) {
  // Format data based on event type
  const href = isDetailedEvent(event) ? `/events/${event.slug}` : `/events/${event.id}`;
  const title = event.title;
  const category = isDetailedEvent(event) ? event.category_name || 'Событие' : event.category;
  const location = event.location;
  
  let dateText = '';
  let timeText = '';
  let priceText = '';
  let formatText = '';
  let hasCoverImage = false;
  let coverImageUrl = '';

  if (isDetailedEvent(event)) {
    const eventDate = new Date(event.event_date);
    dateText = eventDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    timeText = eventDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    if (event.price_type === 'free') {
      priceText = 'Бесплатно';
    } else if (event.price_type === 'donation') {
      priceText = 'Донейшн';
    } else if (event.price_min && event.price_max && event.price_min !== event.price_max) {
      priceText = `${event.price_min} - ${event.price_max} ₽`;
    } else if (event.price_min) {
      priceText = `от ${event.price_min} ₽`;
    } else {
      priceText = 'Уточняется';
    }
    
    formatText = event.format === 'online' ? 'Онлайн' :  'Оффлайн' ;
    hasCoverImage = !!event.cover_image_url;
    coverImageUrl = event.cover_image_url;
  } else {
    dateText = event.date;
    timeText = event.time;
    priceText = event.price;
    formatText = event.format || '';
  }

  return (
    <div className="group relative flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700">
      {/* Favorite Button - Positioned absolutely */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          eventId={isDetailedEvent(event) ? event.slug : String(event.id)}
          initialFavorited={isFavorited}
          variant="compact"
        />
      </div>

      <Link href={href} className="flex flex-col h-full">
      {hasCoverImage ? (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl">
          <svg className="size-20 text-white/80" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      )}
      
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {category}
          </span>
          {formatText && (
            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              {formatText}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-auto pt-4 space-y-2">
          <div className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-neutral-400">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            {dateText}, {timeText}
          </div>
          <div className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-neutral-400">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-x-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {priceText}
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}
