# 🚀 Интеграция с Supabase

Полное руководство по интеграции Supabase в проект "Афиша Иркутска"

## 📋 Содержание

- [Почему Supabase?](#почему-supabase)
- [Быстрый старт](#быстрый-старт)
- [Архитектура базы данных](#архитектура-базы-данных)
- [Настройка Supabase](#настройка-supabase)
- [Интеграция в Next.js](#интеграция-в-nextjs)
- [Аутентификация](#аутентификация)
- [API и запросы](#api-и-запросы)
- [Storage для изображений](#storage-для-изображений)
- [Real-time подписки](#real-time-подписки)
- [Edge Functions](#edge-functions)
- [Миграции](#миграции)
- [Best Practices](#best-practices)

---

## 🎯 Почему Supabase?

Supabase идеально подходит для "Афиши Иркутска":

### ✅ Преимущества:

1. **PostgreSQL** - мощная реляционная БД с полной поддержкой SQL
2. **Встроенная аутентификация** - готовые провайдеры (Google, GitHub, Email)
3. **Real-time** - мгновенные обновления для событий
4. **Storage** - хранение изображений мероприятий
5. **Row Level Security** - безопасность на уровне строк
6. **API автоматически** - REST и GraphQL из коробки
7. **Edge Functions** - serverless функции
8. **Бесплатный tier** - достаточно для старта

### 📊 Что мы получим:

- Управление пользователями
- Хранение мероприятий, сообществ, экспертов
- Система избранного и подписок
- Загрузка изображений
- Уведомления в реальном времени
- Email рассылки

---

## ⚡ Быстрый старт

### Шаг 1: Создать проект в Supabase

1. Перейдите на https://supabase.com
2. Создайте аккаунт
3. Нажмите "New Project"
4. Заполните:
   - **Name:** afisha-irkutsk
   - **Database Password:** (сохраните!)
   - **Region:** Southeast Asia (Singapore) - ближайший к России
5. Дождитесь создания (~2 минуты)

### Шаг 2: Получить ключи

В настройках проекта (Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (секретный!)
```

### Шаг 3: Установить зависимости

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Шаг 4: Создать файл .env.local

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🗄️ Архитектура базы данных

### Схема для "Афиши Иркутска"

```sql
-- Включить расширения
create extension if not exists "uuid-ossp";

-- Таблица пользователей (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  user_type text check (user_type in ('user', 'community', 'expert')),
  bio text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица категорий
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  icon text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица сообществ
create table communities (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text not null unique,
  description text,
  avatar_url text,
  cover_url text,
  category_id uuid references categories(id),
  members_count int default 0,
  location text,
  website text,
  social_links jsonb,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица экспертов
create table experts (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade not null unique,
  specialization text not null,
  bio text,
  rating decimal(3, 2) default 0,
  reviews_count int default 0,
  experience_years int,
  achievements text[],
  social_links jsonb,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица мероприятий
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  category_id uuid references categories(id),
  organizer_type text check (organizer_type in ('community', 'expert')),
  organizer_id uuid,
  event_date timestamp with time zone not null,
  end_date timestamp with time zone,
  location text not null,
  address text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  price_type text check (price_type in ('free', 'paid', 'donation')) default 'free',
  price_min decimal(10, 2),
  price_max decimal(10, 2),
  age_restriction text,
  format text check (format in ('offline', 'online', 'hybrid')),
  capacity int,
  registered_count int default 0,
  status text check (status in ('draft', 'published', 'cancelled', 'completed')) default 'draft',
  tags text[],
  external_url text,
  is_featured boolean default false,
  views_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица избранного
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

-- Таблица подписок на сообщества
create table community_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  community_id uuid references communities(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, community_id)
);

-- Таблица подписок на экспертов
create table expert_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  expert_id uuid references experts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, expert_id)
);

-- Таблица регистраций на мероприятия
create table event_registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  status text check (status in ('registered', 'attended', 'cancelled')) default 'registered',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

-- Таблица отзывов
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  expert_id uuid references experts(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблица постов блога
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  category_id uuid references categories(id),
  tags text[],
  status text check (status in ('draft', 'published')) default 'draft',
  views_count int default 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Индексы для производительности
create index events_event_date_idx on events(event_date);
create index events_category_id_idx on events(category_id);
create index events_organizer_idx on events(organizer_type, organizer_id);
create index events_status_idx on events(status);
create index favorites_user_id_idx on favorites(user_id);
create index favorites_event_id_idx on favorites(event_id);
create index community_subscriptions_user_id_idx on community_subscriptions(user_id);
create index expert_subscriptions_user_id_idx on expert_subscriptions(user_id);

-- Функции для обновления updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Триггеры
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_communities_updated_at before update on communities
  for each row execute procedure update_updated_at_column();

create trigger update_events_updated_at before update on events
  for each row execute procedure update_updated_at_column();

create trigger update_experts_updated_at before update on experts
  for each row execute procedure update_updated_at_column();

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table communities enable row level security;
alter table experts enable row level security;
alter table events enable row level security;
alter table favorites enable row level security;
alter table community_subscriptions enable row level security;
alter table expert_subscriptions enable row level security;
alter table event_registrations enable row level security;
alter table reviews enable row level security;
alter table blog_posts enable row level security;

-- Политики RLS (примеры)
-- Профили: все могут читать, только владелец может изменять
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- События: все могут читать опубликованные
create policy "Published events are viewable by everyone"
  on events for select
  using (status = 'published');

create policy "Organizers can manage their events"
  on events for all
  using (
    (organizer_type = 'community' and organizer_id in (
      select id from communities where owner_id = auth.uid()
    ))
    or
    (organizer_type = 'expert' and organizer_id in (
      select id from experts where profile_id = auth.uid()
    ))
  );

-- Избранное: пользователь может управлять только своим
create policy "Users can manage their favorites"
  on favorites for all
  using (auth.uid() = user_id);

-- Подписки: пользователь может управлять только своими
create policy "Users can manage their subscriptions"
  on community_subscriptions for all
  using (auth.uid() = user_id);

create policy "Users can manage their expert subscriptions"
  on expert_subscriptions for all
  using (auth.uid() = user_id);
```

---

## 🔧 Настройка Supabase

### 1. Создайте файл lib/supabase/client.ts

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          user_type: 'user' | 'community' | 'expert';
          bio: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_url: string | null;
          category_id: string | null;
          organizer_type: 'community' | 'expert' | null;
          organizer_id: string | null;
          event_date: string;
          end_date: string | null;
          location: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          price_type: 'free' | 'paid' | 'donation';
          price_min: number | null;
          price_max: number | null;
          age_restriction: string | null;
          format: 'offline' | 'online' | 'hybrid';
          capacity: number | null;
          registered_count: number;
          status: 'draft' | 'published' | 'cancelled' | 'completed';
          tags: string[] | null;
          external_url: string | null;
          is_featured: boolean;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      // ... добавьте другие таблицы
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

// Client Component
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>();
};

// Server Component / Server Actions
export const createSupabaseServerClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
```

### 2. Создайте файл lib/supabase/server.ts

```typescript
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './client';

export const createSupabaseServerComponentClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};
```

### 3. Создайте middleware.ts

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Обновить сессию
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🔐 Аутентификация

### 1. Создайте AuthProvider

```typescript
// app/providers/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Получить текущего пользователя
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Подписаться на изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2. Обновите layout.tsx

```typescript
// app/layout.tsx
import { AuthProvider } from './providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Обновите страницу входа

```typescript
// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">Вход</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Или</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* Google icon */}
            </svg>
            Войти через Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              {/* GitHub icon */}
            </svg>
            Войти через GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4. Создайте callback route

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
```

---

## 📡 API и запросы

### 1. Создайте хуки для работы с данными

```typescript
// lib/hooks/useEvents.ts
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/client';

type Event = Database['public']['Tables']['events']['Row'];

export function useEvents(filters?: {
  category?: string;
  format?: string;
  priceType?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let query = supabase
          .from('events')
          .select('*, categories(*), communities(*)')
          .eq('status', 'published')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true });

        if (filters?.category) {
          query = query.eq('category_id', filters.category);
        }

        if (filters?.format) {
          query = query.eq('format', filters.format);
        }

        if (filters?.priceType) {
          query = query.eq('price_type', filters.priceType);
        }

        if (filters?.dateFrom) {
          query = query.gte('event_date', filters.dateFrom);
        }

        if (filters?.dateTo) {
          query = query.lte('event_date', filters.dateTo);
        }

        const { data, error } = await query;

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  return { events, loading, error };
}

// Хук для избранного
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('event_id')
        .eq('user_id', user.id);

      setFavorites(data?.map(f => f.event_id) || []);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isFavorite = favorites.includes(eventId);

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      
      setFavorites(favorites.filter(id => id !== eventId));
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, event_id: eventId });
      
      setFavorites([...favorites, eventId]);
    }
  };

  return { favorites, loading, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) };
}
```

### 2. Создайте Server Actions

```typescript
// app/actions/events.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/client';

export async function createEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
    price_type: formData.get('price_type') as string,
    format: formData.get('format') as string,
    status: 'draft',
  };

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/events');
  return data;
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const updateData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath(`/events/${eventId}`);
  return data;
}

export async function deleteEvent(eventId: string) {
  const supabase = createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;

  revalidatePath('/events');
}
```

---

## 📦 Storage для изображений

### 1. Настройте Storage в Supabase

В консоли Supabase:
1. Storage → Create bucket
2. Название: `event-images`
3. Public: ✅ (для публичного доступа)
4. Повторите для `avatars` и `community-covers`

### 2. Создайте хелпер для загрузки

```typescript
// lib/supabase/storage.ts
import { createSupabaseClient } from './client';

export async function uploadEventImage(file: File): Promise<string> {
  const supabase = createSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `events/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('event-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('event-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const filePath = `avatars/${userId}.${fileExt}`;

  // Удалить старое фото если есть
  await supabase.storage
    .from('avatars')
    .remove([filePath]);

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(bucket: string, path: string) {
  const supabase = createSupabaseClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}
```

### 3. Компонент для загрузки изображений

```typescript
// components/ImageUpload.tsx
'use client';

import { useState } from 'react';
import { uploadEventImage } from '@/lib/supabase/storage';

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      
      // Предпросмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Загрузка
      const imageUrl = await uploadEventImage(file);
      onUpload(imageUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      
      <label className="block">
        <span className="sr-only">Choose image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>
      
      {uploading && <p className="text-sm text-gray-500">Загрузка...</p>}
    </div>
  );
}
```

---

## ⚡ Real-time подписки

### 1. Подписка на новые события

```typescript
// lib/hooks/useRealtimeEvents.ts
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/client';

type Event = Database['public']['Tables']['events']['Row'];

export function useRealtimeEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Начальная загрузка
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      setEvents(data || []);
    };

    fetchEvents();

    // Подписка на изменения
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: 'status=eq.published',
        },
        (payload) => {
          setEvents((current) => [payload.new as Event, ...current]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          setEvents((current) =>
            current.map((event) =>
              event.id === payload.new.id ? (payload.new as Event) : event
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          setEvents((current) =>
            current.filter((event) => event.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return events;
}
```

### 2. Уведомления о новых подписчиках

```typescript
// lib/hooks/useNotifications.ts
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/providers/AuthProvider';

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!user) return;

    // Подписка на новых подписчиков
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_subscriptions',
          filter: `community_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((current) => [
            {
              type: 'new_subscriber',
              data: payload.new,
              timestamp: new Date(),
            },
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return notifications;
}
```

---

## 🚀 Edge Functions

### 1. Создайте функцию для email рассылки

```typescript
// supabase/functions/send-event-reminder/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Получить события завтра
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: events } = await supabase
      .from('events')
      .select('*, event_registrations(user_id, profiles(email, full_name))')
      .gte('event_date', tomorrow.toISOString())
      .lt('event_date', new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString());

    // Отправить email каждому зарегистрированному
    // (используйте Resend, SendGrid или другой сервис)

    return new Response(
      JSON.stringify({ success: true, sent: events?.length || 0 }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

### 2. Деплой функции

```bash
# Установить Supabase CLI
brew install supabase/tap/supabase

# Логин
supabase login

# Деплой функции
supabase functions deploy send-event-reminder
```

---

## 📈 Best Practices

### 1. Используйте TypeScript типы

```bash
# Генерация типов из базы
npx supabase gen types typescript --project-id your-project-ref > lib/supabase/database.types.ts
```

### 2. Оптимизация запросов

```typescript
// ❌ Плохо - N+1 запросы
const events = await supabase.from('events').select('*');
for (const event of events.data) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', event.category_id)
    .single();
}

// ✅ Хорошо - один запрос с join
const { data: events } = await supabase
  .from('events')
  .select('*, categories(*)');
```

### 3. Кэширование

```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';
import { createSupabaseServerClient } from './supabase/client';

export const getCachedEvents = unstable_cache(
  async () => {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published');
    return data;
  },
  ['events'],
  { revalidate: 60 } // 60 секунд
);
```

### 4. Error handling

```typescript
// lib/utils/error-handler.ts
export function handleSupabaseError(error: any) {
  if (error.code === 'PGRST116') {
    return 'Запись не найдена';
  }
  if (error.code === '23505') {
    return 'Такая запись уже существует';
  }
  if (error.code === '23503') {
    return 'Связанная запись не найдена';
  }
  return error.message || 'Произошла ошибка';
}
```

### 5. Pagination

```typescript
// lib/hooks/usePaginatedEvents.ts
export function usePaginatedEvents(pageSize = 10) {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createSupabaseClient();

  const loadMore = async () => {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data } = await supabase
      .from('events')
      .select('*')
      .range(from, to)
      .order('event_date');

    if (data) {
      setEvents((prev) => [...prev, ...data]);
      setHasMore(data.length === pageSize);
      setPage((p) => p + 1);
    }
  };

  return { events, loadMore, hasMore };
}
```

---

## 📝 Миграции

### 1. Создайте миграцию

```sql
-- supabase/migrations/20240101000000_add_views_count.sql
alter table events add column if not exists views_count int default 0;

create or replace function increment_event_views(event_id uuid)
returns void as $$
  update events
  set views_count = views_count + 1
  where id = event_id;
$$ language sql;
```

### 2. Примените миграцию

```bash
# Локально
supabase db push

# На production
supabase db push --linked
```

---

## 🎯 Чек-лист интеграции

- [ ] Создать проект в Supabase
- [ ] Скопировать ключи в `.env.local`
- [ ] Установить `@supabase/supabase-js` и `@supabase/auth-helpers-nextjs`
- [ ] Создать схему базы данных
- [ ] Настроить RLS политики
- [ ] Создать Supabase клиенты (client, server)
- [ ] Добавить middleware для аутентификации
- [ ] Создать AuthProvider
- [ ] Обновить страницы auth
- [ ] Создать callback route
- [ ] Настроить Storage buckets
- [ ] Создать хуки для работы с данными
- [ ] Добавить Server Actions
- [ ] Настроить Real-time подписки
- [ ] Генерировать TypeScript типы
- [ ] Добавить обработку ошибок
- [ ] Настроить кэширование
- [ ] Создать Edge Functions (опционально)
- [ ] Протестировать все функции

---

## 📚 Дополнительные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

**Готово! Теперь у вас есть полная интеграция с Supabase! 🎉**
