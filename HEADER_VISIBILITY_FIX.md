# Исправление проблемы скрытия Header при переходах между layouts

## Проблема

Header компонент часто пропадал или отображался некорректно при переходах между различными layouts, особенно при навигации из личного кабинета (`/dashboard`) на основной сайт и обратно.

## Причины

1. **Server-side vs Client-side рендеринг**: `ConditionalHeader` был серверным компонентом, который полагался на `pathname` из headers через middleware
2. **Отсутствие реактивности**: При client-side навигации (через Next.js Link) значение `pathname` не обновлялось
3. **Layout кэширование**: Next.js 13+ не пере-рендерит root layout при навигации, что приводило к устаревшему состоянию
4. **Конфликт Server/Client компонентов**: Header - это async серверный компонент, который не может быть напрямую вызван из клиентского компонента

## Решение

### Паттерн "Server Component обернутый в Client Wrapper"

Используем архитектуру из двух компонентов:
1. **HeaderWrapper** (Client Component) - отслеживает pathname и условно рендерит children
2. **Header** (Server Component) - остается async для получения данных пользователя

### 1. Создали HeaderWrapper (Client Component)

**Файл**: `components/layout/HeaderWrapper.tsx`

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface HeaderWrapperProps {
  children: ReactNode;
}

export default function HeaderWrapper({ children }: HeaderWrapperProps) {
  const pathname = usePathname();
  
  // Не показываем header на страницах dashboard и admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }
  
  return <>{children}</>;
}
```

**Особенности**:
- Client Component с директивой `'use client'`
- Использует `usePathname()` для отслеживания маршрута
- Принимает children (Server Component) и условно их рендерит
- Реагирует на изменения URL в реальном времени

### 2. Обновили ConditionalHeader

**Файл**: `components/layout/ConditionalHeader.tsx`

```tsx
import Header from './Header';
import HeaderWrapper from './HeaderWrapper';

export default async function ConditionalHeader() {
  return (
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
  );
}
```

**Изменения**:
- Остался async Server Component
- Оборачивает Header в HeaderWrapper
- Header продолжает работать как async для получения данных пользователя
- HeaderWrapper управляет видимостью на основе pathname

### 3. Упростили Root Layout

**Файл**: `app/layout.tsx`

**Удалено**:
- Import `headers` from 'next/headers'
- Async функция
- Получение pathname из headers
- Передача pathname как prop

**Результат**:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <ClientProviders>
          <ConditionalHeader />
          {/* ... */}
        </ClientProviders>
      </body>
    </html>
  );
}
```

### 4. Очистили Middleware

**Файл**: `middleware.ts`

Убрали ненужную логику добавления `x-pathname` в headers.

## Архитектура решения

```
RootLayout (Server Component)
  └─> ConditionalHeader (Server Component - async)
       └─> HeaderWrapper (Client Component - usePathname)
            └─> Header (Server Component - async, Supabase auth)
```

**Преимущества этой архитектуры**:
1. Header остается Server Component для async операций (Supabase)
2. HeaderWrapper как Client Component отслеживает изменения маршрута
3. Разделение ответственности: логика видимости отделена от логики данных
4. Совместимость с Next.js App Router паттернами

## Преимущества решения

1. ✅ **Реактивность**: Header автоматически показывается/скрывается при навигации
2. ✅ **Async поддержка**: Header может использовать Supabase и другие async операции
3. ✅ **Производительность**: Server Component кэшируется, Client Component управляет видимостью
4. ✅ **Надежность**: Работает при server-side и client-side навигации
5. ✅ **Простота**: Четкое разделение ответственности
6. ✅ **Совместимость**: Следует рекомендациям Next.js для Server/Client Components

## Тестирование

Проверьте следующие сценарии:

1. ✅ Переход с главной страницы (`/`) в dashboard (`/dashboard`)
2. ✅ Переход из dashboard обратно на главную
3. ✅ Переход из dashboard в admin (`/admin`)
4. ✅ Переход с любой страницы основного сайта в личный кабинет
5. ✅ Прямой переход по URL (не через Link)
6. ✅ Использование кнопки "Назад" в браузере
7. ✅ Аутентификация пользователя (async Supabase операции)

## Связанные файлы

- `components/layout/HeaderWrapper.tsx` - создан ✅ (Client Component)
- `components/layout/ConditionalHeader.tsx` - обновлен ✅ (Server Component)
- `components/layout/Header.tsx` - без изменений ✅ (Server Component)
- `components/layout/ConditionalFooter.tsx` - уже был корректным ✅
- `app/layout.tsx` - упрощен ✅
- `middleware.ts` - очищен ✅

## Примечания

- Этот паттерн (Server Component в Client Wrapper) рекомендуется Next.js для таких случаев
- Header остается Server Component для получения данных пользователя через Supabase
- HeaderWrapper - единственный Client Component в цепочке, управляющий видимостью
- ConditionalFooter использует похожий подход напрямую как Client Component (так как Footer не async)