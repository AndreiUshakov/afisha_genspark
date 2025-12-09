# Настройка профиля пользователя

## Обзор

Реализована полная функциональность редактирования профиля пользователя на странице `/dashboard/profile`:

- ✅ Загрузка реальных данных пользователя из Supabase
- ✅ Редактирование текстовых полей (имя, телефон, био, местоположение, веб-сайт)
- ✅ Загрузка и обновление аватара
- ✅ Индикатор подтвержденного email
- ✅ Валидация и обработка ошибок

## Структура файлов

```
app/dashboard/profile/
├── page.tsx                    # Серверный компонент страницы
├── actions.ts                  # Server Actions для работы с профилем
└── components/
    └── ProfileForm.tsx         # Клиентский компонент формы
```

## Настройка Supabase Storage

### 1. Применение миграции

Выполните миграцию для создания bucket для хранения аватаров:

```bash
# Если используете Supabase CLI
supabase db push

# Или примените миграцию вручную через Supabase Dashboard
# SQL Editor -> New Query -> Вставьте содержимое файла:
# supabase/migrations/20231209_create_profiles_bucket.sql
```

### 2. Проверка bucket

После применения миграции проверьте в Supabase Dashboard:

1. Перейдите в **Storage**
2. Убедитесь, что создан bucket `profiles`
3. Проверьте, что bucket публичный (public = true)

### 3. Политики безопасности

Миграция автоматически создает следующие политики:

- **Публичный доступ на чтение**: Все могут просматривать аватары
- **Загрузка**: Пользователи могут загружать файлы только в свою папку `avatars/{user_id}/`
- **Обновление**: Пользователи могут обновлять только свои файлы
- **Удаление**: Пользователи могут удалять только свои файлы

## Функциональность

### Server Actions

#### `getProfile()`
Получает данные профиля текущего пользователя из таблицы `profiles`.

**Возвращает:**
```typescript
{
  data: ProfileData | null,
  error: string | null
}
```

#### `updateProfile(data: UpdateProfileData)`
Обновляет текстовые поля профиля.

**Параметры:**
```typescript
{
  full_name?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
}
```

#### `uploadAvatar(formData: FormData)`
Загружает аватар в Supabase Storage и обновляет профиль.

**Особенности:**
- Принимает только изображения
- Максимальный размер: 5MB
- Автоматически генерирует уникальное имя файла
- Сохраняет в папку `avatars/{user_id}-{timestamp}.{ext}`

#### `checkEmailVerification()`
Проверяет, подтвержден ли email пользователя.

**Возвращает:**
```typescript
{
  verified: boolean,
  error: string | null
}
```

### Компонент ProfileForm

Клиентский компонент с полной функциональностью:

**Возможности:**
- Редактирование всех полей профиля
- Загрузка аватара через drag-and-drop или клик
- Предпросмотр аватара
- Отображение инициалов, если аватар не загружен
- Индикатор статуса email (подтвержден/не подтвержден)
- Валидация на клиенте
- Обработка ошибок с отображением сообщений
- Состояния загрузки (loading states)

## Использование

### Базовое использование

Страница `/dashboard/profile` автоматически:
1. Получает данные пользователя
2. Проверяет статус подтверждения email
3. Отображает форму редактирования

### Загрузка аватара

```typescript
// Пользователь кликает на аватар
// Выбирает файл
// Автоматически загружается в Supabase Storage
// Профиль обновляется с новым URL
```

### Обновление профиля

```typescript
// Пользователь редактирует поля
// Нажимает "Сохранить изменения"
// Данные отправляются через Server Action
// Страница автоматически обновляется (revalidatePath)
```

## Безопасность

### Row Level Security (RLS)

Таблица `profiles` защищена политиками RLS:

```sql
-- Все могут просматривать профили
CREATE POLICY "Профили видны всем" ON profiles
  FOR SELECT USING (true);

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Storage Security

Bucket `profiles` защищен политиками:

- Пользователи могут загружать файлы только в свою папку
- Структура пути: `avatars/{user_id}-{timestamp}.{ext}`
- Проверка на стороне сервера через `auth.uid()`

## Типы данных

### ProfileData

```typescript
interface ProfileData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  website: string | null
  social_links: Record<string, string>
  role: string
  is_verified: boolean
  created_at: string
  updated_at: string
}
```

### UpdateProfileData

```typescript
interface UpdateProfileData {
  full_name?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  avatar_url?: string
}
```

## Обработка ошибок

Все Server Actions возвращают объект с полями `error`:

```typescript
const { data, error } = await getProfile()

if (error) {
  // Обработка ошибки
  console.error(error)
}
```

Компонент ProfileForm отображает ошибки пользователю:
- Красный баннер для ошибок
- Зеленый баннер для успешных операций

## Оптимизация

### Revalidation

После обновления профиля или загрузки аватара автоматически вызывается:

```typescript
revalidatePath('/dashboard/profile')
```

Это обновляет кеш Next.js и показывает актуальные данные.

### Image Optimization

Используется компонент `next/image` для оптимизации аватаров:

```typescript
<Image
  src={avatarUrl}
  alt="Аватар"
  width={96}
  height={96}
  className="object-cover w-full h-full"
/>
```

## Будущие улучшения

- [ ] Кроппинг изображений перед загрузкой
- [ ] Поддержка нескольких форматов (WebP, AVIF)
- [ ] Автоматическое сжатие больших изображений
- [ ] История изменений профиля
- [ ] Двухфакторная аутентификация
- [ ] Социальные сети (интеграция)
- [ ] Приватность профиля (настройки видимости)

## Troubleshooting

### Ошибка "Missing Supabase environment variables"

Убедитесь, что в `.env.local` указаны:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Ошибка загрузки аватара

1. Проверьте, что bucket `profiles` создан
2. Проверьте политики Storage в Supabase Dashboard
3. Убедитесь, что размер файла не превышает 5MB
4. Проверьте формат файла (должен быть image/*)

### Email не подтверждается

1. Проверьте настройки Email в Supabase Dashboard
2. Убедитесь, что пользователь перешел по ссылке из письма
3. Проверьте поле `email_confirmed_at` в таблице `auth.users`

## Связанные документы

- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - Настройка Supabase
- [EMAIL_VERIFICATION_IMPLEMENTATION.md](./EMAIL_VERIFICATION_IMPLEMENTATION.md) - Подтверждение email
- [SUPABASE_ARCHITECTURE.md](./SUPABASE_ARCHITECTURE.md) - Архитектура базы данных