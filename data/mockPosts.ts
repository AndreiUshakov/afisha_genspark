// Mock data for community and expert posts
// This data will be replaced with real Supabase queries later

export interface Post {
  id: string;
  community_id?: string;
  expert_id?: string;
  author_name: string;
  author_avatar?: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image_url: string;
  category?: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export const mockPosts: Post[] = [
  {
    id: '1',
    community_id: '1',
    author_name: 'IT-сообщество Иркутска',
    author_avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    title: 'Как организовать успешный IT-митап: опыт нашего сообщества',
    slug: 'kak-organizovat-uspeshnyy-it-mitap',
    excerpt: 'Делимся опытом проведения технических встреч и советами для начинающих организаторов',
    cover_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'Технологии',
    is_published: true,
    is_featured: true,
    views_count: 2543,
    likes_count: 187,
    comments_count: 34,
    created_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
  },
  {
    id: '2',
    community_id: '2',
    author_name: 'Байкальские художники',
    author_avatar: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
    title: 'Весенний пленэр на Байкале: как подготовиться',
    slug: 'vesenniy-plener-na-baykale',
    excerpt: 'Советы по выбору материалов и локаций для рисования на природе',
    cover_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    category: 'Искусство',
    is_published: true,
    is_featured: true,
    views_count: 1876,
    likes_count: 143,
    comments_count: 28,
    created_at: '2025-02-18T14:00:00Z',
    updated_at: '2025-02-18T14:00:00Z',
  },
  {
    id: '3',
    community_id: '3',
    author_name: 'Беговой клуб "Сибирский марафон"',
    author_avatar: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
    title: 'Подготовка к первому марафону: план тренировок',
    slug: 'podgotovka-k-pervomu-marafonu',
    excerpt: '16-недельная программа для тех, кто хочет пробежать свои первые 42 км',
    cover_image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    category: 'Спорт',
    is_published: true,
    is_featured: true,
    views_count: 3421,
    likes_count: 256,
    comments_count: 67,
    created_at: '2025-02-22T09:00:00Z',
    updated_at: '2025-02-22T09:00:00Z',
  },
  {
    id: '4',
    community_id: '4',
    author_name: 'Молодые родители Иркутска',
    author_avatar: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400',
    title: 'Топ-10 развивающих занятий для детей 3-5 лет',
    slug: 'top-10-razvivayushchikh-zanyatiy',
    excerpt: 'Проверенные активности для развития творческих способностей малышей',
    cover_image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    category: 'Семья',
    is_published: true,
    is_featured: true,
    views_count: 2987,
    likes_count: 234,
    comments_count: 89,
    created_at: '2025-02-21T11:00:00Z',
    updated_at: '2025-02-21T11:00:00Z',
  },
  {
    id: '5',
    community_id: '5',
    author_name: 'Экологи Байкала',
    author_avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    title: 'Итоги весенней уборки берегов: собрали 3 тонны мусора',
    slug: 'itogi-vesenney-uborki-beregov',
    excerpt: 'Отчет о проведенных субботниках и планы на летний сезон',
    cover_image_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
    category: 'Экология',
    is_published: true,
    is_featured: true,
    views_count: 1654,
    likes_count: 198,
    comments_count: 45,
    created_at: '2025-02-23T13:00:00Z',
    updated_at: '2025-02-23T13:00:00Z',
  },
  {
    id: '6',
    community_id: '6',
    author_name: 'Книжный клуб "Читаем вместе"',
    author_avatar: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    title: 'Обзор новинок современной российской прозы',
    slug: 'obzor-novinok-sovremennoy-prozy',
    excerpt: 'Рекомендации книг для весеннего чтения от участников клуба',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    category: 'Литература',
    is_published: true,
    is_featured: true,
    views_count: 1432,
    likes_count: 167,
    comments_count: 52,
    created_at: '2025-02-19T15:00:00Z',
    updated_at: '2025-02-19T15:00:00Z',
  },
  {
    id: '7',
    community_id: '1',
    author_name: 'IT-сообщество Иркутска',
    author_avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    title: 'Обзор технологических трендов 2025 года',
    slug: 'obzor-tekhnologicheskikh-trendov-2025',
    excerpt: 'Что будет актуально в мире IT в ближайшие месяцы',
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    category: 'Технологии',
    is_published: true,
    is_featured: false,
    views_count: 987,
    likes_count: 76,
    comments_count: 19,
    created_at: '2025-02-15T12:00:00Z',
    updated_at: '2025-02-15T12:00:00Z',
  },
  {
    id: '8',
    community_id: '3',
    author_name: 'Беговой клуб "Сибирский марафон"',
    author_avatar: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
    title: 'Правильное питание для бегунов: что есть до и после тренировки',
    slug: 'pravilnoe-pitanie-dlya-begunov',
    excerpt: 'Рекомендации по питанию для улучшения спортивных результатов',
    cover_image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    category: 'Спорт',
    is_published: true,
    is_featured: false,
    views_count: 1234,
    likes_count: 98,
    comments_count: 31,
    created_at: '2025-02-17T10:00:00Z',
    updated_at: '2025-02-17T10:00:00Z',
  },
];

// Helper function to get featured posts
export function getFeaturedPosts(limit: number = 6): Post[] {
  return mockPosts
    .filter(post => post.is_published && post.is_featured)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// Helper function to get post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find(post => post.slug === slug);
}

// Helper function to format date
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}