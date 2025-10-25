# Fix: "Could not find a production build in the '.next' directory"

## 🔴 Ошибка

```
Error: Could not find a production build in the '.next' directory. 
Try building your app with 'next build' before starting the production server.
```

## 📋 Причина

Эта ошибка возникает когда:
1. Команда `npm run build` не выполнилась успешно
2. `.next` директория не была создана или удалена
3. Build артефакты не сохранились между шагами build и run
4. Неправильная конфигурация `amvera.yml`

## ✅ Решение: Шаг за шагом

### Шаг 1: Проверьте текущий `amvera.yml`

Правильная конфигурация должна выглядеть так:

```yaml
meta:
  environment: node
  toolchain:
    name: npm
    version: 20

build:
  env:
    NODE_ENV: production
  script: |
    echo "Installing dependencies..."
    npm ci
    echo "Building Next.js application..."
    npm run build
    echo "Build completed! Checking .next directory..."
    ls -la .next || echo ".next directory not found!"

run:
  containerPort: 3000
  command: npm start
```

**Важно:**
- ✅ Используйте `script:` с pipe (`|`) для многострочных команд
- ✅ Используйте `containerPort:` (не `port:`)
- ✅ Используйте `npm start` (не `npm run start`)

### Шаг 2: Проверьте Build Logs в Amvera

1. Откройте Amvera Dashboard
2. Перейдите в **Deployments**
3. Откройте последний деплой
4. Посмотрите **Build Logs**

**Что искать:**
- ✅ `npm ci` завершился успешно
- ✅ `npm run build` завершился успешно
- ✅ Сообщение "Compiled successfully"
- ✅ Нет ошибок TypeScript или ESLint

### Шаг 3: Если build падает с ошибкой

#### 3.1. Out of Memory

Если видите `FATAL ERROR: JavaScript heap out of memory`:

```yaml
build:
  env:
    NODE_ENV: production
    NODE_OPTIONS: --max-old-space-size=4096
  script: |
    npm ci
    npm run build
```

#### 3.2. Dependency conflicts

Если видите `ERESOLVE unable to resolve dependency tree`:

```yaml
build:
  script: |
    npm install --legacy-peer-deps
    npm run build
```

#### 3.3. TypeScript errors

Если видите `Type error: ...`:

**Решение 1:** Исправьте ошибки локально
```bash
npm run build  # Запустите локально и исправьте все ошибки
```

**Решение 2 (временно):** Отключите проверку в `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Только для тестирования!
  },
};
```

### Шаг 4: Проверьте `package.json`

Убедитесь, что скрипты правильные:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Шаг 5: Локальный тест

Проверьте, что сборка работает локально:

```bash
# Удалите старые артефакты
rm -rf .next node_modules

# Установите зависимости
npm ci

# Соберите проект
npm run build

# Должна появиться директория .next
ls -la .next

# Запустите production сервер
npm start
```

Если локально работает, но на Amvera нет - проблема в конфигурации.

### Шаг 6: Попробуйте альтернативную конфигурацию

В проекте есть файл `amvera.alternative.yml` с 6 вариантами конфигурации.

**Как использовать:**

1. Откройте `amvera.alternative.yml`
2. Выберите один из вариантов (например, Option 2)
3. Скопируйте его в `amvera.yml`:

```bash
# Пример: используем Option 2
cat << 'EOF' > amvera.yml
meta:
  environment: node
  toolchain:
    name: npm
    version: 20

build:
  env:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: 1
  script: |
    npm ci --prefer-offline --no-audit
    npm run build

run:
  containerPort: 3000
  command: npm start
EOF

git add amvera.yml
git commit -m "fix: try alternative Amvera config"
git push origin main
```

### Шаг 7: Проверьте переменные окружения

Некоторые проекты требуют переменные окружения для сборки.

**В Amvera Dashboard:**
1. Settings → Environment Variables
2. Добавьте необходимые переменные:
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

### Шаг 8: Увеличьте ресурсы

В настройках Amvera проекта:
- **RAM:** минимум 1GB (рекомендуется 2GB для Next.js)
- **CPU:** минимум 1 core

## 🔍 Debug: Расширенная диагностика

Если проблема сохраняется, добавьте debug в `amvera.yml`:

```yaml
build:
  env:
    NODE_ENV: production
  script: |
    echo "=== System Info ==="
    node --version
    npm --version
    echo "=== Installing dependencies ==="
    npm ci
    echo "=== Dependencies installed ==="
    ls -la node_modules/.bin/next
    echo "=== Running build ==="
    npm run build
    echo "=== Build completed ==="
    echo "=== Checking .next directory ==="
    ls -laR .next
    echo "=== Checking package.json ==="
    cat package.json
```

Это покажет в логах:
- Версии Node.js и npm
- Установлены ли зависимости
- Создалась ли `.next` директория
- Содержимое `.next`

## 🎯 Быстрое решение (если очень срочно)

Самая простая рабочая конфигурация:

```yaml
meta:
  environment: node
  toolchain:
    name: npm
    version: 20

build:
  script: npm install && npm run build

run:
  containerPort: 3000
  command: npm start
```

Сохраните это в `amvera.yml`, закоммитьте и запушьте.

## 📊 Чек-лист успешного деплоя

- [ ] `npm run build` работает локально без ошибок
- [ ] `.next` директория создаётся локально
- [ ] `npm start` запускает сервер локально на порту 3000
- [ ] `amvera.yml` использует `script:` (не `commands:`)
- [ ] Используется `containerPort: 3000`
- [ ] Используется `npm start` (не `npm run start`)
- [ ] Build Logs в Amvera показывают "Compiled successfully"
- [ ] В Amvera выделено минимум 1GB RAM

## 💡 Полезные команды

```bash
# Посмотреть текущий amvera.yml
cat amvera.yml

# Проверить локальную сборку
npm ci && npm run build && npm start

# Очистить кэш npm
npm cache clean --force

# Обновить package-lock.json
rm package-lock.json
npm install
```

## 📞 Если ничего не помогло

1. Проверьте версию Next.js в `package.json`
2. Проверьте версию Node.js (должна быть 18-22)
3. Проверьте, нет ли кастомных настроек в `next.config.ts`
4. Скиньте полные Build Logs для детального анализа

---

**Последнее обновление:** 2025-10-25  
**Статус:** После исправления конфигурации деплой должен пройти успешно ✅
