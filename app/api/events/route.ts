import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/app/events/actions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Получаем и валидируем параметры
  const priceParam = searchParams.get('price');
  const price = (priceParam === 'free' || priceParam === 'paid' ? priceParam : undefined) as 'free' | 'paid' | undefined;
  
  const formatParam = searchParams.get('format');
  const format = (formatParam === 'online' || formatParam === 'offline' || formatParam === 'hybrid'
    ? formatParam
    : undefined) as 'online' | 'offline' | 'hybrid' | undefined;
  
  const sortByParam = searchParams.get('sortBy');
  const sortBy = (sortByParam === 'date' || sortByParam === 'popularity' || sortByParam === 'price'
    ? sortByParam
    : 'date') as 'date' | 'popularity' | 'price';
  
  const sortOrderParam = searchParams.get('sortOrder');
  const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc'
    ? sortOrderParam
    : 'asc') as 'asc' | 'desc';
  
  const filters = {
    categoryId: searchParams.get('category') || undefined,
    wishes: searchParams.get('wishes')?.split(',').filter(Boolean) || undefined,
    targetAudience: searchParams.get('audience')?.split(',').filter(Boolean) || undefined,
    ageCategories: searchParams.get('age')?.split(',').filter(Boolean) || undefined,
    format,
    price,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy,
    sortOrder,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    perPage: searchParams.get('perPage') ? Number(searchParams.get('perPage')) : 12,
  };

  const result = await getEvents(filters);
  
  return NextResponse.json(result);
}