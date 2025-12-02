# Архитектура интеграции Supabase

## Общая схема архитектуры

```mermaid
graph TB
    subgraph "Frontend - Next.js App"
        A[Browser Client Components]
        B[Server Components]
        C[Server Actions]
        D[Route Handlers]
        E[Middleware]
    end
    
    subgraph "Supabase Backend"
        F[PostgreSQL Database]
        G[Auth Service]
        H[Storage Service]
        I[Realtime Service]
        J[Edge Functions]
    end
    
    subgraph "External Services"
        K[OAuth Providers]
        L[Email Service]
        M[CDN]
    end
    
    A -->|createClient browser| F
    A -->|Auth| G
    A -->|Upload/Download| H
    A -->|Subscribe| I
    
    B -->|createClient server| F
    C -->|Server Actions| F
    D -->|API Routes| F
    E -->|Auth Check| G
    
    G -->|OAuth| K
    G -->|Email| L
    H -->|Assets| M
    
    F -->|Triggers| J
    J -->|Webhooks| C
```

## Схема базы данных

```mermaid
erDiagram
    profiles ||--o{ communities : owns
    profiles ||--o{ experts : creates
    profiles ||--o{ events : organizes
    profiles ||--o{ posts : authors
    profiles ||--o{ favorites : has
    profiles ||--o{ event_registrations : registers
    profiles ||--o{ reviews : writes
    profiles ||--o{ community_members : joins
    
    categories ||--o{ events : categorizes
    categories ||--o{ communities : categorizes
    
    communities ||--o{ posts : publishes
    communities ||--o{ events : hosts
    communities ||--o{ community_members : has
    
    experts ||--o{ posts : publishes
    experts ||--o{ reviews : receives
    
    events ||--o{ event_registrations : has
    events ||--o{ favorites : in
    
    communities ||--o{ favorites : in
    experts ||--o{ favorites : in
    
    profiles {
        uuid id PK
        text email UK
        text full_name
        text avatar_url
        text bio
        text role
        boolean is_verified
        timestamptz created_at
        timestamptz updated_at
    }
    
    categories {
        uuid id PK
        text name
        text slug UK
        text color
        boolean featured_on_hero
    }
    
    communities {
        uuid id PK
        uuid owner_id FK
        uuid category_id FK
        text name
        text slug UK
        text description
        text avatar_url
        text cover_url
        integer members_count
        jsonb page_content
        boolean is_published
    }
    
    experts {
        uuid id PK
        uuid profile_id FK
        text name
        text slug UK
        text specialization
        decimal rating
        integer reviews_count
        jsonb services
        boolean is_active
    }
    
    events {
        uuid id PK
        uuid category_id FK
        uuid organizer_id FK
        uuid community_id FK
        text title
        text slug UK
        timestamptz start_date
        timestamptz end_date
        text location_type
        boolean is_free
        decimal price_min
        integer capacity
        boolean is_published
    }
    
    posts {
        uuid id PK
        uuid community_id FK
        uuid expert_id FK
        uuid author_id FK
        text title
        text slug UK
        text content
        boolean is_published
        boolean is_featured
    }
    
    favorites {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        uuid community_id FK
        uuid expert_id FK
    }
    
    event_registrations {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        text status
        text payment_status
    }
    
    reviews {
        uuid id PK
        uuid expert_id FK
        uuid user_id FK
        integer rating
        text comment
        boolean is_published
    }
    
    community_members {
        uuid id PK
        uuid community_id FK
        uuid user_id FK
        text role
        timestamptz joined_at
    }
```

## Поток данных для событий

