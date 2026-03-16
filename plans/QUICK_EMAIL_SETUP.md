# ⚡ Быстрая настройка Email подтверждения

## 🎯 Цель
Настроить отправку email подтверждения при регистрации через UniSender Go.

## 📋 Что нужно сделать (5 шагов)

### Шаг 1: Получить данные из UniSender Go (5 минут)

1. Войдите в [UniSender Go Dashboard](https://go.unisender.com/)
2. Перейдите в **Настройки → SMTP** или **API**
3. Скопируйте:
   ```
   SMTP Host: smtp.unisender.com
   SMTP Port: 587
   SMTP Username: ваш_логин
   SMTP Password: ваш_пароль
   API Key: ваш_api_ключ (если есть)
   ```

### Шаг 2: Найти конфигурацию GoTrue на сервере (10 минут)

Ваш Supabase развёрнут на `https://sober-automation.ru`. Нужно найти файл конфигурации:

**Вариант A: Docker Compose**
```bash
# Подключитесь к серверу
ssh user@sober-automation.ru

# Найдите docker-compose.yml
find / -name "docker-compose.yml" 2>/dev/null | grep supabase

# Или найдите контейнер GoTrue
docker ps | grep gotrue
docker inspect <container_id> | grep -i env
```

**Вариант B: Kubernetes**
```bash
# Найдите pod GoTrue
kubectl get pods | grep gotrue

# Посмотрите переменные окружения
kubectl describe pod <gotrue-pod-name>
```

**Вариант C: Через Supabase Dashboard**
Если у вас есть доступ к Supabase Dashboard:
1. Откройте `https://sober-automation.ru` (или ваш dashboard URL)
2. Перейдите в **Authentication → Settings**
3. Найдите раздел **SMTP Settings**

### Шаг 3: Добавить SMTP конфигурацию (5 минут)

**Если используете Docker Compose:**

Отредактируйте `docker-compose.yml` или `.env` файл:

```yaml
# В секции gotrue или auth сервиса
environment:
  # Существующие переменные...
  
  # Добавьте эти строки:
  GOTRUE_SMTP_HOST: smtp.unisender.com
  GOTRUE_SMTP_PORT: 587
  GOTRUE_SMTP_USER: ваш_smtp_username
  GOTRUE_SMTP_PASS: ваш_smtp_password
  GOTRUE_SMTP_ADMIN_EMAIL: noreply@yourdomain.com
  GOTRUE_SMTP_SENDER_NAME: "Афиша Иркутска"
  GOTRUE_MAILER_AUTOCONFIRM: false
  GOTRUE_SITE_URL: https://afisa-ushakovandrei.amvera.io
```

**Если используете переменные окружения:**

Создайте или обновите `.env` файл:

```env
GOTRUE_SMTP_HOST=smtp.unisender.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=ваш_smtp_username
GOTRUE_SMTP_PASS=ваш_smtp_password
GOTRUE_SMTP_ADMIN_EMAIL=noreply@yourdomain.com
GOTRUE_SMTP_SENDER_NAME=Афиша Иркутска
GOTRUE_MAILER_AUTOCONFIRM=false
GOTRUE_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

### Шаг 4: Перезапустить GoTrue сервис (2 минуты)

```bash
# Если Docker Compose
docker-compose restart auth
# или
docker-compose up -d --force-recreate auth

# Если Kubernetes
kubectl rollout restart deployment gotrue

# Проверьте логи
docker logs -f <gotrue-container-id>
# или
kubectl logs -f <gotrue-pod-name>
```

### Шаг 5: Обновить код приложения (5 минут)

Обновите `.env.local` в вашем Next.js проекте:

```env
# Отключите автоподтверждение
GOTRUE_MAILER_AUTOCONFIRM=false

# Убедитесь, что URL правильный
NEXT_PUBLIC_SITE_URL=https://afisa-ushakovandrei.amvera.io
```

Обновите [`app/auth/register/actions.ts`](../app/auth/register/actions.ts):

```typescript
// Удалите или закомментируйте эту часть:
// if (error.message.includes('confirmation email') && data?.user) {
//   console.log('Пользователь создан, email подтверждение пропущено')
// }

// Вместо этого верните нормальную ошибку:
if (error) {
  console.error('Registration error:', error)
  return { error: error.message || 'Ошибка при регистрации' }
}
```

## 🧪 Тестирование

### 1. Локальное тестирование

```bash
# Запустите приложение
npm run dev

# Откройте http://localhost:3000/auth/register
# Зарегистрируйте тестовый аккаунт
# Проверьте email
```

### 2. Production тестирование

```bash
# Задеплойте изменения
git add .
git commit -m "Configure email confirmation with UniSender Go"
git push

# Откройте https://afisa-ushakovandrei.amvera.io/auth/register
# Зарегистрируйте тестовый аккаунт
# Проверьте email
```

## 🔍 Проверка логов

### Логи GoTrue (на сервере)

```bash
# Docker
docker logs gotrue-container-name 2>&1 | grep -i smtp

# Kubernetes
kubectl logs gotrue-pod-name | grep -i smtp
```

**Что искать:**
- ✅ `SMTP connection successful`
- ✅ `Email sent to user@example.com`
- ❌ `SMTP authentication failed`
- ❌ `Connection refused`

### Логи Next.js (в консоли браузера)

Откройте DevTools → Console и проверьте:
- ✅ `=== УСПЕШНАЯ РЕГИСТРАЦИЯ ===`
- ❌ `=== ОШИБКА ОТ SUPABASE ===`

## ❓ Частые проблемы

### Проблема 1: "SMTP authentication failed"

**Решение:**
- Проверьте username и password в UniSender
- Убедитесь, что используете правильный API ключ
- Попробуйте сбросить пароль в UniSender

### Проблема 2: "Connection refused"

**Решение:**
- Проверьте, что порт 587 открыт на сервере
- Попробуйте порт 465 (SSL)
- Проверьте firewall правила

### Проблема 3: Email не приходит

**Решение:**
- Проверьте папку "Спам"
- Проверьте квоту в UniSender Dashboard
- Проверьте логи UniSender
- Убедитесь, что email отправителя подтверждён

### Проблема 4: "Invalid redirect URL"

**Решение:**
- Проверьте `GOTRUE_SITE_URL`
- Добавьте URL в Supabase Dashboard → Authentication → URL Configuration
- Убедитесь, что URL совпадает с `NEXT_PUBLIC_SITE_URL`

## 📞 Нужна помощь?

Если что-то не работает:

1. **Проверьте логи** (GoTrue и Next.js)
2. **Откройте полную документацию**: [`EMAIL_CONFIRMATION_SETUP.md`](./EMAIL_CONFIRMATION_SETUP.md)
3. **Посмотрите диаграммы**: [`EMAIL_FLOW_DIAGRAM.md`](./EMAIL_FLOW_DIAGRAM.md)

## ✅ Чеклист

- [ ] Получил SMTP данные из UniSender Go
- [ ] Нашёл конфигурацию GoTrue на сервере
- [ ] Добавил SMTP переменные окружения
- [ ] Перезапустил GoTrue сервис
- [ ] Обновил код Next.js приложения
- [ ] Протестировал локально
- [ ] Задеплоил на production
- [ ] Протестировал на production
- [ ] Email приходят успешно ✨

---

**Время выполнения: ~30 минут**

**Готовы начать? Начните с Шага 1!** 🚀
