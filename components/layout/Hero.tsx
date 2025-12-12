import Link from 'next/link';
import { getCategoriesFeaturedOnHero } from '@/data/mockCategories';
import React from 'react';

// Константы для стилей карточки "Все события" - улучшение читаемости и переиспользования
const ALL_EVENTS_CARD_STYLES = {
  base: "group relative p-2 md:p-3 rounded-xl focus:outline-none transition-all duration-300",
  background: "bg-white dark:bg-neutral-900",
  gradientBorder: "before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:-z-10",
  innerBorder: "relative z-10 bg-white dark:bg-neutral-900 rounded-xl",
  hover: "hover:shadow-lg hover:scale-[1.02] before:hover:from-blue-600 before:hover:via-purple-600 before:hover:to-pink-600",
  focus: "focus:shadow-lg focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
} as const;

// Утилита для объединения классов
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper function to get icon for category
function getCategoryIcon(iconType: string) {
  const iconProps = "shrink-0 size-6 text-white";
  
  switch (iconType) {
    case 'music':
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      );
    case 'theater':
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 16.1A5 5 0 0 1 5.9 20M6.3 20.7l13.38-13.38"/>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L2 8"/>
          <path d="M12 12V9a4 4 0 0 1 4-4h0l1.07 1.07a6 6 0 0 1 1.76 4.24l-.43 1.8"/>
        </svg>
      );
    case 'palette':
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      );
    case 'celebration':
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case 'sport':
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 22V12l-2-2 2-10 2 2 2-2 2 2 2-2 2 10-2 2v10"/>
          <path d="M16 6h4"/>
          <path d="M16 10h4"/>
          <path d="M16 14h4"/>
          <path d="M16 18h4"/>
          <path d="M8 6H4"/>
          <path d="M8 10H4"/>
          <path d="M8 14H4"/>
          <path d="M8 18H4"/>
        </svg>
      );
    default:
      return (
        <svg className={iconProps} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      );
  }
}

// Helper function to get color classes for category
function getCategoryColorClasses(color: string) {
  switch (color) {
    case 'blue':
      return { bg: 'bg-blue-600', hover: 'group-hover:text-blue-600' };
    case 'purple':
      return { bg: 'bg-purple-600', hover: 'group-hover:text-purple-600' };
    case 'pink':
      return { bg: 'bg-pink-600', hover: 'group-hover:text-pink-600' };
    case 'orange':
      return { bg: 'bg-orange-600', hover: 'group-hover:text-orange-600' };
    case 'green':
      return { bg: 'bg-green-600', hover: 'group-hover:text-green-600' };
    default:
      return { bg: 'bg-gray-600', hover: 'group-hover:text-gray-600' };
  }
}

export default function Hero() {
  const featuredCategories = getCategoriesFeaturedOnHero();
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-neutral-200">
            Город <span className="text-blue-600">живёт!</span>
          </h1>

          <p className="mt-3 text-gray-600 dark:text-neutral-400 text-lg">
            Найдите интересные мероприятия и сообщества для всей семьи
          </p>

          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form>
              <div className="relative z-10 flex gap-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                <div className="w-full">
                  <label htmlFor="hero-input" className="sr-only">Поиск мероприятий</label>
                  <input 
                    type="text" 
                    id="hero-input" 
                    name="hero-input" 
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                    placeholder="Поиск мероприятий, сообществ..."
                  />
                </div>
                <div>
                  <button 
                    type="button"
                    className="size-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg className="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg className="w-40 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="mt-10 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            {/* Category Cards - 5 categories from featured list */}
            {featuredCategories.map((category) => {
              const colorClasses = getCategoryColorClasses(category.color);
              return (
                <Link
                  key={category.id}
                  href={`/events?category=${category.slug}`}
                  className="group p-3 md:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700"
                >
                  <div className={`flex justify-center items-center size-10 ${colorClasses.bg} rounded-lg mx-auto`}>
                    {getCategoryIcon(category.icon || 'default')}
                  </div>
                  <div className="mt-3">
                    <h3 className={`${colorClasses.hover} text-base font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400 text-center`}>
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}

            {/* "All Events" Special Card */}
            <Link
              href="/events"
              className={cn(
                ALL_EVENTS_CARD_STYLES.base,
                ALL_EVENTS_CARD_STYLES.gradientBorder,
                ALL_EVENTS_CARD_STYLES.hover,
                ALL_EVENTS_CARD_STYLES.focus
              )}
              aria-label="Просмотреть все события"
              role="button"
              prefetch={false}
            >
              <div className={cn(ALL_EVENTS_CARD_STYLES.innerBorder, "p-3 md:p-3")}>
                <div className="flex justify-center items-center size-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                  <svg
                    className="shrink-0 size-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 2v4"/>
                    <path d="M16 2v4"/>
                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                    <path d="M3 10h18"/>
                  </svg>
                </div>
                <div className="mt-3">
                  <h3 className="group-hover:text-blue-600 dark:group-hover:text-blue-400 text-base font-semibold text-gray-800 dark:text-white text-center transition-colors duration-300">
                    Все события
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
