# 📊 Диаграммы процесса Email подтверждения

## 🔄 Текущий процесс (с ошибкой)

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Next.js Frontend
    participant Supabase as Supabase Auth
    participant GoTrue as GoTrue Service
    participant SMTP as SMTP Server
    
    User->>Frontend: Заполняет форму регистрации
    Frontend->>Supabase: signUp(email, password)
    Supabase->>GoTrue: Создать пользователя
    GoTrue->>GoTrue: Создаёт пользователя в БД
    GoTrue->>SMTP: Отправить confirmation email
    SMTP--xGoTrue: ❌ SMTP не настроен
    GoTrue-->>Supabase: ❌ Error sending confirmation email
    Supabase-->>Frontend: ❌ Ошибка
    Frontend-->>User: ❌ "Ошибка! Error sending confirmation email"
```

## ✅ Целевой процесс (Вариант 1: SMTP в GoTrue)

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Next.js Frontend
    participant Supabase as Supabase Auth
    participant GoTrue as GoTrue Service
    participant UniSender as UniSender Go SMTP
    participant Email as Email клиент
    
    User->>Frontend: Заполняет форму регистрации
    Frontend->>Supabase: signUp(email, password)
    Supabase->>GoTrue: Создать пользователя
    GoTrue->>GoTrue: Создаёт пользователя в БД
    GoTrue->>UniSender: Отправить confirmation email
    UniSender->>Email: ✅ Доставить письмо
    UniSender-->>GoTrue: ✅ Email отправлен
    GoTrue-->>Supabase: ✅ Пользователь создан
    Supabase-->>Frontend: ✅ Success
    Frontend-->>User: ✅ "Проверьте email"
    
    User->>Email: Открывает письмо
    User->>Email: Нажимает на ссылку подтверждения
    Email->>Frontend: Переход по ссылке /auth/callback
    Frontend->>Supabase: Подтвердить email
    Supabase->>GoTrue: Обновить статус пользователя
    GoTrue-->>Supabase: ✅ Email подтверждён
    Supabase-->>Frontend: ✅ Создать сессию
    Frontend-->>User: ✅ Перенаправление на dashboard
```

## 🔄 Альтернативный процесс (Вариант 2: API UniSender)

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Frontend as Next.js Frontend
    participant Supabase as Supabase Auth
    participant GoTrue as GoTrue Service
    participant ServerAction as Server Action
    participant UniSenderAPI as UniSender Go API
    participant Email as Email клиент
    
    User->>Frontend: Заполняет форму регистрации
    Frontend->>ServerAction: signUp(email, password)
    ServerAction->>Supabase: signUp с autoconfirm
    Supabase->>GoTrue: Создать пользователя
    GoTrue->>GoTrue: Создаёт пользователя в БД
    GoTrue-->>Supabase: ✅ Пользователь создан
    Supabase-->>ServerAction: ✅ User data
    
    ServerAction->>ServerAction: Генерирует confirmation URL
    ServerAction->>UniSenderAPI: Отправить email через API
    UniSenderAPI->>Email: ✅ Доставить письмо
    UniSenderAPI-->>ServerAction: ✅ Email отправлен
    ServerAction-->>Frontend: ✅ Success
    Frontend-->>User: ✅ "Проверьте email"
    
    User->>Email: Открывает письмо
    User->>Email: Нажимает на ссылку подтверждения
    Email->>Frontend: Переход по ссылке /auth/v1/verify
    Frontend->>Supabase: Подтвердить email
    Supabase->>GoTrue: Обновить статус пользователя
    GoTrue-->>Supabase: ✅ Email подтверждён
    Supabase-->>Frontend: ✅ Создать сессию
    Frontend-->>User: ✅ Перенаправление на dashboard
```

## 🏗️ Архитектура решения

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Форма регистрации]
        B[Страница подтверждения]
    end
    
    subgraph "Backend Layer"
        C[Server Actions]
        D[Supabase Client]
    end
    
    subgraph "Supabase Infrastructure"
        E[GoTrue Auth Service]
        F[PostgreSQL Database]
    end
    
    subgraph "Email Service"
        G[UniSender Go SMTP]
        H[UniSender Go API]
    end
    
    A -->|signUp| C
    C -->|auth.signUp| D
    D -->|API call| E
    E -->|store user| F
    
    E -.->|Вариант 1: SMTP| G
    C -.->|Вариант 2: API| H
    
    G -->|email| I[Email клиент]
    H -->|email| I
    
    I -->|click link| B
    B -->|verify| D
    D -->|confirm| E
    E -->|update| F
    
    style G fill:#90EE90
    style H fill:#87CEEB
```

## 🔧 Конфигурация компонентов

```mermaid
graph LR
    subgraph "Environment Variables"
        A1[GOTRUE_SMTP_HOST]
        A2[GOTRUE_SMTP_PORT]
        A3[GOTRUE_SMTP_USER]
        A4[GOTRUE_SMTP_PASS]
        A5[UNISENDER_API_KEY]
    end
    
    subgraph "GoTrue Config"
        B1[SMTP Settings]
        B2[Email Templates]
        B3[Redirect URLs]
    end
    
    subgraph "Next.js App"
        C1[Server Actions]
        C2[Auth Callbacks]
        C3[Email Utils]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> C3
    
    B1 --> B2
    B2 --> B3
    
    C1 --> C2
    C2 --> C3
    
    style B1 fill:#FFD700
    style C3 fill:#87CEEB
```

## 📝 Сравнение вариантов

| Критерий | Вариант 1: SMTP в GoTrue | Вариант 2: API UniSender |
|----------|--------------------------|--------------------------|
| **Сложность настройки** | Средняя | Низкая |
| **Интеграция с Supabase** | Полная | Частичная |
| **Контроль над шаблонами** | Ограниченный | Полный |
| **Поддержка всех типов email** | Автоматическая | Ручная |
| **Зависимость от Supabase** | Высокая | Низкая |
| **Гибкость** | Средняя | Высокая |
| **Рекомендуется для** | Production | Быстрый старт |

## 🎯 Рекомендация

**Для production рекомендуется Вариант 1** (SMTP в GoTrue), так как:
- ✅ Полная интеграция с Supabase Auth
- ✅ Автоматическая обработка всех типов email
- ✅ Меньше кода для поддержки
- ✅ Стандартный подход

**Вариант 2** (API UniSender) подходит для:
- 🔧 Быстрого прототипирования
- 🎨 Кастомных email шаблонов
- 🔄 Миграции с существующей системы
