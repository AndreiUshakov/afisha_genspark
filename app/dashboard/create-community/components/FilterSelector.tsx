'use client';

import React, { useState, useMemo } from 'react';

interface FilterSelectorProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  searchable?: boolean;
  maxHeight?: string;
  placeholder?: string;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  label,
  options,
  selected,
  onChange,
  searchable = true,
  maxHeight = '300px',
  placeholder = 'Поиск...'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemoveTag = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
        {label}
      </label>

      {/* Selected Tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(item => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => handleRemoveTag(item)}
                className="hover:text-emerald-900 dark:hover:text-emerald-100"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 text-left border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        >
          <span className="text-gray-600 dark:text-neutral-400">
            {selected.length > 0 ? `Выбрано: ${selected.length}` : 'Выберите опции'}
          </span>
        </button>

        {isExpanded && (
          <div className="absolute z-10 mt-2 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg">
            {searchable && (
              <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="overflow-y-auto p-2" style={{ maxHeight }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <label
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-neutral-300">
                      {option}
                    </span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-neutral-500">
                  Ничего не найдено
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  setIsExpanded(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                Очистить
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Готово
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};