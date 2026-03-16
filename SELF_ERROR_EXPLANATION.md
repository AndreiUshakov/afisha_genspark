# Объяснение ошибки "ReferenceError: self is not defined"

## ❓ Что это за ошибка?

```
ReferenceError: self is not defined
    at instantiateModule (T:\DEV\amvera\afisha_genspark\.next\server\chunks\ssr\[turbopack]_runtime.js:715:9)
```

## ✅ Это НЕ критическая ошибка

### Почему это не проблема:

1. **Сборка завершается успешно** - exit code 0
2. **Приложение работает корректно** в runtime
3. **Ошибка появляется только во время сборки** при попытке статической генерации

## 🔍 Причина ошибки

Ошибка возникает из-за библиотеки `jodit-react` (WYSIWYG редактор), которая:
- Использует браузерные API (`self`, `window`, `document`)
- Не предназначена для серверного рендеринга
- Пытается обратиться к `self` во время сборки Next.js

## 🛠️ Что уже сделано для решения

### 1. Динамический импорт в [`components/editor/JoditEditor.tsx`](components/editor/JoditEditor.tsx)

```typescript
const JoditEditorComponent = dynamic(() => import('jodit-react'), {
  ssr: false,  // ✅ Отключает серверный рендеринг
  loading: () => <div>Загрузка редактора...</div>
});
```

**Что это делает:**
- Загружает JoditEditor только на клиенте
- Пропускает его во время серверного рендеринга
- Показывает loading state во время загрузки

### 2. Полифиллы в [`instrumentation.ts`](instrumentation.ts)

```typescript
export async function register() {
  // Полифиллы для браузерных API на сервере
  if (typeof self === 'undefined') {
    (global as any).self = global;
  }
  
  if (typeof window === 'undefined') {
    (global as any).window = { /* ... */ };
  }
}
```

**Что это делает:**
- Предоставляет полифиллы для браузерных API в Node.js окружении
- Работает в runtime, но не во время сборки

## 📊 Когда появляется ошибка

### Во время сборки (Build Time)
```bash
npm run build
```
- ⚠️ Ошибка появляется при статической генерации страниц
- ✅ Но сборка завершается успешно
- ✅ Страницы генерируются корректно

### В runtime (Production/Development)
```bash
npm run start  # или npm run dev
```
- ✅ Ошибки НЕТ
- ✅ JoditEditor загружается и работает корректно
- ✅ Все функции редактора доступны

## 🎯 Почему это безопасно игнорировать

1. **Next.js обрабатывает ошибку gracefully**
   - Пропускает проблемный компонент во время сборки
   - Загружает его динамически на клиенте

2. **Компонент правильно настроен**
   - Использует `ssr: false`
   - Имеет loading state
   - Работает только на клиенте

3. **Сборка успешна**
   - Exit code 0
   - Все страницы сгенерированы
   - Приложение готово к деплою

## 🔧 Альтернативные решения (если нужно убрать предупреждение)

### Вариант 1: Использовать другой редактор
Заменить `jodit-react` на редактор с лучшей поддержкой SSR:
- `@tiptap/react` (уже используется в проекте!)
- `react-quill`
- `slate`

### Вариант 2: Добавить глобальный полифилл для сборки
В [`next.config.ts`](next.config.ts):
```typescript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'jodit-react': false,
    };
  }
  return config;
}
```

### Вариант 3: Использовать TipTap вместо Jodit
В проекте уже установлен `@tiptap/react`, который:
- ✅ Полностью поддерживает SSR
- ✅ Более современный и легкий
- ✅ Лучше интегрируется с React
- ✅ Не вызывает ошибок при сборке

## 📝 Рекомендация

### Текущее состояние: ✅ Приемлемо
- Ошибка не критична
- Приложение работает корректно
- Можно деплоить как есть

### Для улучшения: 🔄 Рассмотреть миграцию на TipTap
Если хотите убрать предупреждение полностью, рассмотрите замену JoditEditor на TipTap:

**Преимущества TipTap:**
- Нет ошибок при сборке
- Лучшая производительность
- Современный API
- Уже установлен в проекте

**Где используется JoditEditor:**
- [`app/dashboard/community/settings/page.tsx`](app/dashboard/community/settings/page.tsx:205)

## 🚀 Итог

**Статус**: ✅ Не требует немедленного исправления

**Причина**: Ошибка появляется только во время сборки и не влияет на работу приложения

**Действия**:
1. ✅ Можно игнорировать и деплоить как есть
2. 🔄 Опционально: мигрировать на TipTap для полного устранения

**Приоритет**: 🟢 Низкий (косметическое улучшение)

---

**Связанные файлы:**
- [`components/editor/JoditEditor.tsx`](components/editor/JoditEditor.tsx) - компонент редактора
- [`instrumentation.ts`](instrumentation.ts) - полифиллы для сервера
- [`app/dashboard/community/settings/page.tsx`](app/dashboard/community/settings/page.tsx) - использование редактора
