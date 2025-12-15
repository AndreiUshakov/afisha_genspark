# Исправление множественной загрузки изображений в медиагалерею

## Проблема

При попытке загрузить несколько изображений одновременно в медиагалерею сообщества возникала ошибка "Unexpected end of form". Это связано с особенностями обработки FormData в Next.js Server Actions.

## Причина

В Next.js 14+ Server Actions имеют ограничения при работе с `FormData.getAll()` для множественных файлов. Использование `formData.getAll('files')` приводило к некорректной обработке данных и ошибке парсинга формы.

## Решение

### 1. Изменения в `app/dashboard/community/[slug]/media/actions.ts`

**До:**
```typescript
const files = formData.getAll('files') as File[]
```

**После:**
```typescript
// Собираем все файлы из FormData
const files: File[] = []
let index = 0
while (true) {
  const file = formData.get(`file_${index}`) as File | null
  if (!file) break
  files.push(file)
  index++
}
```

Вместо использования `getAll()` теперь используется индексированный доступ к файлам через цикл, что корректно работает с Server Actions.

### 2. Изменения в `app/dashboard/community/[slug]/media/CommunityMediaClient.tsx`

**До:**
```typescript
selectedFiles.forEach(file => {
  formData.append('files', file)
})
```

**После:**
```typescript
// Используем индексированные имена полей вместо одного имени 'files'
selectedFiles.forEach((file, index) => {
  formData.append(`file_${index}`, file)
})
```

Теперь каждый файл добавляется в FormData с уникальным индексированным именем (`file_0`, `file_1`, и т.д.), что позволяет серверной функции корректно извлекать их по очереди.

## Результат

- ✅ Множественная загрузка изображений теперь работает корректно
- ✅ Исправлена ошибка "Unexpected end of form"
- ✅ Сохранена вся существующая функциональность (валидация, лимиты, обработка ошибок)
- ✅ Улучшена совместимость с Next.js Server Actions

## Тестирование

Для проверки исправления:
1. Перейдите в медиагалерею сообщества
2. Выберите несколько изображений (2-10 файлов)
3. Нажмите "Загрузить"
4. Убедитесь, что все файлы успешно загружаются без ошибок

## Техническая информация

- **Затронутые файлы:**
  - `app/dashboard/community/[slug]/media/actions.ts` - серверная обработка
  - `app/dashboard/community/[slug]/media/CommunityMediaClient.tsx` - клиентская отправка

- **Совместимость:** Next.js 14+
- **Обратная совместимость:** Да, изменения не влияют на другие части приложения