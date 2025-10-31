'use client';

import { useState } from 'react';

export default function DropdownFilters() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Тип мероприятия */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Тип мероприятия
            <svg className={`size-4 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'type' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-60 bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {['Театр', 'Лекции', 'Мастер-классы', 'Выставки', 'Спорт', 'Семейное', 'Концерты', 'Кино'].map((type) => (
                    <label key={type} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{type}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button onClick={closeDropdown} className="w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Возраст */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('age')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Возраст
            <svg className={`size-4 transition-transform ${openDropdown === 'age' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'age' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-60 bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {['Дети 0-6', 'Школьники 7-12', 'Подростки 13-17', 'Взрослые', '55+'].map((age) => (
                    <label key={age} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{age}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button onClick={closeDropdown} className="w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Формат */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('format')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Формат
            <svg className={`size-4 transition-transform ${openDropdown === 'format' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'format' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-48 bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {['Офлайн', 'Онлайн', 'Гибрид'].map((format) => (
                    <label key={format} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="radio"
                        name="format-filter"
                        className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{format}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button onClick={closeDropdown} className="w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Дата */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('date')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Дата
            <svg className={`size-4 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'date' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-52 bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {['Сегодня', 'Завтра', 'Выходные', 'Эта неделя', 'Этот месяц'].map((date) => (
                    <label key={date} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="radio"
                        name="date-filter"
                        className="shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{date}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button onClick={closeDropdown} className="w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Цена */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('price')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Цена
            <svg className={`size-4 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'price' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-52 bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {['Бесплатные', 'До 500 ₽', 'До 1000 ₽', 'Премиум'].map((price) => (
                    <label key={price} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{price}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button onClick={closeDropdown} className="w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Кнопка сброса фильтров */}
        <button
          type="button"
          className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          Сбросить
        </button>
      </div>
    </div>
  );
}
