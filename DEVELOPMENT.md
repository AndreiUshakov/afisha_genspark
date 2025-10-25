# 🛠️ Development Guide

Руководство по разработке портала "Афиша Иркутска"

## 🏗️ Архитектура проекта

### Next.js App Router
Проект использует новый App Router (Next.js 13+), который обеспечивает:
- Server Components по умолчанию
- Улучшенную производительность
- Встроенную поддержку загрузки данных
- Автоматическую оптимизацию

### Структура компонентов

#### Server Components (по умолчанию)
Используются для:
- Статического контента
- Загрузки данных с сервера
- SEO-оптимизации

#### Client Components ('use client')
Используются для:
- Интерактивных элементов
- Использования React hooks
- Обработки событий браузера

Примеры:
```typescript
// components/PrelineScript.tsx
'use client';
import { usePathname } from 'next/navigation';
```

## 🎨 Стилизация

### Tailwind CSS
Проект использует Tailwind CSS 4.1 с кастомной конфигурацией.

#### Основные классы:
```css
/* Контейнеры */
.max-w-[85rem] - максимальная ширина контейнера
.px-4 sm:px-6 lg:px-8 - адаптивные отступы

/* Типографика */
.text-2xl font-bold md:text-4xl - адаптивные заголовки
.text-gray-600 dark:text-neutral-400 - цвета с dark mode

/* Кнопки */
.bg-blue-600 hover:bg-blue-700 - основной стиль кнопок
```

### Preline UI
Preline UI предоставляет готовые компоненты:
- Навигация (Header)
- Dropdown меню
- Формы
- Модальные окна
- И другие

#### Инициализация:
```typescript
// components/PrelineScript.tsx
useEffect(() => {
  const loadPreline = async () => {
    await import('preline/preline');
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  };
  loadPreline();
}, [path]);
```

## 📝 Соглашения по коду

### Именование файлов
- Компоненты: `PascalCase.tsx`
- Утилиты: `camelCase.ts`
- Стили: `kebab-case.css`

### Структура компонентов
```typescript
// 1. Импорты
import { useState } from 'react';
import Link from 'next/link';

// 2. Типы/Интерфейсы
interface ComponentProps {
  title: string;
  items: Item[];
}

// 3. Компонент
export default function Component({ title, items }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### TypeScript
Всегда используйте типизацию:
```typescript
// ❌ Плохо
const events = [];

// ✅ Хорошо
interface Event {
  id: number;
  title: string;
  date: string;
}

const events: Event[] = [];
```

## 🔄 Работа с данными

### Временные данные (сейчас)
Данные хранятся в компонентах как константы:
```typescript
const events = [
  {
    id: 1,
    title: 'Event 1',
    // ...
  }
];
```

### Будущая реализация
#### API Routes
```typescript
// app/api/events/route.ts
export async function GET() {
  const events = await fetchEvents();
  return Response.json(events);
}
```

#### Server Actions
```typescript
// lib/actions.ts
'use server';
export async function getEvents() {
  const events = await db.events.findMany();
  return events;
}
```

## 🧩 Ключевые компоненты

### Header (components/layout/Header.tsx)
- Навигационное меню
- Мобильное меню (hs-collapse)
- Ссылки на разделы
- Кнопки входа/регистрации

### Hero (components/layout/Hero.tsx)
- Поисковая форма
- Быстрые ссылки на категории
- Декоративные элементы (SVG)

### EventCard (components/events/EventCard.tsx)
- Отображение информации о мероприятии
- Категория, дата, место, цена
- Hover эффекты

### EventFilters (components/events/EventFilters.tsx)
- Фильтрация по возрасту
- Фильтрация по типу мероприятия
- Фильтрация по формату
- Фильтрация по цене
- Фильтрация по дате

## 🌐 Роутинг

### Основные маршруты:
```
/                    - Главная страница
/events              - Список мероприятий
/events/[id]         - Детальная страница мероприятия
/communities         - Список сообществ
/communities/[id]    - Страница сообщества
/experts             - Список экспертов
/experts/[id]        - Страница эксперта
/blog                - Блог
/blog/[slug]         - Статья блога
/auth/login          - Вход
/auth/register       - Регистрация
```

### Динамические маршруты:
```typescript
// app/events/[id]/page.tsx
export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // Загрузка данных события
}
```

## 🎯 Следующие шаги разработки

### Фаза 1: Базовый функционал (MVP)
- [ ] API для мероприятий
- [ ] База данных (PostgreSQL/MongoDB)
- [ ] Аутентификация (NextAuth.js)
- [ ] Система избранного
- [ ] Подписки на сообщества

### Фаза 2: Личные кабинеты
- [ ] Кабинет пользователя
- [ ] Кабинет сообщества
- [ ] Кабинет эксперта
- [ ] Добавление мероприятий
- [ ] Управление профилем

### Фаза 3: Интеграции
- [ ] Email уведомления
- [ ] Telegram бот
- [ ] Интеграция с соцсетями
- [ ] Яндекс.Карты
- [ ] CRM интеграция

### Фаза 4: Аналитика и SEO
- [ ] Яндекс.Метрика
- [ ] Google Analytics
- [ ] SEO оптимизация
- [ ] Sitemap
- [ ] Robots.txt

## 🐛 Отладка

### Next.js DevTools
```bash
npm run dev -- --turbo  # Включить Turbopack для быстрой разработки
```

### React DevTools
Установите расширение для браузера:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### TypeScript Errors
```bash
npm run type-check  # Проверка типов без сборки
```

## 📚 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Preline UI Documentation](https://preline.co/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 💡 Советы

### Производительность
1. Используйте Server Components где возможно
2. Lazy загрузка тяжелых компонентов
3. Оптимизация изображений через next/image
4. Code splitting через dynamic imports

### SEO
1. Используйте Metadata API
2. Структурированные данные (JSON-LD)
3. Semantic HTML
4. Alt теги для изображений

### Доступность
1. ARIA атрибуты
2. Keyboard navigation
3. Цветовой контраст
4. Screen reader friendly

## 🤝 Contribution Guidelines

1. Создайте feature branch: `git checkout -b feature/amazing-feature`
2. Commit изменения: `git commit -m 'feat: add amazing feature'`
3. Push в branch: `git push origin feature/amazing-feature`
4. Создайте Pull Request

### Commit Convention
```
feat: новая функция
fix: исправление бага
docs: изменения в документации
style: форматирование кода
refactor: рефакторинг
test: добавление тестов
chore: прочие изменения
```

---

**Happy coding! 🚀**
