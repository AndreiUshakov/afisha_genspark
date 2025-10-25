# Amvera Deployment - Troubleshooting Quick Guide

Быстрые решения частых проблем при деплое на Amvera.

## 🔴 Build Failed

### Ошибка: "Out of memory" / "JavaScript heap out of memory"

**Причина:** Недостаточно RAM для сборки Next.js

**Решение 1:** Увеличьте RAM в настройках Amvera до 1-2GB

**Решение 2:** Добавьте в `amvera.yml`:
```yaml
build:
  env:
    NODE_ENV: production
    NODE_OPTIONS: "--max-old-space-size=4096"
```

---

### Ошибка: "npm ERR! code ELIFECYCLE"

**Причина:** Ошибка в процессе сборки

**Решение:**
1. Проверьте локально: `npm run build`
2. Проверьте логи Amvera для деталей
3. Убедитесь, что все зависимости в `package.json`

---

### Ошибка: "Module not found: Can't resolve..."

**Причина:** Отсутствует зависимость или неправильный импорт

**Решение:**
```bash
# Локально
npm install недостающий-пакет --save
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push origin main
```

---

## 🔴 Deploy Успешный, но Сайт не Работает

### Ошибка 502 / Bad Gateway

**Причина:** Приложение не запустилось или крашится

**Решение:**
1. Проверьте логи в Amvera (вкладка "Logs")
2. Убедитесь, что порт 3000 указан правильно в `amvera.yml`
3. Проверьте, что `npm start` работает локально

---

### Ошибка 404 на всех страницах

**Причина:** Next.js не собрался правильно

**Решение:**
1. Проверьте наличие `.next` директории после сборки
2. Убедитесь, что `npm run build` завершился успешно
3. Проверьте `next.config.ts` на ошибки

---

## 🔴 Изображения не Загружаются

### Ошибка: "hostname is not configured under images"

**Причина:** Next.js Image не настроен для внешних источников

**Решение:** Проверьте `next.config.ts`:
```typescript
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

---

## 🔴 Медленный Build

### Build занимает более 10 минут

**Причина:** Медленная установка зависимостей или большая сборка

**Решение 1:** Используйте `npm ci` вместо `npm install` (уже в `amvera.yml`)

**Решение 2:** Включите кэширование в `amvera.yml`:
```yaml
run:
  persistStore: /app/.next
```

**Решение 3:** Оптимизируйте зависимости:
```bash
# Удалите неиспользуемые пакеты
npm prune

# Проверьте дубликаты
npm dedupe
```

---

## 🔴 Environment Variables

### Переменные окружения не работают

**Причина:** Переменные не добавлены в Amvera или неправильный префикс

**Решение:**
1. Добавьте переменные в настройках Amvera (Settings → Environment Variables)
2. Для доступа в браузере используйте префикс `NEXT_PUBLIC_`:
   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```
3. После добавления переменных сделайте redeploy

---

## 🔴 Hot Fixes

### Нужно срочно откатиться на предыдущую версию

**Решение через Amvera:**
1. Откройте Deployments
2. Найдите последний рабочий деплой
3. Нажмите "Rollback"

**Решение через Git:**
```bash
git revert HEAD
git push origin main
```

---

## 🔴 Проверка Конфигурации

### Чек-лист правильной конфигурации:

```bash
# 1. Проверьте файлы в корне
ls -la | grep -E "amvera.yml|.nvmrc|package.json"

# 2. Проверьте содержимое amvera.yml
cat amvera.yml

# 3. Проверьте версию Node.js
cat .nvmrc

# 4. Проверьте, что build работает локально
npm run build

# 5. Проверьте, что start работает локально
npm run start
```

### Ожидаемые результаты:
- ✅ `amvera.yml` существует
- ✅ `.nvmrc` содержит `20`
- ✅ `npm run build` завершается успешно
- ✅ `npm run start` запускает сервер на порту 3000

---

## 🔴 Логи и Мониторинг

### Как посмотреть логи:

1. **Build логи:** 
   - Amvera Dashboard → Deployments → Выберите деплой → Build Logs

2. **Runtime логи:**
   - Amvera Dashboard → Logs → Real-time logs

3. **Фильтрация логов:**
   ```
   # В поиске Amvera Logs
   error
   warning
   failed
   ```

---

## 🔴 Частые Ошибки TypeScript

### Ошибка: "Type error: ..."

**Причина:** TypeScript ошибки блокируют сборку

**Решение 1:** Исправьте ошибки локально
```bash
npm run build
# Исправьте все ошибки
```

**Решение 2 (временный workaround):** Отключите строгую проверку в `next.config.ts`:
```typescript
export default {
  typescript: {
    ignoreBuildErrors: true, // НЕ РЕКОМЕНДУЕТСЯ для production
  },
};
```

---

## 🔴 Контакты для Помощи

- **Документация Amvera:** https://docs.amvera.io
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** https://github.com/AndreiUshakov/afisha_genspark/issues

---

## 📝 Полезные Команды

```bash
# Проверка статуса деплоя (если используете Amvera CLI)
amvera deploy status

# Просмотр логов
amvera logs

# Список деплоев
amvera deploy list

# Rollback
amvera deploy rollback <deployment-id>
```

---

## ✅ Successful Deploy Checklist

После успешного деплоя проверьте:

- [ ] Главная страница загружается
- [ ] Все изображения отображаются
- [ ] Навигация работает
- [ ] События отображаются (`/events`)
- [ ] Сообщества отображаются (`/communities`)
- [ ] Эксперты отображаются (`/experts`)
- [ ] Детальные страницы открываются
- [ ] Формы работают
- [ ] Mobile версия корректна
- [ ] SEO мета-теги на месте

---

**💡 Совет:** Всегда тестируйте `npm run build` локально перед push в main!
