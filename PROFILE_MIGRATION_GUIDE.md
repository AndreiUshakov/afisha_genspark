# Инструкция по применению миграции для профилей

## Быстрый старт

Для работы функциональности редактирования профиля необходимо создать Storage bucket в Supabase.

### Вариант 1: Через Supabase CLI (рекомендуется)

```bash
# Применить все миграции
supabase db push
```

### Вариант 2: Через Supabase Dashboard

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Нажмите **New Query**
5. Скопируйте и вставьте содержимое файла `supabase/migrations/20231209_create_profiles_bucket.sql`
6. Нажмите **Run** или `Ctrl+Enter`

### Вариант 3: Ручное создание через UI

1. Откройте **Storage** в Supabase Dashboard
2. Нажмите **New bucket**
3. Заполните:
   - **Name**: `profiles`
   - **Public bucket**: ✅ (включено)
4. Нажмите **Create bucket**
5. Перейдите в **Policies** для bucket `profiles`
6. Создайте политики согласно файлу миграции

## Проверка

После применения миграции проверьте:

1. **Storage → Buckets**: должен появиться bucket `profiles`
2. **Storage → Policies**: должны быть созданы 4 политики для bucket `profiles`

## Что создается

- ✅ Bucket `profiles` (публичный)
- ✅ Политика чтения для всех
- ✅ Политика загрузки для авторизованных пользователей
- ✅ Политика обновления для владельцев файлов
- ✅ Политика удаления для владельцев файлов

## Структура хранения

Аватары сохраняются по пути:
```
profiles/
  └── avatars/
      └── {user_id}-{timestamp}.{ext}
```

Пример: `profiles/avatars/123e4567-e89b-12d3-a456-426614174000-1702123456789.jpg`

## Troubleshooting

### Ошибка "bucket already exists"

Это нормально, если bucket уже создан. Миграция использует `ON CONFLICT DO NOTHING`.

### Ошибка при загрузке файла

1. Проверьте, что bucket создан и публичный
2. Проверьте политики в Storage → Policies
3. Убедитесь, что пользователь авторизован
4. Проверьте размер файла (максимум 5MB)

## Дополнительная информация

Подробная документация: [docs/PROFILE_SETUP.md](docs/PROFILE_SETUP.md)