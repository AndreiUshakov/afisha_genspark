# Deployment Guide - Amvera

Это руководство по деплою проекта **Афиша Иркутска** на платформе Amvera с CI/CD.

## 📋 Предварительные требования

- Аккаунт на [Amvera.io](https://amvera.io)
- GitHub репозиторий проекта
- Ветка `main` в репозитории

## 🚀 Быстрый старт

### 1. Подключение репозитория

1. Войдите в панель управления Amvera
2. Создайте новый проект
3. Выберите **GitHub** как источник
4. Подключите репозиторий `afisha_genspark`
5. Выберите ветку **main**

### 2. Конфигурация проекта

Проект уже настроен для деплоя на Amvera через файл `amvera.yml` в корне проекта.

#### Структура `amvera.yml`:

```yaml
meta:
  environment: node
  toolchain:
    name: npm
    version: latest

build:
  env:
    NODE_ENV: production
  commands:
    - npm ci
    - npm run build

run:
  port: 3000
  persistStore: /app/.next
  command: npm run start
```

#### Описание параметров:

- **environment: node** - использует Node.js окружение
- **toolchain.name: npm** - использует npm для установки зависимостей
- **toolchain.version: latest** - последняя стабильная версия npm
- **build.env.NODE_ENV: production** - режим production для оптимизации
- **build.commands**:
  - `npm ci` - чистая установка зависимостей (быстрее и надёжнее чем npm install)
  - `npm run build` - сборка Next.js проекта
- **run.port: 3000** - порт для Next.js сервера
- **run.persistStore: /app/.next** - кэширование сборки между деплоями
- **run.command: npm run start** - запуск production сервера

### 3. Версия Node.js

Файл `.nvmrc` указывает версию Node.js:

```
20
```

Это обеспечивает совместимость с Next.js 16 и React 19.

### 4. Запуск деплоя

1. После подключения репозитория Amvera автоматически начнёт первый деплой
2. Процесс займёт 3-5 минут
3. После успешного деплоя вы получите URL вашего приложения

### 5. CI/CD

Автоматический деплой настроен для ветки `main`:

- **Push в main** → автоматический деплой
- **Merge PR в main** → автоматический деплой
- **Git tag** → деплой с версией

## ⚙️ Переменные окружения

Если нужно добавить переменные окружения (например, для Supabase):

1. Перейдите в настройки проекта на Amvera
2. Найдите раздел **Environment Variables**
3. Добавьте переменные:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Важно**: Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере.

## 🔍 Проверка деплоя

После успешного деплоя проверьте:

1. **Главная страница**: `/`
2. **События**: `/events`, `/events/[slug]`
3. **Сообщества**: `/communities`, `/communities/[slug]`
4. **Эксперты**: `/experts`, `/experts/[slug]`

## 🐛 Решение проблем

### Проблема: Build падает с ошибкой "Out of memory"

**Решение**: В настройках Amvera увеличьте RAM для контейнера до минимум 1GB.

### Проблема: Изображения не загружаются

**Решение**: Проверьте, что в `next.config.ts` настроены `remotePatterns`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

### Проблема: "Module not found" ошибки

**Решение**: 
1. Убедитесь, что все зависимости в `package.json`
2. Удалите `node_modules` и `package-lock.json` локально
3. Запустите `npm install`
4. Закоммитьте обновлённый `package-lock.json`

### Проблема: Деплой зависает на build

**Решение**: Проверьте логи в Amvera. Возможные причины:
- Недостаточно RAM
- Проблемы с npm registry (попробуйте `npm ci --registry=https://registry.npmjs.org`)
- Конфликты зависимостей

## 📊 Мониторинг

Amvera предоставляет:
- **Логи в реальном времени** - вкладка "Logs"
- **Метрики CPU/RAM** - вкладка "Metrics"
- **История деплоев** - вкладка "Deployments"

## 🔄 Rollback

Если что-то пошло не так:

1. Перейдите во вкладку **Deployments**
2. Найдите предыдущий успешный деплой
3. Нажмите **Rollback**

Или через Git:

```bash
git revert HEAD
git push origin main
```

## 📝 Альтернативная конфигурация

Если стандартная конфигурация не работает, попробуйте:

```yaml
meta:
  environment: node
  toolchain:
    name: npm
    version: 20

build:
  env:
    NODE_ENV: production
    NODE_OPTIONS: "--max-old-space-size=4096"
  commands:
    - npm install --legacy-peer-deps
    - npm run build

run:
  port: 3000
  command: npm run start
```

Изменения:
- Фиксированная версия Node.js (20)
- Увеличен лимит памяти для сборки
- Использован `npm install` с `--legacy-peer-deps` для разрешения конфликтов

## 📚 Дополнительные ресурсы

- [Amvera Documentation](https://docs.amvera.io)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions для Amvera](https://github.com/marketplace/actions/amvera-deploy)

## 🎯 Чек-лист перед деплоем

- [ ] Все зависимости в `package.json`
- [ ] `npm run build` работает локально
- [ ] `amvera.yml` в корне проекта
- [ ] `.nvmrc` указывает правильную версию Node.js
- [ ] Переменные окружения добавлены в Amvera (если нужны)
- [ ] `next.config.ts` настроен правильно
- [ ] Ветка `main` обновлена

---

**Готово!** После этих шагов ваш проект будет автоматически деплоиться на Amvera при каждом push в `main`. 🚀