```mermaid
sequenceDiagram
    participant U as User Browser
    participant SC as Server Component
    participant SA as Server Action
    participant SB as Supabase
    participant DB as PostgreSQL
    participant RT as Realtime
    
    U->>SC: Открыть /events
    SC->>SB: getEvents query
    SB->>DB: SELECT * FROM events
    DB-->>SB: Events data
    SB-->>SC: Events array
    SC-->>U: Render events page
    
    U->>RT: Subscribe to events channel
    RT-->>U: Connection established
    
    U->>SA: Create new event
    SA->>SB: Insert event
    SB->>DB: INSERT INTO events
    DB-->>SB: New event created
    SB-->>SA: Success
    SA-->>U: Redirect to event page
    
    DB->>RT: Trigger postgres_changes
    RT-->>U: New event notification
    U->>U: Update UI with new event
```

## Аутентификация и авторизация

```mermaid
flowchart TD
    A[User visits site] --> B{Authenticated?}
    B -->|No| C[Public content only]
    B -->|Yes| D{Check role}
    
    D -->|user| E[Basic features]
    D -->|expert| F[Expert features + Basic]
    D -->|admin| G[Admin features + All]
    
    E --> H[View events]
    E --> I[Add to favorites]
    E --> J[Register for events]
    
    F --> K[Create expert profile]
    F --> L[Publish posts]
    F --> M[Manage services]
    
    G --> N[Manage all content]
    G --> O[Verify users]
    G --> P[Manage categories]
    
    C --> Q[Login/Register]
    Q --> R{Auth method}
    R -->|Email| S[Email + Password]
    R -->|OAuth| T[Google/VK]
    
    S --> U[Verify email]
    T --> V[OAuth flow]
    
    U --> W[Create profile]
    V --> W
    W --> B
```

## Storage структура

```mermaid
graph TB
    subgraph "Supabase Storage"
        A[avatars bucket]
        B[covers bucket]
        C[events bucket]
        D[communities bucket]
        E[posts bucket]
    end
    
    A --> A1[user_id/avatar.jpg]
    
    B --> B1[communities/community_id/cover.jpg]
    B --> B2[events/event_id/cover.jpg]
    
    C --> C1[event_id/gallery/image1.jpg]
    C --> C2[event_id/gallery/image2.jpg]
    
    D --> D1[community_id/gallery/image1.jpg]
    D --> D2[community_id/albums/album_id/photo1.jpg]
    
    E --> E1[post_id/cover.jpg]
    E --> E2[post_id/content/image1.jpg]
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#e1f5ff
    style E fill:#e1f5ff
```

## RLS Политики - Примеры

```mermaid
flowchart LR
    subgraph "Events Table"
        A[SELECT Policy]
        B[INSERT Policy]
        C[UPDATE Policy]
        D[DELETE Policy]
    end
    
    A --> A1{is_published = true OR organizer_id = auth.uid}
    B --> B1{auth.uid = organizer_id}
    C --> C1{auth.uid = organizer_id}
    D --> D1{auth.uid = organizer_id}
    
    A1 -->|Allow| A2[Return rows]
    A1 -->|Deny| A3[Return empty]
    
    B1 -->|Allow| B2[Insert row]
    B1 -->|Deny| B3[Error]
    
    C1 -->|Allow| C2[Update row]
    C1 -->|Deny| C3[Error]
    
    D1 -->|Allow| D2[Delete row]
    D1 -->|Deny| D3[Error]
```

## Realtime подписки

```mermaid
sequenceDiagram
    participant C as Client Component
    participant RT as Realtime Channel
    participant DB as Database
    participant T as Trigger
    
    C->>RT: Subscribe to events-changes
    RT-->>C: Subscription confirmed
    
    Note over DB: User creates new event
    DB->>T: INSERT trigger
    T->>RT: Broadcast change
    RT-->>C: New event payload
    C->>C: Update local state
    
    Note over DB: User updates event
    DB->>T: UPDATE trigger
    T->>RT: Broadcast change
    RT-->>C: Updated event payload
    C->>C: Update local state
    
    Note over DB: User deletes event
    DB->>T: DELETE trigger
    T->>RT: Broadcast change
    RT-->>C: Deleted event ID
    C->>C: Remove from local state
```

## Миграция данных - процесс

