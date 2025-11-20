# TypeScript интерфейсы и примеры кода

## 📦 Типы данных

### Файл: `types/community.ts`

```typescript
/**
 * Типы для расширенной модели сообщества
 */

/**
 * Социальные ссылки сообщества (без Instagram)
 */
export interface SocialLinks {
  vk?: string;
  telegram?: string;
  website?: string;
  facebook?: string;
}

/**
 * Фотография в альбоме
 */
export interface Photo {
  id: string;
  url: string;
  thumbnail_url: string;
  caption?: string;
  order: number;
  uploaded_at: string;
}

/**
 * Альбом фотографий
 */
export interface PhotoAlbum {
  id: string;
  title: string;
  description?: string;
  photos: Photo[];
  cover_photo_id?: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean; // показывать на главной странице
}

/**
 * Расширенная модель сообщества
 */
export interface Community {
  // Базовые поля
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string; // краткое описание (до 200 символов)
  
  // Визуальные элементы
  avatar_url: string;
  cover_url: string;
  
  // Категоризация
  category_id: string;
  category_name?: string;
  
  // Статистика
  members_count: number;
  
  // Контактная информация
  location: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  social_links?: SocialLinks;
  
  // Новые поля для расширенного функционала
  full_description?: string; // WYSIWYG контент (HTML)
  target_audience?: string[]; // "для кого" - массив выбранных опций
  wishes?: string[]; // "я хочу" - массив выбранных опций
  age_categories?: string[]; // возрастные категории
  
  // Контент страницы
  page_content?: string; // JSON сериализованный CraftJS контент
  photo_albums?: PhotoAlbum[]; // альбомы фотографий
  
  // Статусы
  is_verified: boolean;
  is_published: boolean;
  draft_step?: 1 | 2; // текущий шаг черновика
  
  // Временные метки
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * Данные формы для Шага 1
 */
export interface Step1FormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  full_description: string;
  target_audience: string[];
  wishes: string[];
  age_categories: string[];
  location: string;
  contact_email: string;
  contact_phone?: string;
  social_links: SocialLinks;
}

/**
 * Данные формы для Шага 2
 */
export interface Step2FormData {
  cover_image: File | null;
  logo_image: File | null;
  page_content: string; // CraftJS JSON
  photo_albums: PhotoAlbum[];
}

/**
 * Полные данные формы создания сообщества
 */
export interface CreateCommunityFormData extends Step1FormData, Step2FormData {
  current_step: 1 | 2;
}

/**
 * Опции для фильтров
 */
export const FILTER_OPTIONS = {
  // "Для кого" - социальная аудитория
  TARGET_AUDIENCE: [
    'Для родителей с детьми',
    'Для школьных классов',
    'Для студентов',
    'Для работающих',
    'Для предпринимателей',
    'Для людей с ОВЗ',
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
  ],
  
  // "Я хочу" - желания/цели
  WISHES: [
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
  ],
  
  // Возрастные категории
  AGE_CATEGORIES: [
    'Малыши 0+',
    'Младшие школьники 6+',
    'Старшие школьники 12+',
    'Подростки 16+',
    'Взрослые 18+'
  ],
  
  // Категории сообществ
  CATEGORIES: [
    { id: 'cat-culture', name: 'Культура и искусство' },
    { id: 'cat-sport', name: 'Спорт и здоровье' },
    { id: 'cat-education', name: 'Образование' },
    { id: 'cat-hobby', name: 'Хобби и увлечения' },
    { id: 'cat-business', name: 'Бизнес и карьера' },
    { id: 'cat-social', name: 'Социальные проекты' },
    { id: 'cat-tech', name: 'Технологии' },
    { id: 'cat-family', name: 'Семья и дети' },
    { id: 'cat-ecology', name: 'Экология' },
    { id: 'cat-other', name: 'Другое' }
  ]
} as const;
```

---

## 🎨 Примеры компонентов

### 1. StepIndicator Component

**Файл:** `app/dashboard/create-community/components/StepIndicator.tsx`

