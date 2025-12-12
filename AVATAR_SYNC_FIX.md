# Исправление синхронизации аватара и имени пользователя

## Проблема

Аватар и имя пользователя не синхронизировались между таблицей `profiles` и `user_metadata`, что приводило к следующим проблемам:

1. После загрузки аватара в профиле, он не отображался в header и sidebar дашборда
2. После обновления имени в профиле, старое имя продолжало отображаться в компонентах
3. Данные брались из разных источников в разных компонентах

## Причина

- В [`app/dashboard/profile/actions.ts`](app/dashboard/profile/actions.ts) аватар и имя сохранялись только в таблицу `profiles`
- В [`app/dashboard/layout.tsx`](app/dashboard/layout.tsx) и [`components/layout/Header.tsx`](components/layout/Header.tsx) данные брались из `user.user_metadata`
- Не было синхронизации между этими двумя источниками

## Решение

### 1. Обновление `user_metadata` при изменении профиля

В [`app/dashboard/profile/actions.ts`](app/dashboard/profile/actions.ts):

- При загрузке аватара добавлен вызов `supabase.auth.updateUser()` для обновления `user_metadata.avatar_url`
- При обновлении имени добавлен вызов `supabase.auth.updateUser()` для обновления `user_metadata.full_name`

### 2. Приоритет данных из таблицы `profiles`

Обновлены компоненты для получения данных из таблицы `profiles`:

#### [`app/dashboard/layout.tsx`](app/dashboard/layout.tsx)
```typescript
// Получаем профиль пользователя из базы данных
const { data: profile } = user
  ? await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
  : { data: null };

// Используем данные из profiles с fallback на user_metadata
user={user ? {
  email: user.email!,
  avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
  full_name: profile?.full_name || user.user_metadata?.full_name
} : undefined}
```

#### [`components/layout/Header.tsx`](components/layout/Header.tsx)
```typescript
// Получаем профиль пользователя из базы данных
const { data: profile } = user
  ? await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
  : { data: null };

// Используем данные из profiles с fallback на user_metadata
<UserMenu user={{
  email: user.email!,
  avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
  full_name: profile?.full_name || user.user_metadata?.full_name
}} />
```

### 3. Инвалидация кеша

Добавлена инвалидация кеша для всех страниц при обновлении профиля:

```typescript
revalidatePath('/dashboard/profile')
revalidatePath('/dashboard')
revalidatePath('/', 'layout') // Инвалидируем header на всех страницах
```

## Результат

Теперь аватар и имя пользователя:

✅ Отображаются корректно во всех компонентах:
- [`components/layout/Header.tsx`](components/layout/Header.tsx) - основной header сайта
- [`components/layout/UserMenu.tsx`](components/layout/UserMenu.tsx) - меню пользователя
- [`components/dashboard/DashboardLayout.tsx`](components/dashboard/DashboardLayout.tsx) - sidebar дашборда
- [`app/dashboard/page.tsx`](app/dashboard/page.tsx) - главная страница дашборда
- [`app/dashboard/profile/components/ProfileForm.tsx`](app/dashboard/profile/components/ProfileForm.tsx) - форма профиля

✅ Синхронизируются между `profiles` и `user_metadata`

✅ Обновляются в реальном времени после изменения

## Компоненты, где отображается аватар и имя

1. **Header** ([`components/layout/Header.tsx`](components/layout/Header.tsx:6-106))
   - Аватар пользователя в правом верхнем углу
   - Имя пользователя рядом с аватаром (на desktop)

2. **UserMenu** ([`components/layout/UserMenu.tsx`](components/layout/UserMenu.tsx:14-62))
   - Аватар в выпадающем меню
   - Имя или email пользователя

3. **DashboardLayout** ([`components/dashboard/DashboardLayout.tsx`](components/dashboard/DashboardLayout.tsx:460-501))
   - Аватар в нижней части sidebar
   - Полное имя пользователя
   - Email и роль

4. **Dashboard главная** ([`app/dashboard/page.tsx`](app/dashboard/page.tsx:96-103))
   - Приветствие с именем пользователя

5. **ProfileForm** ([`app/dashboard/profile/components/ProfileForm.tsx`](app/dashboard/profile/components/ProfileForm.tsx:111-174))
   - Большой аватар для редактирования
   - Имя пользователя
   - Email с индикатором подтверждения

## Тестирование

Для проверки корректности работы:

1. Войдите на портал под своим именем
2. Перейдите в профиль (`/dashboard/profile`)
3. Загрузите аватар
4. Обновите имя
5. Проверьте, что аватар и имя отображаются во всех указанных компонентах
6. Обновите страницу - данные должны сохраниться

## Технические детали

### Приоритет источников данных

1. **Первичный источник**: таблица `profiles` в Supabase
2. **Резервный источник**: `user.user_metadata` (для обратной совместимости)

### Синхронизация

- При каждом обновлении профиля обновляются ОБА источника
- Это обеспечивает совместимость со старым кодом и плавный переход

### Кеширование

- Используется `revalidatePath()` для очистки кеша
- Инвалидируется layout для обновления header на всех страницах

## Исправление проблемы с ConditionalHeader

### Проблема

Header пропадал при возврате с личного кабинета на публичную часть сайта из-за проблем с кешированием pathname в серверных компонентах.

### Решение

1. **Обновлен [`components/layout/ConditionalHeader.tsx`](components/layout/ConditionalHeader.tsx:1-14)**
   - Компонент теперь принимает `pathname` как prop
   - Убрана зависимость от `headers()` внутри компонента

2. **Обновлен [`app/layout.tsx`](app/layout.tsx:13-43)**
   - Получение pathname вынесено на уровень root layout
   - Добавлен `key={pathname}` для принудительного ре-рендера при смене маршрута
   - Layout стал асинхронным для корректной работы с headers

3. **Middleware ([`middleware.ts`](middleware.ts:1-19))** остался без изменений
   - Продолжает устанавливать `x-pathname` header для доступа в серверных компонентах

### Результат

✅ Header корректно отображается на публичных страницах
✅ Header скрывается на страницах `/dashboard` и `/admin`
✅ При переходе между разделами header появляется/исчезает без задержек
✅ Нет проблем с кешированием благодаря использованию key prop