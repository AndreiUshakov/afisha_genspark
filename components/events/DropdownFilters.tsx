'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export default function DropdownFilters() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const datePickerRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Закрытие date picker при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        if (openDropdown === 'date') {
          closeDropdown();
        }
      }
    };

    if (openDropdown === 'date') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handlePresetClick = (preset: typeof datePresets[0]) => {
    const range = preset.getValue();
    setDateRange(range);
    setSelectedPreset(preset.label);
    closeDropdown();
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
    return 'Дата';
  };

  const clearDateFilter = () => {
    setDateRange(undefined);
    setSelectedPreset('');
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Я хочу */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('wishes')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Я хочу..
            <svg className={`size-4 transition-transform ${openDropdown === 'wishes' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'wishes' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-60 max-h-96 overflow-y-auto bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {wishes.map((wish) => (
                    <label key={wish} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{wish}</span>
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
                  {['Малыши 0+', 'Младшие школьники 6+', 'Старшие школьники 12+', 'Подростки 16+', 'Взрослые 18+'].map((age) => (
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
                  {['Офлайн', 'Онлайн'].map((format) => (
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
            className={`py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border transition-colors ${
              dateRange?.from || selectedPreset
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            {getDateLabel()}
            <svg className={`size-4 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'date' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div
                ref={datePickerRef}
                className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-xl p-4 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                style={{ minWidth: '320px' }}
              >
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

                {/* Кнопки действий */}
                <div className="flex gap-2 pt-3 mt-3 border-t border-gray-200 dark:border-neutral-700">
                  {(dateRange?.from || selectedPreset) && (
                    <button
                      type="button"
                      onClick={clearDateFilter}
                      className="flex-1 py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      Очистить
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeDropdown}
                    className="flex-1 py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Для кого */}
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => toggleDropdown('audience')}
            className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Для кого
            <svg className={`size-4 transition-transform ${openDropdown === 'audience' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {openDropdown === 'audience' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
              <div className="absolute top-full left-0 mt-2 min-w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-xl p-3 z-50 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <div className="space-y-2">
                  {socialAudience.map((audience) => (
                    <label key={audience} className="flex items-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600"
                      />
                      <span className="text-sm text-gray-700 ms-3 dark:text-neutral-300">{audience}</span>
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
                  {['Бесплатные', 'До 500 ₽', 'До 1000 ₽', 'От 1000+', 'Донат (цена по усмотрению)'].map((price) => (
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
