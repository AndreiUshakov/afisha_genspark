# 🚀 Начало работы в Cursor AI

Инструкция для продолжения разработки проекта "Афиша Иркутска" в Cursor AI.

## 📋 Предварительные требования

- Установленный [Cursor AI](https://cursor.sh/)
- Установленный [Git](https://git-scm.com/)
- Установленный [Node.js 18+](https://nodejs.org/)
- Аккаунт на [GitHub](https://github.com/)

## 🔧 Настройка проекта

### 1. Клонирование репозитория

```bash
# Клонировать репозиторий
git clone https://github.com/AndreiUshakov/afisha_genspark.git

# Перейти в директорию проекта
cd afisha_genspark
```

### 2. Переключение на ветку разработки

```bash
# Переключиться на ветку genspark_ai_developer
git checkout genspark_ai_developer

# Проверить текущую ветку
git branch
```

### 3. Установка зависимостей

```bash
# Установить все npm зависимости
npm install
```

### 4. Запуск проекта локально

```bash
# Запустить dev сервер
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 📁 Структура проекта

```
afisha_genspark/
├── app/                      # Next.js App Router
│   ├── auth/                # Авторизация (login, register)
│   ├── events/             # Мероприятия
│   ├── communities/        # Сообщества
│   ├── experts/            # Эксперты
│   ├── blog/               # Блог
│   ├── layout.tsx          # Основной layout
│   ├── page.tsx            # Главная страница
│   └── globals.css         # Глобальные стили
├── components/             # React компоненты
│   ├── layout/            # Header, Footer, Hero
│   ├── events/            # Компоненты мероприятий
│   └── communities/       # Компоненты сообществ
├── lib/                   # Утилиты
├── public/               # Статические файлы
├── README.md             # Документация проекта
├── DEVELOPMENT.md        # Гайд для разработчиков
└── package.json          # Зависимости
```

## 🎯 Рабочий процесс (Workflow)

### Работа с изменениями

1. **Перед началом работы:**
```bash
# Убедиться что вы на правильной ветке
git checkout genspark_ai_developer

# Получить последние изменения
git pull origin genspark_ai_developer
```

2. **Во время работы:**
- Вносите изменения в код
- Тестируйте локально: `npm run dev`
- Проверяйте типы: `npm run build`

3. **После внесения изменений:**
```bash
# Добавить измененные файлы
git add .

# Создать коммит с описанием
git commit -m "feat: описание изменений"

# Отправить в GitHub
git push origin genspark_ai_developer
```

### Формат коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: добавлена новая функция
fix: исправлен баг
docs: обновлена документация
style: форматирование кода
refactor: рефакторинг
test: добавлены тесты
chore: прочие изменения
```

## 🔄 Создание Pull Request

После пуша изменений:

1. Перейдите на GitHub: https://github.com/AndreiUshakov/afisha_genspark
2. Нажмите "Compare & pull request"
3. Укажите заголовок и описание изменений
4. Нажмите "Create pull request"

Или используйте прямую ссылку:
https://github.com/AndreiUshakov/afisha_genspark/pull/new/genspark_ai_developer

## 💻 Работа в Cursor AI

### Настройка Cursor

1. **Открыть проект:**
   - File → Open Folder
   - Выбрать папку `afisha_genspark`

2. **Настроить терминал:**
   - View → Terminal (Ctrl + \`)
   - Убедиться что Node.js установлен: `node --version`

3. **Запустить dev сервер:**
   ```bash
   npm run dev
   ```

### Использование AI в Cursor

#### Cursor Composer (Cmd/Ctrl + I)
Используйте для:
- Создания новых компонентов
- Рефакторинга кода
- Написания документации
- Исправления ошибок

Примеры промптов:
```
"Создай компонент EventDetail для отображения детальной информации о мероприятии"
"Добавь функционал избранного в EventCard"
"Исправь ошибки TypeScript в этом файле"
```

#### Cursor Chat (Cmd/Ctrl + L)
Используйте для:
- Вопросов о проекте
- Объяснения кода
- Поиска лучших практик

#### Inline Editing (Cmd/Ctrl + K)
Используйте для:
- Быстрых правок
- Оптимизации кода
- Добавления комментариев

### Полезные команды в Cursor

```bash
# Форматирование кода
Shift + Alt + F (Windows/Linux)
Shift + Option + F (Mac)

# Быстрый поиск
Cmd/Ctrl + P

# Поиск в файлах
Cmd/Ctrl + Shift + F

# Открыть терминал
Cmd/Ctrl + `
```

## 🛠️ Техническая информация

### Стек технологий

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Preline UI
- **Runtime:** React 19

### Полезные скрипты

```bash
npm run dev        # Запуск в режиме разработки
npm run build      # Сборка проекта
npm start          # Запуск production сервера
npm run lint       # Проверка кода
```

### Горячие клавиши Next.js

- Изменения автоматически перезагружаются (Hot Reload)
- TypeScript ошибки отображаются в браузере
- Ошибки React показываются в overlay

## 📚 Дополнительные ресурсы

- [README.md](./README.md) - Общая документация проекта
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Детальный гайд для разработчиков
- [Next.js Docs](https://nextjs.org/docs) - Документация Next.js
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Документация Tailwind
- [Preline UI](https://preline.co/docs) - Документация Preline UI

## 🆘 Помощь и поддержка

### Частые проблемы

**1. Ошибка при `npm install`:**
```bash
# Удалить node_modules и lock файл
rm -rf node_modules package-lock.json
npm install
```

**2. Порт 3000 занят:**
```bash
# Использовать другой порт
PORT=3001 npm run dev
```

**3. TypeScript ошибки:**
```bash
# Проверить типы
npm run build
```

**4. Git конфликты:**
```bash
# Сохранить текущие изменения
git stash

# Получить последние изменения
git pull origin genspark_ai_developer

# Применить сохраненные изменения
git stash pop
```

## 🎯 Следующие задачи

Приоритетные задачи для разработки:

### 1. Backend и база данных
- [ ] Подключить PostgreSQL или MongoDB
- [ ] Создать API routes для мероприятий
- [ ] Настроить Prisma ORM

### 2. Аутентификация
- [ ] Интегрировать NextAuth.js
- [ ] Настроить провайдеров (Google, GitHub)
- [ ] Создать защищенные маршруты

### 3. Функционал избранного
- [ ] Добавить кнопку "В избранное"
- [ ] Создать страницу избранного
- [ ] Сохранение в localStorage/БД

### 4. Система подписок
- [ ] Подписка на сообщества
- [ ] Подписка на экспертов
- [ ] Уведомления о новых событиях

### 5. Личные кабинеты
- [ ] Кабинет пользователя
- [ ] Кабинет сообщества
- [ ] Кабинет эксперта
- [ ] Управление профилем

### 6. Интеграции
- [ ] Email уведомления (Resend/SendGrid)
- [ ] Telegram бот
- [ ] Яндекс.Карты
- [ ] Интеграция с соцсетями

## 📞 Контакты

**GitHub:** https://github.com/AndreiUshakov/afisha_genspark
**Репозиторий:** afisha_genspark
**Ветка разработки:** genspark_ai_developer

---

**Удачной разработки! 🚀**
