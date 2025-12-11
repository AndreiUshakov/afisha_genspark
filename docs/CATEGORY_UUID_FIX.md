# Решение проблемы UUID категорий

## Проблема

При создании сообщества возникала ошибка:
```
invalid input syntax for type uuid: "cat-culture"
```

Это происходило потому что в коде использовались строковые ID категорий ("cat-culture", "cat-sport" и т.д.), а база данных ожидает UUID.

## Решение

### 1. Изменения в коде

Обновлены следующие файлы для динамической загрузки категорий из базы данных:

- [`app/dashboard/create-community/actions.ts`](../app/dashboard/create-community/actions.ts) - добавлена функция `getCategories()`
- [`app/dashboard/create-community/page.tsx`](../app/dashboard/create-community/page.tsx) - загрузка категорий из БД
- [`app/dashboard/create-community/components/CreateCommunityForm.tsx`](../app/dashboard/create-community/components/CreateCommunityForm.tsx) - передача категорий как props
- [`app/dashboard/create-community/components/Step1BasicInfo.tsx`](../app/dashboard/create-community/components/Step1BasicInfo.tsx) - использование динамических категорий

### 2. Вставка категорий в базу данных

Если в вашей базе данных ещё нет категорий, выполните следующий SQL запрос в Supabase SQL Editor:

```sql
-- Вставка категорий для сообществ
INSERT INTO categories (name, slug, color, featured_on_hero) VALUES
('Культура и искусство', 'culture', '#8B5CF6', false),
('Спорт и здоровье', 'sport', '#10B981', false),
('Образование', 'education', '#3B82F6', false),
('Хобби и увлечения', 'hobby', '#F59E0B', false),
('Бизнес и карьера', 'business', '#6366F1', false),
('Социальные проекты', 'social', '#EC4899', false),
('Технологии', 'tech', '#8B5CF6', false),
('Семья и дети', 'family', '#F97316', false),
('Экология', 'ecology', '#059669', false),
('Другое', 'other', '#6B7280', false)
ON CONFLICT (slug) DO NOTHING;
```

### 3. Проверка

После вставки категорий проверьте их наличие:

```sql
SELECT id, name, slug FROM categories ORDER BY name;
```

Вы должны увидеть 10 категорий с UUID в поле `id`.

## Как это работает теперь

1. **Страница создания сообщества** загружается
2. **Серверная функция `getCategories()`** выполняет запрос к БД:
   ```typescript
   const { data } = await supabase
     .from('categories')
     .select('id, name, slug')
     .order('name');
   ```
3. **Категории передаются** в форму как props с реальными UUID из базы данных
4. **Пользователь выбирает** категорию - теперь это реальный UUID
5. **При создании сообщества** передаётся корректный UUID вместо строки

## Преимущества

✅ Категории хранятся централизованно в базе данных  
✅ Легко добавлять/изменять категории без изменения кода  
✅ Корректная работа с внешними ключами (foreign keys)  
✅ Единый источник истины для категорий  

## Связанные файлы

- Server Actions: [`app/dashboard/create-community/actions.ts`](../app/dashboard/create-community/actions.ts)
- Page Component: [`app/dashboard/create-community/page.tsx`](../app/dashboard/create-community/page.tsx)
- Form Component: [`app/dashboard/create-community/components/CreateCommunityForm.tsx`](../app/dashboard/create-community/components/CreateCommunityForm.tsx)
- Step1 Component: [`app/dashboard/create-community/components/Step1BasicInfo.tsx`](../app/dashboard/create-community/components/Step1BasicInfo.tsx)

## Альтернативный вариант: использование скрипта миграции

Если хотите использовать скрипт для вставки категорий, создайте файл `scripts/migrate-categories.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Культура и искусство', slug: 'culture', color: '#8B5CF6' },
  { name: 'Спорт и здоровье', slug: 'sport', color: '#10B981' },
  { name: 'Образование', slug: 'education', color: '#3B82F6' },
  { name: 'Хобби и увлечения', slug: 'hobby', color: '#F59E0B' },
  { name: 'Бизнес и карьера', slug: 'business', color: '#6366F1' },
  { name: 'Социальные проекты', slug: 'social', color: '#EC4899' },
  { name: 'Технологии', slug: 'tech', color: '#8B5CF6' },
  { name: 'Семья и дети', slug: 'family', color: '#F97316' },
  { name: 'Экология', slug: 'ecology', color: '#059669' },
  { name: 'Другое', slug: 'other', color: '#6B7280' }
];

async function migrateCategories() {
  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(category, { onConflict: 'slug' });
    
    if (error) {
      console.error(`Error inserting ${category.name}:`, error);
    } else {
      console.log(`✓ ${category.name}`);
    }
  }
}

migrateCategories();
```

Затем добавьте в `package.json`:

```json
{
  "scripts": {
    "migrate:categories": "tsx scripts/migrate-categories.ts"
  }
}
```

И выполните:

```bash
npm run migrate:categories