```typescript
'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: 1 | 2;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps = [
    { number: 1, title: 'Базовая информация', description: 'Название, категория, фильтры' },
    { number: 2, title: 'Визуальное оформление', description: 'Дизайн и контент страницы' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <button
                onClick={() => {
                  if (completedSteps.includes(step.number) || step.number === currentStep) {
                    onStepClick(step.number);
                  }
                }}
                disabled={!completedSteps.includes(step.number) && step.number !== currentStep}
                className={`flex items-center gap-4 ${
                  completedSteps.includes(step.number) || step.number === currentStep
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                    step.number === currentStep
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900'
                      : completedSteps.includes(step.number)
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'bg-gray-200 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400'
                  }`}
                >
                  {completedSteps.includes(step.number) ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                
                <div className="text-left">
                  <div className={`font-semibold ${
                    step.number === currentStep
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-neutral-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-500">
                    {step.description}
                  </div>
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-1 rounded-full transition-all ${
                    completedSteps.includes(step.number)
                      ? 'bg-emerald-600'
                      : 'bg-gray-200 dark:bg-neutral-700'
                  }`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

### 2. FilterSelector Component

**Файл:** `app/dashboard/create-community/components/FilterSelector.tsx`

```typescript
'use client';

import React, { useState, useMemo } from 'react';

interface FilterSelectorProps {
  label: string;
  options: string[];
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
```

---

### 3. WYSIWYGEditor Component (TipTap)

**Файл:** `app/dashboard/create-community/components/WYSIWYGEditor.tsx`

```typescript
'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  content,
  onChange,
  placeholder = 'Расскажите о вашем сообществе...',
  minHeight = '300px'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ 
    onClick, 
    isActive, 
    children 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 ${
        isActive ? 'bg-gray-200 dark:bg-neutral-600' : ''
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-neutral-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <strong>B</strong>
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <em>I</em>
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          H2
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          H3
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          • List
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          1. List
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
        >
          🔗 Link
        </MenuButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4"
        style={{ minHeight }}
      />
    </div>
  );
};
```

---

### 4. AdvertisementBlock Component

**Файл:** `app/dashboard/create-community/components/AdvertisementBlock.tsx`

```typescript
'use client';

import React from 'react';

type AdType = 'landing' | 'radio';

interface AdvertisementBlockProps {
  type: AdType;
  className?: string;
}

export const AdvertisementBlock: React.FC<AdvertisementBlockProps> = ({
  type,
  className = ''
}) => {
  if (type === 'landing') {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white ${className}`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Хочешь красивый лендинг для своего проекта?
            </h3>
            <p className="text-sm opacity-90">
              Обращайся к нам! Создадим уникальный дизайн.
            </p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
            Узнать подробнее →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl flex-shrink-0">📻</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            Продвижение сообщества на Иркутском радио!
          </h3>
          <p className="text-sm opacity-90">
            Расскажи о своих событиях тысячам слушателей.
          </p>
        </div>
        <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
          Заказать эфир →
        </button>
      </div>
    </div>
  );
};
```

---

## 🔧 Утилиты и хелперы

### Файл: `utils/slug.ts`

```typescript
/**
 * Генерация slug из названия
 */
export function generateSlug(name: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return name
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Валидация slug
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
```

### Файл: `utils/validation.ts`

```typescript
import { Step1FormData } from '@/types/community';

/**
 * Валидация данных Шага 1
 */
export function validateStep1(data: Step1FormData): {
  isValid: boolean;
  errors: Partial<Record<keyof Step1FormData, string>>;
} {
  const errors: Partial<Record<keyof Step1FormData, string>> = {};

  // Название
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Название должно содержать минимум 3 символа';
  }

  // Slug
  if (!data.slug) {
    errors.slug = 'URL-адрес обязателен';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = 'URL может содержать только латинские буквы, цифры и дефисы';
  }

  // Категория
  if (!data.category) {
    errors.category = 'Выберите категорию';
  }

  // Описание
  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Описание должно содержать минимум 20 символов';
  } else if (data.description.length > 200) {
    errors.description = 'Описание не должно превышать 200 символов';
  }

  // Email
  if (!data.contact_email) {
    errors.contact_email = 'Email обязателен';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.contact_email = 'Некорректный формат email';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

---

## 📱 Адаптивные стили

### Tailwind конфигурация для компонентов

```typescript
// Примеры адаптивных классов

// Контейнер шагов
<div className="
  px-4 sm:px-6 lg:px-8
  py-4 sm:py-6
  max-w-7xl mx-auto
">

// Сетка форм
<div className="
  grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6
">

// Кнопки навигации
<div className="
  flex flex-col sm:flex-row gap-3
  justify-between items-stretch sm:items-center
">

// Рекламные блоки
<div className="
  flex flex-col sm:flex-row items-start sm:items-center gap-4
  p-4 sm:p-6
">
```

---

## 🎯 Следующие шаги для разработчика

1. **Установить зависимости:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
npm install react-image-crop swiper react-dropzone
```

2. **Создать структуру файлов** согласно документации

3. **Реализовать компоненты** поэтапно:
   - Начать с StepIndicator
   - Затем FilterSelector
   - Потом WYSIWYGEditor
   - И так далее

4. **Тестировать** каждый компонент отдельно

5. **Интегрировать** в основную страницу создания сообщества

---

**Дата создания:** 2025-11-20  
**Версия:** 1.0