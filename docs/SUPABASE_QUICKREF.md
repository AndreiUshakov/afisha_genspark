# ⚡ Supabase - Быстрая справка

## 🚀 Быстрый старт (5 минут)

### 1. Установка
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (secret!)
```

### 3. Создать клиент
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();
```

---

## 🔐 Аутентификация

### Email/Password
```typescript
// Регистрация
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Вход
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Выход
await supabase.auth.signOut();
```

### OAuth (Google, GitHub)
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Получить пользователя
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## 📊 Запросы к БД

### SELECT
```typescript
// Все записи
const { data, error } = await supabase
  .from('events')
  .select('*');

// С фильтром
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'published')
  .gte('event_date', '2025-01-01');

// С join
const { data } = await supabase
  .from('events')
  .select('*, categories(*), communities(*)');

// Один результат
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('id', eventId)
  .single();
```

### INSERT
```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'Новое событие',
    event_date: '2025-11-01',
    status: 'published',
  })
  .select()
  .single();
```

### UPDATE
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ title: 'Обновленное название' })
  .eq('id', eventId)
  .select();
```

### DELETE
```typescript
const { error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId);
```

---

## 📦 Storage

### Загрузка файла
```typescript
const { data, error } = await supabase.storage
  .from('event-images')
  .upload('path/to/file.jpg', file);
```

### Получить URL
```typescript
const { data } = supabase.storage
  .from('event-images')
  .getPublicUrl('path/to/file.jpg');

console.log(data.publicUrl);
```

### Удаление
```typescript
const { error } = await supabase.storage
  .from('event-images')
  .remove(['path/to/file.jpg']);
```

---

## ⚡ Real-time

### Подписка на изменения
```typescript
const channel = supabase
  .channel('events-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'events',
    },
    (payload) => {
      console.log('Новое событие:', payload.new);
    }
  )
  .subscribe();

// Отписаться
supabase.removeChannel(channel);
```

---

## 🔒 Row Level Security

### Включить RLS
```sql
alter table events enable row level security;
```

### Создать политику
```sql
-- Все могут читать опубликованные
create policy "Published events are viewable"
  on events for select
  using (status = 'published');

-- Только владелец может изменять
create policy "Users can update own events"
  on events for update
  using (auth.uid() = owner_id);
```

---

## 🎯 Частые паттерны

### Избранное (toggle)
```typescript
const toggleFavorite = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from('favorites')
    .select()
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .single();

  if (existing) {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);
  } else {
    await supabase
      .from('favorites')
      .insert({ user_id: user.id, event_id: eventId });
  }
};
```

### Пагинация
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .range(0, 9) // 0-9 = первые 10
  .order('event_date');
```

### Поиск
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .ilike('title', `%${searchQuery}%`);
```

### Счетчик
```typescript
const { count } = await supabase
  .from('events')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'published');
```

---

## 🛠️ Полезные команды

### Генерация типов
```bash
npx supabase gen types typescript --project-id your-project > types/database.types.ts
```

### Локальная разработка
```bash
supabase start        # Запустить локально
supabase stop         # Остановить
supabase db reset     # Сбросить БД
```

---

## 🔍 Отладка

### Логи
```typescript
const { data, error } = await supabase
  .from('events')
  .select();

console.log('Data:', data);
console.log('Error:', error);
```

### Browser DevTools
- Application → Local Storage → supabase.auth.token
- Network → фильтр "supabase"

---

## 📚 Больше информации

Полная документация: [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)

**Официальные ресурсы:**
- https://supabase.com/docs
- https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
