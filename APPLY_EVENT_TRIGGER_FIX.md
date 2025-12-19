# Применение исправления триггера для events

## Проблема
Триггер `update_event_moderation_task_trigger` использует функцию `update_moderation_task_on_publish()`, которая проверяет поля `NEW.status` и `OLD.status`, но таблица `events` использует поле `is_published` вместо `status`.

Ошибка: `record "new" has no field "status"`

## Решение
Создана миграция `supabase/migrations/20241219_fix_event_moderation_trigger.sql`, которая создает отдельные функции для events, posts и experts.

## Как применить

### Вариант 1: Через Supabase Dashboard
1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Скопируйте содержимое файла `supabase/migrations/20241219_fix_event_moderation_trigger.sql`
4. Выполните SQL запрос

### Вариант 2: Через CLI (если настроен Supabase CLI)
```bash
npx supabase db push
```

### Вариант 3: Через psql (если есть прямой доступ к БД)
```bash
psql -h <your-db-host> -U postgres -d postgres < supabase/migrations/20241219_fix_event_moderation_trigger.sql
```

## Что делает миграция
1. Создает функцию `update_event_moderation_task_on_publish()` для таблицы `events` (использует `is_published`)
2. Создает функцию `update_post_moderation_task_on_publish()` для таблицы `posts` (использует `is_published`)
3. Создает функцию `update_expert_moderation_task_on_publish()` для таблицы `experts` (использует `is_active`)
4. Пересоздает триггеры с правильными функциями

## После применения
Кнопки публикации/снятия с публикации на странице управления мероприятием будут работать без ошибок.