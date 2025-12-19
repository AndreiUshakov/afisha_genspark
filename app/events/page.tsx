import { getEvents, getCategoriesWithCount } from './actions';
import EventsPageClient from '@/components/events/EventsPageClient';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Получаем параметры из URL
  const params = await searchParams;
  const categoryId = typeof params.category === 'string' ? params.category : undefined;
  const wishes = typeof params.wishes === 'string' ? params.wishes.split(',') : undefined;
  const targetAudience = typeof params.audience === 'string' ? params.audience.split(',') : undefined;
  const ageCategories = typeof params.age === 'string' ? params.age.split(',') : undefined;
  const format = typeof params.format === 'string' ? params.format as any : undefined;
  const priceType = typeof params.priceType === 'string' ? params.priceType as any : undefined;
  const dateFrom = typeof params.dateFrom === 'string' ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === 'string' ? params.dateTo : undefined;
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy as any : 'date';
  const sortOrder = typeof params.sortOrder === 'string' ? params.sortOrder as any : 'asc';
  const page = typeof params.page === 'string' ? Number(params.page) : 1;

  // Получаем события из БД с фильтрами
  const eventsData = await getEvents({
    categoryId,
    wishes,
    targetAudience,
    ageCategories,
    format,
    priceType,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    perPage: 12,
  });

  // Получаем категории с количеством событий
  const categories = await getCategoriesWithCount();

  return (
    <EventsPageClient
      initialEvents={eventsData.events}
      initialTotal={eventsData.total}
      initialPage={eventsData.page}
      initialPerPage={eventsData.perPage}
      initialTotalPages={eventsData.totalPages}
      categories={categories}
    />
  );
}
