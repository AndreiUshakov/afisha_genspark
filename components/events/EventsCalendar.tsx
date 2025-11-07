'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { mockEvents, formatPrice, formatEventDate } from '@/data/mockEvents';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  dayName: string;
  monthName: string;
  isCurrentMonth: boolean;
  events: Array<typeof mockEvents[0]>;
}

export default function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const swiperRef = useRef<SwiperType | null>(null);

  // Получаем категорию по ID для иконки
  const getCategoryIcon = (categoryId: string): string => {
    const categoryIconMap: Record<string, string> = {
      'cat-music': '🎵',
      'cat-culture': '🎭',
      'cat-education': '📚',
      'cat-sport': '⚽',
      'cat-food': '🍴',
      'cat-entertainment': '🎉',
      'cat-nature': '🌿',
      'cat-concerts-music': '🎶',
      'cat-theater-performance': '🎪',
      'cat-exhibitions-art': '🎨',
      'cat-festivals': '🎊',
      'cat-children': '🧸',
      'cat-cinema-media': '🎬',
      'cat-entertainment-nightlife': '🌙',
      'cat-gastronomy': '🎂',
      'cat-hobbies-crafts': '✂️',
      'cat-ecology-health': '🌱',
      'cat-business-networking': '💼',
      'cat-psychology-spiritual': '🧘',
      'cat-fashion-beauty': '💄',
    };
    return categoryIconMap[categoryId] || '📅';
  };

  // Генерируем дни календаря (4 недели = 28 дней)
  const generateCalendarDays = (): CalendarDay[] => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // Начинаем с 1 недель назад
    
    const days: CalendarDay[] = [];
    
    // Генерируем 28 дней (4 недели)
    for (let i = 0; i < 28; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Фильтруем события для этого дня
      const dayEvents = mockEvents.filter(event => {
        if (!event.is_published) return false;
        const eventDate = new Date(event.event_date);
        return eventDate.toDateString() === currentDate.toDateString();
      });

      days.push({
        date: currentDate,
        dayNumber: currentDate.getDate(),
        dayName: currentDate.toLocaleDateString('ru-RU', { weekday: 'short' }),
        monthName: currentDate.toLocaleDateString('ru-RU', { month: 'short' }),
        isCurrentMonth: currentDate.getMonth() === today.getMonth(),
        events: dayEvents,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // События выбранной даты
  const selectedDateEvents = calendarDays.find(day => 
    day.date.toDateString() === selectedDate.toDateString()
  )?.events || [];

  // Функция возврата к сегодня
  const goToToday = () => {
    const todayIndex = calendarDays.findIndex(day => {
      const today = new Date();
      return day.date.toDateString() === today.toDateString();
    });
    
    if (todayIndex !== -1 && swiperRef.current) {
      swiperRef.current.slideTo(Math.max(0, todayIndex - 3)); // Показываем сегодня ближе к левому краю
      setSelectedDate(new Date());
    }
  };

  // Проверка, является ли день выбранным
  const isSelectedDay = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Проверка, является ли день сегодняшним
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl text-gray-900 dark:text-white">
            Календарь событий
          </h2>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Выберите дату для просмотра мероприятий
          </p>
        </div>
        
        {/* Кнопка Сегодня */}
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors"
        >
          Сегодня
        </button>
      </div>

      {/* Календарная карусель */}
      <div className="relative overflow-hidden px-6">
        {/* Custom styles для навигации и скрытие полосы прокрутки */}
        <style jsx>{`
          .calendar-swiper .swiper-button-prev,
          .calendar-swiper .swiper-button-next {
            color: rgb(59 130 246);
            background: white;
            width: 40px;
            height: 40px;
            margin-top: 0;
            border-radius: 50%;
            border: 1px solid rgb(229 231 235);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transform: translateY(-50%);
            top: 50%;
          }
          .calendar-swiper .swiper-button-prev:after,
          .calendar-swiper .swiper-button-next:after {
            font-size: 16px;
            font-weight: 600;
          }
          .calendar-swiper .swiper-button-prev:hover,
          .calendar-swiper .swiper-button-next:hover {
            background: rgb(249 250 251);
          }
          .calendar-swiper .swiper-button-disabled {
            opacity: 0.5;
          }
          
          /* Правильное скрытие полосы прокрутки и переполнения */
          .calendar-swiper {
            overflow: hidden !important;
          }
          .calendar-swiper .swiper-wrapper {
            overflow: hidden !important;
          }
          .calendar-swiper .swiper-container {
            overflow: hidden !important;
          }
          .calendar-swiper::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .calendar-swiper .swiper::-webkit-scrollbar {
            display: none !important;
          }
          .calendar-swiper {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          
          /* Dark theme */
          .dark .calendar-swiper .swiper-button-prev,
          .dark .calendar-swiper .swiper-button-next {
            background: rgb(23 23 23);
            border-color: rgb(63 63 70);
            color: rgb(156 163 175);
          }
          .dark .calendar-swiper .swiper-button-prev:hover,
          .dark .calendar-swiper .swiper-button-next:hover {
            background: rgb(39 39 42);
          }
        `}</style>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={{
            prevEl: '.calendar-prev',
            nextEl: '.calendar-next'
          }}
          grabCursor={true}
          watchOverflow={true}
          allowTouchMove={true}
          preventClicks={true}
          preventClicksPropagation={true}
          resistanceRatio={0}
          resistance={true}
          rewind={false}
          loop={false}
          centeredSlides={true}
          centeredSlidesBounds={true}
          breakpoints={{
            320: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 6,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 7,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 12,
            },
            1280: {
              slidesPerView: 11,
              spaceBetween: 12,
            },
            1536: {
              slidesPerView: 13,
              spaceBetween: 12,
            }
          }}
          className="calendar-swiper !overflow-hidden"
          style={{
            paddingBottom: '16px',
            overflow: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          initialSlide={7} // Начинаем с сегодняшнего дня (7-й день из 28)
        >
          {calendarDays.map((day, index) => {
            const isCurrentDay = isToday(day.date);
            const isSelected = isSelectedDay(day.date);
            const hasEvents = day.events.length > 0;
            const showMonthSeparator = index > 0 && 
              day.date.getMonth() !== calendarDays[index - 1].date.getMonth();
            
            return (
              <SwiperSlide key={`${day.date.toISOString()}-${index}`} className="!w-auto">
                <div className="flex items-center">
                  {/* Разделитель месяцев */}
                  {showMonthSeparator && (
                    <div className="flex flex-col items-center justify-center mx-2 mr-4">
                      <div className="h-px w-6 bg-gray-300 dark:bg-neutral-600"></div>
                      <span className="text-xs text-gray-500 dark:text-neutral-500 mt-1 font-medium whitespace-nowrap">
                        {day.monthName}
                      </span>
                    </div>
                  )}
                  
                  {/* Ячейка дня */}
                  <div
                    className={`
                      flex-shrink-0 w-20 h-28 rounded-xl border-2 cursor-pointer transition-all duration-200 relative
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                        : hasEvents 
                          ? 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900'
                      }
                    `}
                    onClick={() => setSelectedDate(new Date(day.date))}
                  >
                    {/* Содержимое дня */}
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      <span className={`
                        text-xl font-bold leading-none
                        ${isSelected || isCurrentDay
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-white'
                        }
                      `}>
                        {day.dayNumber}
                      </span>
                      <span className={`
                        text-xs font-medium leading-none mt-1
                        ${isSelected || isCurrentDay
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-neutral-500'
                        }
                      `}>
                        {day.dayName}
                      </span>
                      
                      {/* Иконки категорий */}
                      {hasEvents && (
                        <div className="flex flex-wrap justify-center gap-0.5 mt-2">
                          {day.events.slice(0, 2).map((event, idx) => (
                            <span 
                              key={`${event.id}-${idx}`}
                              className="text-lg leading-none"
                              title={event.title}
                            >
                              {getCategoryIcon(event.category_id)}
                            </span>
                          ))}
                          {day.events.length > 2 && (
                            <div className="w-full text-center">
                              <span className="text-xs text-gray-500 dark:text-neutral-400 font-medium">
                                +{day.events.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Индикатор сегодня */}
                    {isCurrentDay && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          
          {/* Карточка "Все события" */}
          <SwiperSlide className="!w-auto">
            <Link
              href="/events"
              className="flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:hover:border-blue-500 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 text-center leading-tight">
                Все<br />события
              </span>
            </Link>
          </SwiperSlide>
        </Swiper>

        {/* Кастомные кнопки навигации */}
        <button className="calendar-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-md">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button className="calendar-next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-md">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* События выбранной даты */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            События на {selectedDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long',
              weekday: 'long'
            })}
          </h3>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {selectedDateEvents.length} событий
          </span>
        </div>

        {selectedDateEvents.length > 0 ? (
          <div className={`
            ${selectedDateEvents.length === 1
              ? 'space-y-6'
              : selectedDateEvents.length === 2
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                : `grid gap-6 ${selectedDateEvents.length === 3
                    ? 'sm:grid-cols-2 lg:grid-cols-3'
                    : 'sm:grid-cols-2 lg:grid-cols-4'
                  }`
            }
          `}>
            {selectedDateEvents.map((event) => {
              const dateText = formatEventDate(event.event_date);
              const priceText = formatPrice(event);
              const isHorizontal = selectedDateEvents.length <= 2;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className={`
                    group bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700
                    ${isHorizontal
                      ? 'flex flex-col sm:flex-row max-w-4xl mx-auto overflow-hidden'
                      : 'flex flex-col h-full'
                    }
                  `}
                >
                  {/* Изображение */}
                  <div className={`
                    relative overflow-hidden
                    ${isHorizontal
                      ? 'w-full sm:w-80 h-48 sm:h-auto sm:flex-shrink-0 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none'
                      : 'w-full h-52 rounded-t-xl'
                    }
                  `}>
                    <Image
                      src={event.cover_image_url}
                      alt={event.title}
                      fill
                      sizes={isHorizontal
                        ? "(max-width: 640px) 100vw, 320px"
                        : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      }
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Контент */}
                  <div className={`
                    ${isHorizontal
                      ? 'flex-1 p-6 md:p-8 flex flex-col justify-between'
                      : 'p-4 md:p-6'
                    }
                  `}>
                    <div>
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {event.category_name}
                      </span>
                      
                      <h4 className={`
                        mt-3 font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white
                        ${isHorizontal ? 'text-xl md:text-2xl line-clamp-2' : 'text-xl line-clamp-2'}
                      `}>
                        {event.title}
                      </h4>
                      
                      {/* Описание для горизонтальных карточек */}
                      {isHorizontal && event.description && (
                        <p className="mt-3 text-gray-600 dark:text-neutral-400 line-clamp-2 text-sm md:text-base leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Метаинформация */}
                    <div className={`
                      ${isHorizontal ? 'mt-6 space-y-3' : 'mt-3 space-y-2'}
                      ${isHorizontal ? 'text-sm md:text-base' : 'text-sm'}
                    `}>
                      <div className="flex items-center gap-x-2 text-gray-600 dark:text-neutral-400">
                        <svg className={`shrink-0 ${isHorizontal ? 'size-5' : 'size-4'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                          <line x1="16" x2="16" y1="2" y2="6"/>
                          <line x1="8" x2="8" y1="2" y2="6"/>
                          <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                        <span className="truncate">{dateText}</span>
                      </div>
                      
                      <div className="flex items-center gap-x-2 text-gray-600 dark:text-neutral-400">
                        <svg className={`shrink-0 ${isHorizontal ? 'size-5' : 'size-4'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      {/* Цена для горизонтальных карточек */}
                      {isHorizontal && (
                        <div className="flex items-center gap-x-2 text-gray-600 dark:text-neutral-400">
                          <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" x2="12" y1="2" y2="22"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{priceText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Событий не найдено
            </h3>
            <p className="text-gray-500 dark:text-neutral-400">
              На выбранную дату мероприятия не запланированы
            </p>
          </div>
        )}
      </div>
    </div>
  );
}