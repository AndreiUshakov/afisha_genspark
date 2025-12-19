import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/app/events/actions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    categoryId: searchParams.get('category') || undefined,
    wishes: searchParams.get('wishes')?.split(',').filter(Boolean) || undefined,
    targetAudience: searchParams.get('audience')?.split(',').filter(Boolean) || undefined,
    ageCategories: searchParams.get('age')?.split(',').filter(Boolean) || undefined,
    format: (searchParams.get('format') as any) || undefined,
    price: searchParams.get('price') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'date',
    sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    perPage: searchParams.get('perPage') ? Number(searchParams.get('perPage')) : 12,
  };

  const result = await getEvents(filters);
  
  return NextResponse.json(result);
}