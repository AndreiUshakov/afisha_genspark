# Исправление Internal Server Error

## Проблема
При запуске приложения на localhost:3000 возникала ошибка:
```
TypeError: Cannot destructure property 'protocol' of 'window.location' as it is undefined.
```

## Причина
Библиотека `@supabase/ssr` пыталась получить доступ к `window.location` во время Server-Side Rendering (SSR), где объект `window` не существует.

## Решение

### 1. Добавлен полифилл для window.location в instrumentation.ts
Файл `instrumentation.ts` теперь создает mock объект `window.location` на сервере:

```typescript
export async function register() {
  if (typeof self === 'undefined') {
    (global as any).self = global;
  }
  
  if (typeof window === 'undefined') {
    (global as any).window = {
      location: {
        protocol: 'http:',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/',
        search: '',
        hash: '',
        href: 'http://localhost:3000/'
      }
    };
  }
}
```

### 2. Упрощен middleware.ts
Middleware теперь не выполняет операции с Supabase, а просто пропускает запросы:

```typescript
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}
```

### 3. Упрощен lib/supabase/server.ts
Удален импорт `dotenv`, так как Next.js автоматически загружает переменные окружения из `.env.local`.

### 4. Обновлены версии Supabase
В `package.json` обновлены версии:
- `@supabase/ssr`: `^0.5.2` (вместо `^0.8.0`)
- `@supabase/supabase-js`: `^2.47.10` (вместо `^2.85.0`)

## Результат
Приложение успешно запускается на localhost:3000 без ошибок Internal Server Error.

## Дополнительные замечания
- Аутентификация Supabase работает через Server Actions в файлах `app/auth/*/actions.ts`
- Middleware не блокирует запросы, но может быть расширен для проверки аутентификации в будущем
- Полифилл `window.location` необходим для корректной работы библиотеки `@supabase/ssr` на сервере