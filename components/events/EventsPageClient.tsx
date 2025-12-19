'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EventCard from '@/components/events/EventCard';
import { EventFilters } from '@/app/events/actions';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface EventsPageClientProps {
  initialEvents: any[];
  initialTotal: number;
  initialPage: number;
  initialPerPage: number;
  initialTotalPages: number;
  categories: any[];
}

export default function EventsPageClient({
  initialEvents,
  initialTotal,
  initialPage,
  initialPerPage,
  initialTotalPages,
  categories,
}: EventsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState(initialEvents);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояния фильтров
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<EventFilters>({
    categoryId: searchParams.get('category') || undefined,
    wishes: searchParams.get('wishes')?.split(',').filter(Boolean) || [],
    targetAudience: searchParams.get('audience')?.split(',').filter(Boolean) || [],
    ageCategories: searchParams.get('age')?.split(',').filter(Boolean) || [],
    format: (searchParams.get('format') as any) || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'date',
    sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
  });
  
  const [priceFilter, setPriceFilter] = useState<string>('');
  
  // Синхронизация с URL при монтировании
  useEffect(() => {
    const urlPrice = searchParams.get('price');
    if (urlPrice) {
      setPriceFilter(urlPrice);
    }
  }, [searchParams]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [tempFilters, setTempFilters] = useState<Partial<EventFilters>>({});

  const wishes = [
    'Поиграть', 'Посмотреть', 'Учиться', 'Познакомиться', 'Удивиться',
    'Вдохновиться', 'Оттянуться', 'Поразмышлять', 'Отдохнуть', 'Развлечься',
    'Потусоваться', 'Получить опыт', 'Проявить себя', 'Погулять',
    'Почувствовать атмосферу', 'Творить', 'Исследовать'
  ];

  const socialAudience = [
    'Для родителей с детьми', 'Для школьных классов', 'Для студентов',
    'Для работающих', 'Для предпринимателей', 'Для людей с ОВЗ',
    'Для творческих людей', 'Для спортсменов', 'Для пенсионеров',
    'Для волонтёров', 'Для иностранцев/экспатов', 'Для всех желающих'
  ];

  const ageOptions = [
    'Малыши 0+', 'Младшие школьники 6+', 'Старшие школьники 12+',
    'Подростки 16+', 'Взрослые 18+'
  ];

  const datePresets = [
    { label: 'Сегодня', getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: 'Завтра', getValue: () => { const tomorrow = addDays(new Date(), 1); return { from: tomorrow, to: tomorrow }; } },
    { label: 'Выходные', getValue: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
      const saturday = addDays(today, daysUntilSaturday);
      const sunday = addDays(saturday, 1);
      return { from: saturday, to: sunday };
    }},
    { label: 'Эта неделя', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
    { label: 'Следующая неделя', getValue: () => {
      const nextWeek = addWeeks(new Date(), 1);
      return { from: startOfWeek(nextWeek, { weekStartsOn: 1 }), to: endOfWeek(nextWeek, { weekStartsOn: 1 }) };
    }},
  ];

  // Применение фильтров
  const applyFilters = useCallback(async (newFilters: EventFilters, newPage: number = 1, currentPriceFilter?: string) => {
    setIsLoading(true);
    
    // Используем переданный priceFilter или текущий
    const activePriceFilter = currentPriceFilter !== undefined ? currentPriceFilter : priceFilter;
    
    // Создаем URL параметры
    const params = new URLSearchParams();
    if (newFilters.categoryId) params.set('category', newFilters.categoryId);
    if (newFilters.wishes && newFilters.wishes.length > 0) params.set('wishes', newFilters.wishes.join(','));
    if (newFilters.targetAudience && newFilters.targetAudience.length > 0) params.set('audience', newFilters.targetAudience.join(','));
    if (newFilters.ageCategories && newFilters.ageCategories.length > 0) params.set('age', newFilters.ageCategories.join(','));
    if (newFilters.format) params.set('format', newFilters.format);
    if (activePriceFilter) params.set('price', activePriceFilter);
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);
    if (newPage > 1) params.set('page', newPage.toString());

    // Обновляем URL
    router.push(`/events?${params.toString()}`, { scroll: false });
    
    try {
      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();
      
      setEvents(data.events);
      setTotal(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, priceFilter]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleFilterChange = (filterType: keyof EventFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleApplyDropdownFilter = (filterType: keyof EventFilters) => {
    const newFilters = { ...selectedFilters, [filterType]: tempFilters[filterType] };
    setSelectedFilters(newFilters);
    applyFilters(newFilters);
    closeDropdown();
  };

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...selectedFilters, categoryId };
    setSelectedFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...selectedFilters, sortBy: sortBy as any };
    setSelectedFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters: EventFilters = { sortBy: 'date', sortOrder: 'asc' };
    setSelectedFilters(emptyFilters);
    setDateRange(undefined);
    setSelectedPreset('');
    setTempFilters({});
    setPriceFilter('');
    applyFilters(emptyFilters, 1, ''); // Передаем пустую строку для price
  };

  const handlePageChange = (page: number) => {
    applyFilters(selectedFilters, page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getDateLabel = () => {
    if (selectedPreset) return selectedPreset;
    if (dateRange?.from) {
      if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
        return `${format(dateRange.from, 'd MMM', { locale: ru })} - ${format(dateRange.to, 'd MMM', { locale: ru })}`;
      }
      return format(dateRange.from, 'd MMMM', { locale: ru });
    }
    return 'Дата';
  };

  const handlePresetClick = (preset: typeof datePresets[0]) => {
    const range = preset.getValue();
    setDateRange(range);
    setSelectedPreset(preset.label);
    const newFilters = {
      ...selectedFilters,
      dateFrom: range.from?.toISOString(),
      dateTo: range.to?.toISOString(),
    };
    setSelectedFilters(newFilters);
    applyFilters(newFilters);
    closeDropdown();
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setSelectedPreset('');
    if (range?.from && range?.to) {
      const newFilters = {
        ...selectedFilters,
        dateFrom: range.from.toISOString(),
        dateTo: range.to.toISOString(),
      };
      setSelectedFilters(newFilters);
    }
  };

  const clearDateFilter = () => {
    setDateRange(undefined);
    setSelectedPreset('');
    const newFilters = { ...selectedFilters, dateFrom: undefined, dateTo: undefined };
    setSelectedFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="max-w-[1920px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Все мероприятия Иркутска
        </h1>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Найдите интересные события с помощью фильтров
        </p>
      </div>

      {/* Категории */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`py-2 px-4 text-sm font-medium rounded-full border-2 transition-colors ${
              !selectedFilters.categoryId
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
            }`}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`py-2 px-4 text-sm font-medium rounded-full border-2 transition-colors ${
                selectedFilters.categoryId === category.id
                  ? `bg-white dark:bg-neutral-900 text-gray-900 dark:text-white`
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
              }`}
              style={
                selectedFilters.categoryId === category.id
                  ? { borderColor: category.color || '#3b82f6' }
                  : category.color
                  ? { borderColor: category.color }
                  : undefined
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Фильтры */}
      <div className="mb-6 space-y-4">
        {/* Строка с фильтрами */}
        <div className="flex flex-wrap gap-3">
          {/* Дата */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('date')}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {getDateLabel()}
              {dateRange && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearDateFilter(); }}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </button>
            
            {openDropdown === 'date' && (
              <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                <div className="mb-3 flex flex-wrap gap-2">
                  {datePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetClick(preset)}
                      className={`py-1.5 px-3 text-sm rounded-md transition-colors ${
                        selectedPreset === preset.label
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  locale={ru}
                  className="!font-sans"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={closeDropdown}
                    className="py-1.5 px-3 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      if (dateRange?.from && dateRange?.to) {
                        const newFilters = {
                          ...selectedFilters,
                          dateFrom: dateRange.from.toISOString(),
                          dateTo: dateRange.to.toISOString(),
                        };
                        setSelectedFilters(newFilters);
                        applyFilters(newFilters);
                      }
                      closeDropdown();
                    }}
                    className="py-1.5 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Желания */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('wishes')}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white inline-flex items-center gap-2"
            >
              Я хочу..
              {selectedFilters.wishes && selectedFilters.wishes.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {selectedFilters.wishes.length}
                </span>
              )}
            </button>
            
            {openDropdown === 'wishes' && (
              <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 w-80 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {wishes.map((wish) => (
                    <label key={wish} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={tempFilters.wishes?.includes(wish) || selectedFilters.wishes?.includes(wish) || false}
                        onChange={(e) => {
                          const current = tempFilters.wishes || selectedFilters.wishes || [];
                          const updated = e.target.checked
                            ? [...current, wish]
                            : current.filter(w => w !== wish);
                          handleFilterChange('wishes', updated);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">{wish}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeDropdown}
                    className="py-1.5 px-3 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => handleApplyDropdownFilter('wishes')}
                    className="py-1.5 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Аудитория */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('audience')}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white inline-flex items-center gap-2"
            >
              Аудитория
              {selectedFilters.targetAudience && selectedFilters.targetAudience.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {selectedFilters.targetAudience.length}
                </span>
              )}
            </button>
            
            {openDropdown === 'audience' && (
              <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 w-80 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {socialAudience.map((audience) => (
                    <label key={audience} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={tempFilters.targetAudience?.includes(audience) || selectedFilters.targetAudience?.includes(audience) || false}
                        onChange={(e) => {
                          const current = tempFilters.targetAudience || selectedFilters.targetAudience || [];
                          const updated = e.target.checked
                            ? [...current, audience]
                            : current.filter(a => a !== audience);
                          handleFilterChange('targetAudience', updated);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">{audience}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeDropdown}
                    className="py-1.5 px-3 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => handleApplyDropdownFilter('targetAudience')}
                    className="py-1.5 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Возраст */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('age')}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white inline-flex items-center gap-2"
            >
              Возраст
              {selectedFilters.ageCategories && selectedFilters.ageCategories.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {selectedFilters.ageCategories.length}
                </span>
              )}
            </button>
            
            {openDropdown === 'age' && (
              <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 w-80">
                <div className="space-y-2">
                  {ageOptions.map((age) => (
                    <label key={age} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={tempFilters.ageCategories?.includes(age) || selectedFilters.ageCategories?.includes(age) || false}
                        onChange={(e) => {
                          const current = tempFilters.ageCategories || selectedFilters.ageCategories || [];
                          const updated = e.target.checked
                            ? [...current, age]
                            : current.filter(a => a !== age);
                          handleFilterChange('ageCategories', updated);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">{age}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeDropdown}
                    className="py-1.5 px-3 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => handleApplyDropdownFilter('ageCategories')}
                    className="py-1.5 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Формат */}
          <div className="relative">
            <select
              value={selectedFilters.format || ''}
              onChange={(e) => {
                const newFilters = { ...selectedFilters, format: e.target.value as any };
                setSelectedFilters(newFilters);
                applyFilters(newFilters);
              }}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="">Формат</option>
              <option value="offline">Оффлайн</option>
              <option value="online">Онлайн</option>
            </select>
          </div>

          {/* Цена */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => {
                const newPrice = e.target.value;
                setPriceFilter(newPrice);
                applyFilters(selectedFilters, 1, newPrice);
              }}
              className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="">Цена</option>
              <option value="free">Бесплатно</option>
              <option value="paid">Платно</option>
            </select>
          </div>
        </div>

        {/* Строка с результатами и сортировкой */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Найдено мероприятий: <span className="font-semibold">{total}</span>
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetFilters}
              className="py-2 px-4 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
            >
              Сбросить фильтры
            </button>
            
            <div className="relative">
              <select
                value={selectedFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              >
                <option value="date">По дате</option>
                <option value="popularity">По популярности</option>
                <option value="price">По цене</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Сетка событий */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  <span>Назад</span>
                </button>
                
                <div className="flex items-center gap-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 text-sm rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
                >
                  <span>Далее</span>
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Событий не найдено
          </h3>
          <p className="text-gray-500 dark:text-neutral-400 mb-4">
            Попробуйте изменить параметры фильтрации
          </p>
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}