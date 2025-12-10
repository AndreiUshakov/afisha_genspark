# Реализация функционала избранного

Этот документ описывает реализацию системы избранных мероприятий в приложении.

## Обзор

Система избранного позволяет зарегистрированным пользователям:
- Добавлять мероприятия в избранное
- Удалять мероприятия из избранного
- Просматривать список избранных мероприятий
- Видеть статус избранного на карточках мероприятий

Незарегистрированные пользователи при попытке добавить в избранное перенаправляются на страницу входа.

## Структура базы данных

### Таблица `favorites`

Таблица `favorites` поддерживает избранное для трех типов сущностей: мероприятий, сообществ и экспертов.

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT favorite_one_type CHECK (
    (event_id IS NOT NULL AND community_id IS NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NOT NULL AND expert_id IS NULL) OR
    (event_id IS NULL AND community_id IS NULL AND expert_id IS NOT NULL)
  ),
  
  CONSTRAINT unique_favorite UNIQUE (user_id, event_id, community_id, expert_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_event ON favorites(event_id);
CREATE INDEX IF NOT EXISTS idx_favorites_community ON favorites(community_id);
CREATE INDEX IF NOT EXISTS idx_favorites_expert ON favorites(expert_id);
```

**Важные особенности:**

1. **Constraint `favorite_one_type`** - гарантирует, что запись относится только к одному типу сущности
2. **Поля `community_id` и `expert_id`** - автоматически заполняются при добавлении события в избранное:
   - `community_id` - берется из поля `community_id` таблицы `events`
   - `expert_id` - определяется, если организатор события - эксперт
3. **Аналитика** - эти поля позволяют сообществам и экспертам видеть, сколько пользователей добавили их события в избранное

### Row Level Security (RLS)

Политики безопасности обеспечивают:
- Пользователи видят только свои избранные
- Пользователи могут добавлять только в свое избранное
- Пользователи могут удалять только из своего избранного

```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Пользователи видят только свое избранное" ON favorites;
CREATE POLICY "Пользователи видят только свое избранное" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут добавлять в избранное" ON favorites;
CREATE POLICY "Пользователи могут добавлять в избранное" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Пользователи могут удалять из избранного" ON favorites;
CREATE POLICY "Пользователи могут удалять из избранного" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

## Server Actions

Файл: [`app/actions/favorites.ts`](../app/actions/favorites.ts)

### Интерфейсы

```typescript
export interface Favorite {
  id: string
  user_id: string
  event_id: string | null
  community_id: string | null
  expert_id: string | null
  created_at: string
}
```

### Функции

#### `addToFavorites(eventId: string)`

Добавляет мероприятие в избранное текущего пользователя. Автоматически определяет и сохраняет `community_id` и `expert_id` из данных события.

**Параметры:**
- `eventId` - ID мероприятия

**Возвращает:**
```typescript
{
  success: boolean
  error?: string
  requiresAuth?: boolean
  data?: Favorite
}
```

**Логика определения `expert_id`:**
1. Проверяется поле `organizer_type` события
2. Если `organizer_type` = 'expert' или 'individual', ищется профиль эксперта по `organizer_id`
3. Если найден, `expert_id` сохраняется в таблицу `favorites`

**Пример использования:**
```typescript
const result = await addToFavorites('event-123')
if (result.success) {
  console.log('Добавлено в избранное')
  // В БД сохранено: event_id, community_id (если есть), expert_id (если есть)
} else if (result.requiresAuth) {
  router.push('/auth/login')
}
```

#### `removeFromFavorites(eventId: string)`

Удаляет мероприятие из избранного текущего пользователя.

**Параметры:**
- `eventId` - ID мероприятия

**Возвращает:**
```typescript
{
  success: boolean
  error?: string
  requiresAuth?: boolean
}
```

**Пример использования:**
```typescript
const result = await removeFromFavorites('event-123')
if (result.success) {
  console.log('Удалено из избранного')
}
```

#### `checkIsFavorite(eventId: string)`

Проверяет, находится ли мероприятие в избранном текущего пользователя.

**Параметры:**
- `eventId` - ID мероприятия

**Возвращает:** `boolean`

**Пример использования:**
```typescript
const isFavorited = await checkIsFavorite('event-123')
console.log(isFavorited ? 'В избранном' : 'Не в избранном')
```

#### `getUserFavorites()`

Получает все избранные мероприятия текущего пользователя с полными данными о событиях через JOIN.

**Возвращает:**
```typescript
{
  success: boolean
  error?: string
  requiresAuth?: boolean
  favorites: Array<{
    id: string
    event_id: string
    community_id: string | null
    expert_id: string | null
    created_at: string
    events: {
      id: string
      title: string
      slug: string
      description: string
      cover_image_url: string
      start_date: string
      end_date: string
      location_type: string
      venue_name: string
      venue_address: string
      is_free: boolean
      price_min: number
      price_max: number
      organizer_name: string
      organizer_avatar: string
      tags: string[]
      is_published: boolean
    }
  }>
}
```

**Пример использования:**
```typescript
const { favorites } = await getUserFavorites()
console.log(`У пользователя ${favorites.length} избранных`)

// Доступ к данным события
favorites.forEach(fav => {
  console.log(fav.events.title)
  console.log('Организовано сообществом:', fav.community_id)
  console.log('Организовано экспертом:', fav.expert_id)
})
```

#### `toggleFavorite(eventId: string)`

Переключает статус избранного (добавляет, если не в избранном, удаляет, если в избранном).

**Параметры:**
- `eventId` - ID мероприятия

**Возвращает:** Результат `addToFavorites` или `removeFromFavorites`

**Пример использования:**
```typescript
const result = await toggleFavorite('event-123')
```

## Компоненты

### FavoriteButton

Файл: [`components/events/FavoriteButton.tsx`](../components/events/FavoriteButton.tsx)

Клиентский компонент кнопки избранного.

**Props:**
```typescript
interface FavoriteButtonProps {
  eventId: string
  initialFavorited?: boolean
  variant?: 'default' | 'compact'
  className?: string
}
```

**Варианты отображения:**
- `default` - полноразмерная кнопка с текстом
- `compact` - только иконка (для карточек)

**Пример использования:**
```typescript
<FavoriteButton 
  eventId="event-123"
  initialFavorited={false}
  variant="compact"
/>
```

### Интеграция в страницы

#### Главная страница и список мероприятий

Файлы: [`app/page.tsx`](../app/page.tsx), [`app/events/page.tsx`](../app/events/page.tsx)

```typescript
// Получаем избранные пользователя
const { favorites } = await getUserFavorites()
const favoriteIds = new Set(favorites.map(f => f.event_id))

// Передаем в EventCard
<EventCard 
  event={event} 
  isFavorited={favoriteIds.has(event.id)} 
/>
```

#### Детальная страница мероприятия

Файл: [`app/events/[slug]/page.tsx`](../app/events/[slug]/page.tsx)

```typescript
const isFavorited = await checkIsFavorite(event.id)

<EventActions 
  event={event}
  isFavorited={isFavorited}
/>
```

#### Страница избранного

Файл: [`app/dashboard/favorites/page.tsx`](../app/dashboard/favorites/page.tsx)

- Требует аутентификации (редирект на `/auth/login`)
- Загружает избранные из БД с JOIN к таблице events
- Отображает карточки мероприятий
- Показывает пустое состояние, если нет избранных

## Настройка

### 1. Проверка схемы БД

Убедитесь, что таблица `favorites` создана в вашей БД Supabase. Схема находится в файле [`supabase/schema.sql`](../supabase/schema.sql) (строки 418-458).

Если таблица не создана, выполните соответствующую часть SQL-скрипта в Supabase Dashboard.

### 2. Проверка переменных окружения

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Перезапуск приложения

```bash
npm run dev
```

## Тестирование

### Сценарий 1: Неавторизованный пользователь

1. Откройте главную страницу
2. Найдите мероприятие
3. Нажмите на ❤️
4. **Ожидается:** Перенаправление на `/auth/login`

### Сценарий 2: Авторизованный пользователь

1. Войдите в систему
2. Откройте страницу мероприятия
3. Нажмите на ❤️
4. **Ожидается:** Иконка заполняется красным
5. Откройте `/dashboard/favorites`
6. **Ожидается:** Мероприятие отображается в списке
7. Нажмите ❤️ снова
8. **Ожидается:** Мероприятие удаляется из избранного

## Аналитика и статистика

### Количество добавлений в избранное по мероприятию

```sql
SELECT 
  e.title,
  COUNT(f.id) as favorites_count
FROM events e
LEFT JOIN favorites f ON e.id = f.event_id
GROUP BY e.id, e.title
ORDER BY favorites_count DESC;
```

### Самые популярные мероприятия

```sql
SELECT 
  e.title,
  e.slug,
  COUNT(f.id) as favorites_count
FROM events e
INNER JOIN favorites f ON e.id = f.event_id
GROUP BY e.id, e.title, e.slug
ORDER BY favorites_count DESC
LIMIT 10;
```

### Статистика для сообщества

Сколько раз события сообщества добавлены в избранное:

```sql
SELECT 
  c.name as community_name,
  COUNT(DISTINCT f.id) as total_favorites,
  COUNT(DISTINCT f.user_id) as unique_users
FROM communities c
INNER JOIN favorites f ON c.id = f.community_id
WHERE c.id = 'community-uuid'
GROUP BY c.id, c.name;
```

### Статистика для эксперта

Сколько раз события эксперта добавлены в избранное:

```sql
SELECT 
  ex.name as expert_name,
  COUNT(DISTINCT f.id) as total_favorites,
  COUNT(DISTINCT f.user_id) as unique_users
FROM experts ex
INNER JOIN favorites f ON ex.id = f.expert_id
WHERE ex.id = 'expert-uuid'
GROUP BY ex.id, ex.name;
```

## Troubleshooting

### Ошибка: "Missing Supabase environment variables"

**Решение:** Проверьте `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Ошибка: "relation favorites does not exist"

**Решение:** Проверьте, что таблица `favorites` создана в Supabase. Выполните SQL из `supabase/schema.sql`.

### Кнопка не работает

**Проверьте:**
1. Консоль браузера на ошибки
2. Network tab - успешность запросов
3. Supabase Dashboard - логи

### Избранные не сохраняются

**Проверьте:**
1. RLS политики включены
2. Пользователь авторизован
3. `event_id` корректный

## Заключение

Функционал избранного полностью интегрирован и готов к использованию. Система поддерживает:
- ✅ Добавление/удаление мероприятий в избранное
- ✅ Автоматическое определение community_id и expert_id
- ✅ Аналитику для сообществ и экспертов
- ✅ Защиту данных через RLS
- ✅ Оптимистичное обновление UI
- ✅ Перенаправление неавторизованных пользователей