'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export default function HorizontalFilters() {
  const [showAllAges, setShowAllAges] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllWishes, setShowAllWishes] = useState(false);
  const [showAllAudience, setShowAllAudience] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  const ages = ['Малыши 0+', 'Младшие школьники 6+', 'Старшие школьники 12+', 'Подростки 16+', 'Взрослые 18+'];
  const types = ['Театр', 'Лекции', 'Мастер-классы', 'Выставки', 'Спорт', 'Семейное', 'Концерты', 'Кино'];
  const prices = ['Бесплатные', 'До 500 ₽', 'До 1000 ₽', 'От 1000+', 'Донат (цена по усмотрению)'];
  const formats = ['Офлайн', 'Онлайн'];
  
  // Преднастроенные периоды
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

  const socialAudience = [
    'Для родителей с детьми',
    'Для школьных классов',
    'Для студентов',
    'Для работающих',
    'Для предпринимателей',
    'Для людей с ОВЗ (ограниченными возможностями здоровья)',
    'Для творческих людей',
    'Для спортсменов',
    'Для пенсионеров',
    'Для волонтёров',
    'Для иностранцев/экспатов',
    'Для религиозных общин',
    'Для профессиональных сообществ',
    'Для молодежных объединений',
    'Для семейных пар',
    'Для одиноких',
    'Для учителей и педагогов',
    'Для общественных организаций',
    'Для безработных',
    'Для многодетных семей',
    'Для военнослужащих и ветеранов',
    'Для туристов и гостей города',
    'Для всех социально активных',
    'Для всех желающих'
  ];

  const visibleAges = showAllAges ? ages : ages.slice(0, 3);
  const visibleTypes = showAllTypes ? types : types.slice(0, 4);
  const visiblePrices = showAllPrices ? prices : prices.slice(0, 3);
  const visibleWishes = showAllWishes ? wishes : wishes.slice(0, 6);
  const visibleAudience = showAllAudience ? socialAudience : socialAudience.slice(0, 6);

  // Закрытие date picker при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const handlePresetClick = (preset: typeof datePresets[0]) => {
    const range = preset.getValue();
    setDateRange(range);
    setSelectedPreset(preset.label);
    setShowDatePicker(false);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setSelectedPreset('');
  };

  const getDateLabel = () => {
    if (selectedPreset) return selectedPreset;
    if (dateRange?.from) {
      if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
        return `${format(dateRange.from, 'd MMM', { locale: ru })} - ${format(dateRange.to, 'd MMM', { locale: ru })}`;
      }
      return format(dateRange.from, 'd MMMM', { locale: ru });
    }
    return 'Выбрать даты';
  };

  const clearDateFilter = () => {
    setDateRange(undefined);
    setSelectedPreset('');
  };

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
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              Дата
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  dateRange?.from || selectedPreset
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-200 text-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20'
                }`}
              >
                <svg className="shrink-0 size-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                {getDateLabel()}
              </button>
              
              {(dateRange?.from || selectedPreset) && (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  className="inline-flex items-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:text-red-600 hover:border-red-600 transition-colors dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-red-400 dark:hover:border-red-500"
                  title="Очистить"
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" x2="6" y1="6" y2="18"/>
                    <line x1="6" x2="18" y1="6" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700"
                style={{ minWidth: '320px' }}
              >
                <div className="p-4">
                  {/* Преднастроенные периоды */}
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
                    <h5 className="text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-2 uppercase">
                      Быстрый выбор
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {datePresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                            selectedPreset === preset.label
                              ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'border-gray-200 text-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Календарь */}
                  <div className="date-picker-container">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      locale={ru}
                      numberOfMonths={1}
                      className="!m-0"
                      classNames={{
                        months: "flex flex-col",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-gray-900 dark:text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-gray-700 dark:text-neutral-300",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-500 dark:text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 dark:[&:has([aria-selected])]:bg-blue-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md",
                        day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-500 dark:hover:bg-blue-500",
                        day_today: "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white",
                        day_outside: "text-gray-400 opacity-50 dark:text-neutral-600",
                        day_disabled: "text-gray-400 opacity-50 dark:text-neutral-600",
                        day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-900 dark:aria-selected:bg-blue-900/20 dark:aria-selected:text-blue-100",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Для кого */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Для кого
          </h4>
          {socialAudience.length > 6 && (
            <button
              onClick={() => setShowAllAudience(!showAllAudience)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {showAllAudience ? 'Скрыть' : `Еще ${socialAudience.length - 6}`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleAudience.map((audience) => (
            <label
              key={audience}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <input
                type="checkbox"
                className="sr-only peer"
              />
              <span className="peer-checked:text-blue-600 peer-checked:font-medium dark:peer-checked:text-blue-400">
                {audience}
              </span>
            </label>
          ))}
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
