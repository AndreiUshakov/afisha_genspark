'use client';

import React, { useEffect } from 'react';
import { Step1FormData } from '@/types/community';
import { FILTER_OPTIONS } from '@/types/community';
import { FilterSelector } from './FilterSelector';
import { generateSlug } from '@/utils/slug';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Step1BasicInfoProps {
  formData: Step1FormData;
  onChange: (data: Partial<Step1FormData>) => void;
  errors?: Partial<Record<keyof Step1FormData, string>>;
  categories: Category[];
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  onChange,
  errors = {},
  categories
}) => {
  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      onChange({ slug: generateSlug(formData.name) });
    }
  }, [formData.name, formData.slug, onChange]);

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Основная информация
        </h2>
        
        <div className="space-y-5">
          {/* Название */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Название сообщества *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
              placeholder="Например: Клуб любителей театра"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              URL-адрес *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-sm">
                адрес_сайта/community/
              </span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className={`flex-1 px-4 py-3 rounded-r-lg border ${
                  errors.slug 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                placeholder="teatr-club"
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.slug}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              Только латинские буквы, цифры и дефисы
            </p>
          </div>

          {/* Категория */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Категория *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.category 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Краткое описание */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Краткое описание *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              maxLength={200}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none`}
              placeholder="Короткое описание вашего сообщества (до 200 символов)"
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              {formData.description.length}/200 символов
            </p>
          </div>
        </div>
      </div>

      {/* Фильтры аудитории */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Фильтры и аудитория
        </h2>
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Это типовые настройки по умолчанию для всех мероприятий. При создании конкретного мероприятия вы сможете установить индивидуальные настройки для каждого события.
            </p>
          </div>
        </div>
        
        <div className="space-y-5">
          <FilterSelector
            label="Для кого"
            options={FILTER_OPTIONS.TARGET_AUDIENCE}
            selected={formData.target_audience}
            onChange={(selected) => onChange({ target_audience: selected })}
            placeholder="Поиск по аудитории..."
          />

          <FilterSelector
            label="Я хочу"
            options={FILTER_OPTIONS.WISHES}
            selected={formData.wishes}
            onChange={(selected) => onChange({ wishes: selected })}
            placeholder="Поиск по целям..."
          />

          <FilterSelector
            label="Возрастные категории"
            options={FILTER_OPTIONS.AGE_CATEGORIES}
            selected={formData.age_categories}
            onChange={(selected) => onChange({ age_categories: selected })}
            placeholder="Поиск по возрасту..."
            searchable={false}
          />
        </div>
      </div>

      {/* Локация и контакты */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Локация и контакты
        </h2>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Адрес/Район
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="Например: Центральный район, ул. Ленина 1"
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Email для связи *
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) => onChange({ contact_email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.contact_email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
              placeholder="community@example.com"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.contact_email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              id="contact_phone"
              value={formData.contact_phone || ''}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0 && !value.startsWith('7')) {
                  value = '7' + value;
                }
                if (value.length > 11) {
                  value = value.slice(0, 11);
                }
                let formatted = '+7';
                if (value.length > 1) {
                  formatted += ' ' + value.slice(1, 4);
                }
                if (value.length > 4) {
                  formatted += ' ' + value.slice(4, 7);
                }
                if (value.length > 7) {
                  formatted += ' ' + value.slice(7, 9);
                }
                if (value.length > 9) {
                  formatted += ' ' + value.slice(9, 11);
                }
                onChange({ contact_phone: formatted });
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.contact_phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
              placeholder="+7 999 123 45 67"
            />
            {errors.contact_phone && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.contact_phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Социальные сети */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Социальные сети
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600 dark:text-neutral-400">VK</span>
            <input
              type="url"
              value={formData.social_links.vk || ''}
              onChange={(e) => onChange({ 
                social_links: { ...formData.social_links, vk: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="https://vk.com/your-community"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600 dark:text-neutral-400">Telegram</span>
            <input
              type="url"
              value={formData.social_links.telegram || ''}
              onChange={(e) => onChange({
                social_links: { ...formData.social_links, telegram: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="https://t.me/your-channel"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600 dark:text-neutral-400">MAX</span>
            <input
              type="url"
              value={formData.social_links.max || ''}
              onChange={(e) => onChange({
                social_links: { ...formData.social_links, max: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="https://max.ru/your-page"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600 dark:text-neutral-400">Website</span>
            <input
              type="url"
              value={formData.social_links.website || ''}
              onChange={(e) => onChange({
                social_links: { ...formData.social_links, website: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="https://your-website.com"
            />
          </div>

        </div>
      </div>
    </div>
  );
};