```mermaid
flowchart TD
    A[Start Migration] --> B[Install dependencies]
    B --> C[Setup environment]
    C --> D[Create database schema]
    
    D --> E[Migrate Categories]
    E --> F{Success?}
    F -->|Yes| G[Migrate Events]
    F -->|No| E1[Fix errors]
    E1 --> E
    
    G --> H{Success?}
    H -->|Yes| I[Migrate Communities]
    H -->|No| G1[Fix errors]
    G1 --> G
    
    I --> J{Success?}
    J -->|Yes| K[Migrate Experts]
    J -->|No| I1[Fix errors]
    I1 --> I
    
    K --> L{Success?}
    L -->|Yes| M[Migrate Posts]
    L -->|No| K1[Fix errors]
    K1 --> K
    
    M --> N{Success?}
    N -->|Yes| O[Verify data]
    N -->|No| M1[Fix errors]
    M1 --> M
    
    O --> P[Update components]
    P --> Q[Test functionality]
    Q --> R{All tests pass?}
    R -->|Yes| S[Deploy to production]
    R -->|No| T[Fix issues]
    T --> Q
    
    S --> U[Monitor performance]
    U --> V[End Migration]
```

## Оптимизация запросов

```mermaid
graph TB
    subgraph "Query Optimization Strategy"
        A[Identify slow queries]
        B[Add indexes]
        C[Use select specific columns]
        D[Implement pagination]
        E[Cache results]
        F[Use materialized views]
    end
    
    A --> A1[Check Query Performance in Dashboard]
    B --> B1[CREATE INDEX on frequently queried columns]
    C --> C1[SELECT id, title instead of SELECT *]
    D --> D1[LIMIT and OFFSET or cursor-based]
    E --> E1[Next.js revalidate or Redis]
    F --> F1[For complex aggregations]
    
    A1 --> G[Monitor improvements]
    B1 --> G
    C1 --> G
    D1 --> G
    E1 --> G
    F1 --> G
    
    G --> H{Performance acceptable?}
    H -->|No| A
    H -->|Yes| I[Continue monitoring]
```

## Безопасность - многоуровневая защита

```mermaid
graph TB
    subgraph "Security Layers"
        A[Client Side]
        B[Middleware]
        C[Server Actions]
        D[RLS Policies]
        E[Database Constraints]
    end
    
    A --> A1[Input validation]
    A --> A2[HTTPS only]
    
    B --> B1[Auth check]
    B --> B2[Rate limiting]
    
    C --> C1[Server-side validation]
    C --> C2[Authorization check]
    
    D --> D1[Row-level access control]
    D --> D2[User context filtering]
    
    E --> E1[Foreign key constraints]
    E --> E2[Check constraints]
    E --> E3[Unique constraints]
    
    A1 --> F[Request]
    A2 --> F
    F --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    C2 --> D1
    D1 --> D2
    D2 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> G[Secure Data Access]
```

## Масштабирование стратегия

```mermaid
flowchart TD
    A[Current State] --> B{Traffic increase?}
    B -->|Low| C[Basic setup sufficient]
    B -->|Medium| D[Optimization needed]
    B -->|High| E[Advanced scaling]
    
    D --> D1[Add database indexes]
    D --> D2[Implement caching]
    D --> D3[Optimize queries]
    D --> D4[Use CDN for images]
    
    E --> E1[Database read replicas]
    E --> E2[Connection pooling]
    E --> E3[Horizontal scaling]
    E --> E4[Edge Functions]
    E --> E5[Materialized views]
    
    D1 --> F[Monitor metrics]
    D2 --> F
    D3 --> F
    D4 --> F
    
    E1 --> G[Advanced monitoring]
    E2 --> G
    E3 --> G
    E4 --> G
    E5 --> G
    
    F --> H{Performance OK?}
    G --> H
    
    H -->|Yes| I[Maintain current setup]
    H -->|No| J[Further optimization]
    J --> B
```

## Резервное копирование и восстановление

