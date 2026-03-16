# Быстрое исправление ошибок сборки

## Проблема
```
Error: Dynamic server usage: Route /admin/communities couldn't be rendered statically because it used `cookies`
```

## Решение (2 шага)

### Шаг 1: Обновить зависимости
```bash
npm install baseline-browser-mapping@latest -D
```

### Шаг 2: Добавить force-dynamic в layouts

#### В [`app/admin/layout.tsx`](app/admin/layout.tsx) (ОБЯЗАТЕЛЬНО)
Добавьте в начало файла после импортов:
```typescript
export const dynamic = 'force-dynamic';
```

#### В [`app/dashboard/layout.tsx`](app/dashboard/layout.tsx) (РЕКОМЕНДУЕТСЯ)
Добавьте в начало файла после импортов:
```typescript
export const dynamic = 'force-dynamic';
```

### Шаг 3: Проверить сборку
```bash
npm run build
```

## Что это делает?

`export const dynamic = 'force-dynamic'` говорит Next.js:
- Не пытайся статически генерировать эти страницы во время сборки
- Всегда рендери их динамически на сервере при каждом запросе
- Это позволяет использовать `cookies()`, `headers()` и другие динамические API

## Почему это нужно?

Админ-панель и dashboard используют:
- `cookies()` для аутентификации через Supabase
- `createClient()` который требует доступ к cookies
- Динамические данные пользователя

Next.js по умолчанию пытается статически сгенерировать все страницы, но это невозможно для страниц с аутентификацией.

## Подробный план

См. [`plans/BUILD_ERRORS_FIX.md`](plans/BUILD_ERRORS_FIX.md) для детального анализа и диаграмм.

## Переключение в Code mode

Для применения изменений переключитесь в Code mode и выполните исправления.
