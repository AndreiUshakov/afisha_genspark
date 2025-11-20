'use client';

import { useState } from 'react';

export default function HorizontalFilters() {
  const [showAllAges, setShowAllAges] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllWishes, setShowAllWishes] = useState(false);

  const ages = ['Малыши 0+', 'Младшие школьники 6+', 'Старшие школьники 12+', 'Подростки 16+', 'Взрослые 18+'];
  const types = ['Театр', 'Лекции', 'Мастер-классы', 'Выставки', 'Спорт', 'Семейное', 'Концерты', 'Кино'];
  const prices = ['Бесплатные', 'До 500 ₽', 'До 1000 ₽', 'Премиум'];
  const formats = ['Офлайн', 'Онлайн'];
  const dates = ['Сегодня', 'Завтра', 'Выходные', 'Эта неделя', 'Этот месяц'];
  const wishes = [
    'Поиграть',
    'Посмотреть',
    'Учиться',
    'Познакомиться',
    'Удивиться',
    'Вдохновиться',
    'Оттянуться',
    'Поразмышлять',
    'Отдохнуть',
    'Развлечься',
    'Потусоваться',
    'Получить опыт',
    'Проявить себя',
    'Погулять',
    'Почувствовать атмосферу',
    'Творить',
    'Исследовать'
  ];

  const visibleAges = showAllAges ? ages : ages.slice(0, 3);
  const visibleTypes = showAllTypes ? types : types.slice(0, 4);
  const visiblePrices = showAllPrices ? prices : prices.slice(0, 3);
  const visibleWishes = showAllWishes ? wishes : wishes.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 dark:bg-neutral-900 dark:border-neutral-700">
      {/* Я хочу */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Я хочу..
          </h4>
          {wishes.length > 6 && (
            <button
              onClick={() => setShowAllWishes(!showAllWishes)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showAllWishes ? 'Скрыть' : `Еще ${wishes.length - 6}`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleWishes.map((wish) => (
            <label
              key={wish}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                {wish}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Возрастная категория */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Возраст
          </h4>
          {ages.length > 3 && (
            <button
              onClick={() => setShowAllAges(!showAllAges)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showAllAges ? 'Скрыть' : `Еще ${ages.length - 3}`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleAges.map((age) => (
            <label
              key={age}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                {age}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Тип мероприятия */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Тип мероприятия
          </h4>
          {types.length > 4 && (
            <button
              onClick={() => setShowAllTypes(!showAllTypes)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showAllTypes ? 'Скрыть' : `Еще ${types.length - 4}`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleTypes.map((type) => (
            <label
              key={type}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Формат и Дата в одной строке */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Формат */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              Формат
            </h4>
            <div className="flex flex-wrap gap-2">
              {formats.map((format) => (
                <label
                  key={format}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                >
                  <input
                    type="radio"
                    name="format"
                    className="sr-only peer"
                  />
                  <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                    {format}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Дата */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              Дата
            </h4>
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => (
                <label
                  key={date}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                >
                  <input
                    type="radio"
                    name="date"
                    className="sr-only peer"
                  />
                  <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                    {date}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Цена */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Цена
          </h4>
          {prices.length > 3 && (
            <button
              onClick={() => setShowAllPrices(!showAllPrices)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showAllPrices ? 'Скрыть' : `Еще ${prices.length - 3}`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visiblePrices.map((price) => (
            <label
              key={price}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-neutral-700">
        <button
          type="button"
          className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" x2="10" y1="11" y2="17"/>
            <line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
          Сбросить все
        </button>
        <button
          type="button"
          className="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors"
        >
          Применить фильтры
        </button>
      </div>
    </div>
  );
}
