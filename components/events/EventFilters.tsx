'use client';

export default function EventFilters() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-700">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
        Фильтры
      </h3>

      {/* Возрастная категория */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Возрастная категория
        </h4>
        <div className="space-y-2">
          {['Дети 0-6', 'Школьники 7-12', 'Подростки 13-17', 'Взрослые', '55+'].map((age) => (
            <label key={age} className="flex items-center">
              <input
                type="checkbox"
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-600 ms-3 dark:text-neutral-400">{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Тип мероприятия */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Тип мероприятия
        </h4>
        <div className="space-y-2">
          {['Театр', 'Лекции', 'Мастер-классы', 'Выставки', 'Спорт', 'Семейное'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-600 ms-3 dark:text-neutral-400">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Формат */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Формат
        </h4>
        <div className="space-y-2">
          {['Офлайн', 'Онлайн'].map((format) => (
            <label key={format} className="flex items-center">
              <input
                type="radio"
                name="format"
                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-600 ms-3 dark:text-neutral-400">{format}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Цена
        </h4>
        <div className="space-y-2">
          {['Бесплатные', 'До 500 ₽', 'До 1000 ₽', 'Премиум'].map((price) => (
            <label key={price} className="flex items-center">
              <input
                type="checkbox"
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-600 ms-3 dark:text-neutral-400">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Дата */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
          Дата
        </h4>
        <div className="space-y-2">
          {['Сегодня', 'Завтра', 'Выходные', 'Эта неделя', 'Этот месяц'].map((date) => (
            <label key={date} className="flex items-center">
              <input
                type="radio"
                name="date"
                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-600 ms-3 dark:text-neutral-400">{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-2">
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          Сбросить
        </button>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Применить
        </button>
      </div>
    </div>
  );
}
