# Быстрый старт: Восстановление Supabase

## 🚀 За 5 минут

### 1. Создайте новый проект Supabase
- Перейдите на https://supabase.com
- Создайте новый проект
- Дождитесь инициализации (2-3 минуты)

### 2. Выполните скрипты восстановления

#### Шаг 1: База данных (2 минуты)
1. Откройте **SQL Editor** в Supabase Dashboard
2. Скопируйте весь файл [`01_complete_database_restore.sql`](01_complete_database_restore.sql)
3. Вставьте в редактор и нажмите **Run**
4. Дождитесь сообщения об успешном выполнении

#### Шаг 2: Storage (30 секунд)
1. В том же SQL Editor
2. Скопируйте весь файл [`02_storage_buckets_restore.sql`](02_storage_buckets_restore.sql)
3. Вставьте и нажмите **Run**

### 3. Обновите переменные окружения

Скопируйте из **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-key
```

### 4. Создайте администратора

1. Зарегистрируйтесь через приложение
2. Выполните в SQL Editor:

```sql
-- Замените YOUR_EMAIL на ваш email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL';
```

## ✅ Готово!

Ваша база данных полностью восстановлена:
- ✅ 14 таблиц
- ✅ 3 Storage buckets
- ✅ Все RLS политики
- ✅ 15 категорий мероприятий
- ✅ Триггеры и функции

## 📚 Что дальше?

- Подробная инструкция: [`README.md`](README.md)
- Миграция данных из старой БД (если есть резервная копия)
- Тестирование функционала приложения

## ⚠️ Важно

- Не коммитьте `.env.local` в Git
- Сохраните Service Role Key в безопасном месте
- Проверьте работу RLS политик перед продакшеном

---

**Нужна помощь?** Смотрите полную инструкцию в [`README.md`](README.md)