```mermaid
sequenceDiagram
    participant S as Supabase
    participant B as Backup Service
    participant ST as Storage
    participant A as Admin
    
    Note over S,ST: Automated Daily Backups
    S->>B: Trigger daily backup
    B->>S: Create database snapshot
    S-->>B: Snapshot created
    B->>ST: Store snapshot
    ST-->>B: Stored successfully
    
    Note over A,ST: Disaster Recovery
    A->>B: Request restore
    B->>ST: Fetch snapshot
    ST-->>B: Snapshot data
    B->>S: Restore database
    S-->>B: Restore complete
    B-->>A: Database restored
    
    Note over S,A: Verification
    A->>S: Verify data integrity
    S-->>A: Data verified
```

## Мониторинг и алерты

```mermaid
graph TB
    subgraph "Monitoring Stack"
        A[Supabase Dashboard]
        B[Database Metrics]
        C[API Metrics]
        D[Storage Metrics]
        E[Auth Metrics]
    end
    
    subgraph "Alerts"
        F[Slow Queries]
        G[High Error Rate]
        H[Storage Limit]
        I[Connection Pool]
    end
    
    B --> F
    C --> G
    D --> H
    B --> I
    
    F --> J[Email notification]
    G --> J
    H --> J
    I --> J
    
    J --> K[Admin Action Required]
    
    A --> L[Weekly Reports]
    B --> L
    C --> L
    D --> L
    E --> L
```

## Развертывание и CI/CD

```mermaid
flowchart LR
    A[Git Push] --> B[GitHub Actions]
    B --> C{Tests Pass?}
    C -->|No| D[Notify Developer]
    C -->|Yes| E[Build Application]
    
    E --> F[Run Migrations]
    F --> G{Migration Success?}
    G -->|No| H[Rollback]
    G -->|Yes| I[Deploy to Staging]
    
    I --> J[Run E2E Tests]
    J --> K{Tests Pass?}
    K -->|No| L[Notify Team]
    K -->|Yes| M[Deploy to Production]
    
    M --> N[Health Check]
    N --> O{Healthy?}
    O -->|No| P[Auto Rollback]
    O -->|Yes| Q[Monitor Metrics]
    
    H --> D
    L --> D
    P --> D
```

---

## Ключевые принципы архитектуры

### 1. Разделение ответственности
- **Frontend**: UI/UX, валидация форм, оптимистичные обновления
- **Backend**: Бизнес-логика, авторизация, хранение данных
- **Edge**: Кэширование, CDN, геораспределение

### 2. Безопасность на всех уровнях
- Client-side валидация (UX)
- Server-side валидация (безопасность)
- RLS политики (защита данных)
- Database constraints (целостность данных)

### 3. Производительность
- Индексы для быстрых запросов
- Кэширование на уровне Next.js
- CDN для статических ресурсов
- Оптимизация изображений

### 4. Масштабируемость
- Горизонтальное масштабирование через Supabase
- Stateless архитектура
- Микросервисы через Edge Functions
- Асинхронная обработка через очереди

### 5. Надежность
- Автоматические бэкапы
- Мониторинг и алерты
- Graceful degradation
- Error boundaries

---

## Технологический стек

### Frontend
- **Next.js 16** - React framework с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **CraftJS** - Page builder для сообществ

### Backend
- **Supabase** - BaaS платформа
- **PostgreSQL** - Реляционная БД
- **PostgREST** - Автоматический REST API
- **GoTrue** - Аутентификация

### DevOps
- **GitHub Actions** - CI/CD
- **Vercel/Amvera** - Хостинг
- **Supabase CLI** - Управление миграциями

### Мониторинг
- **Supabase Dashboard** - Метрики БД
- **Vercel Analytics** - Frontend метрики
- **Sentry** - Error tracking (опционально)

---

## Заключение

Данная архитектура обеспечивает:
- ✅ Безопасность через многоуровневую защиту
- ✅ Производительность через оптимизацию и кэширование
- ✅ Масштабируемость через правильную структуру
- ✅ Надежность через мониторинг и бэкапы
- ✅ Удобство разработки через TypeScript и современные инструменты