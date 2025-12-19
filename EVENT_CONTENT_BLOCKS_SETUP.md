# Настройка блоков контента для мероприятий

## Обзор

Реализована система блоков контента для детального описания мероприятий, аналогичная системе для описания сообществ.

## Созданные компоненты

### 1. База данных

**Файл:** [`supabase/migrations/20241219_create_event_content_blocks.sql`](supabase/migrations/20241219_create_event_content_blocks.sql:1)

Создана таблица `event_content_blocks` со следующей структурой:
- `id` - UUID, первичный ключ
- `event_id` - UUID, ссылка на событие (с каскадным удалением)
- `block_type` - тип блока: 'heading', 'text', 'image', 'carousel'
- `content` - JSONB с данными блока
- `position` - целое число для сортировки
- `created_at`, `updated_at` - временные метки

**RLS политики:**
- Владелец сообщества (через событие) может управлять блоками
- Все могут читать блоки опубликованных событий

### 2. Server Actions

**Файл:** [`app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:1)

Реализованы следующие функции:
- [`getEventContentBlocks()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:7) - получение блоков события
- [`createEventContentBlock()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:29) - создание нового блока
- [`updateEventContentBlock()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:76) - обновление блока
- [`deleteEventContentBlock()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:124) - удаление блока
- [`reorderEventContentBlocks()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:166) - изменение порядка блоков
- [`uploadEventBlockImage()`](app/dashboard/community/[slug]/events/[id]/edit/content/actions.ts:228) - загрузка изображений

### 3. Компоненты UI

**Файл:** [`app/dashboard/community/[slug]/events/[id]/edit/content/components/EventContentBuilder.tsx`](app/dashboard/community/[slug]/events/[id]/edit/content/components/EventContentBuilder.tsx:1)

Клиентский компонент для управления блоками контента с возможностями:
- Добавление блоков (heading, text, image, carousel)
- Редактирование содержимого блоков
- Изменение порядка блоков
- Удаление блоков

### 4. Страница редактирования

**Файл:** [`app/dashboard/community/[slug]/events/[id]/edit/content/page.tsx`](app/dashboard/community/[slug]/events/[id]/edit/content/page.tsx:1)

Server-side страница для редактирования контента события с:
- Проверкой прав доступа
- Загрузкой существующих блоков
- Навигацией между разделами редактирования

## Развертывание

### Шаг 1: Применить миграцию базы данных

```bash
npx supabase db push
```

Или вручную выполните SQL из файла [`supabase/migrations/20241219_create_event_content_blocks.sql`](supabase/migrations/20241219_create_event_content_blocks.sql:1) в вашей Supabase базе данных.

### Шаг 2: Проверить типы

Убедитесь, что типы [`ContentBlock`](lib/types/content-blocks.ts) поддерживают все типы блоков, включая 'carousel'.

## Использование

### Доступ к странице

1. Перейдите в управление сообществом
2. Выберите мероприятие
3. Нажмите на карточку "Контент события"

Или напрямую по URL:
```
/dashboard/community/[slug]/events/[id]/edit/content
```

### Типы блоков

#### 1. Заголовок (heading)
```typescript
{
  text: string  // Текст заголовка H2
}
```

#### 2. Текст (text)
```typescript
{
  html: string  // HTML-форматированный текст
}
```

#### 3. Изображение (image)
```typescript
{
  url: string   // URL изображения
  alt: string   // Альтернативный текст
}
```

#### 4. Карусель (carousel)
```typescript
{
  images: Array<{
    url: string
    alt: string
  }>
  slidesPerView: number        // Количество слайдов на десктопе
  slidesPerViewMobile: number  // Количество слайдов на мобильных
}
```

## Связь с существующими компонентами

Блоки контента событий используют те же редакторы блоков, что и блоки сообществ:
- [`HeadingBlockEditor`](app/dashboard/community/[slug]/settings/content/components/HeadingBlockEditor.tsx)
- [`TextBlockEditor`](app/dashboard/community/[slug]/settings/content/components/TextBlockEditor.tsx)
- [`ImageBlockEditor`](app/dashboard/community/[slug]/settings/content/components/ImageBlockEditor.tsx)
- [`CarouselBlockEditor`](app/dashboard/community/[slug]/settings/content/components/CarouselBlockEditor.tsx)

## Загрузка изображений

Изображения загружаются в существующий bucket `community-media` и добавляются в медиагалерею сообщества, что позволяет переиспользовать изображения между событиями одного сообщества.

## Безопасность

- Все операции требуют авторизации
- Проверяется владение сообществом через событие
- RLS политики обеспечивают безопасность на уровне базы данных
- Публичный доступ только к блокам опубликованных событий

## Особенности реализации

1. **Изоляция данных**: Блоки событий хранятся отдельно от блоков сообществ в таблице `event_content_blocks`
2. **Общие компоненты**: Переиспользуются редакторы блоков из системы сообществ
3. **Медиагалерея**: Используется единая медиагалерея сообщества для всех событий
4. **Порядок блоков**: Двухэтапное обновление позиций для избежания конфликтов unique constraint

## Дальнейшие улучшения

Возможные направления развития:
- [ ] Добавление публичной страницы просмотра контента события
- [ ] Предпросмотр контента события перед публикацией
- [ ] Копирование блоков между событиями
- [ ] Шаблоны блоков для быстрого создания
- [ ] Статистика просмотров блоков