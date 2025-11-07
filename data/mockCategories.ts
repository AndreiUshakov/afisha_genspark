// Mock data for event categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  featuredonhero: boolean;
  created_at: string;
  updated_at: string;
}

export const mockCategories: Category[] = [
  {
    id: 'cat-concerts-music',
    name: 'Концерты и Музыка',
    slug: 'concerts-music',
    description: 'Музыкальные концерты, фестивали, выступления артистов',
    icon: 'music',
    color: 'blue',
    featuredonhero: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-theater-performance',
    name: 'Театр и Перформанс',
    slug: 'theater-performance',
    description: 'Театральные спектакли, перформансы, драматические представления',
    icon: 'theater',
    color: 'purple',
    featuredonhero: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-exhibitions-art',
    name: 'Выставки и Искусство',
    slug: 'exhibitions-art',
    description: 'Художественные выставки, галереи, арт-события',
    icon: 'palette',
    color: 'pink',
    featuredonhero: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-festivals',
    name: 'Фестивали',
    slug: 'festivals',
    description: 'Различные фестивали и масштабные мероприятия',
    icon: 'celebration',
    color: 'orange',
    featuredonhero: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-sport',
    name: 'Спорт',
    slug: 'sport',
    description: 'Спортивные мероприятия, соревнования, тренировки',
    icon: 'sport',
    color: 'green',
    featuredonhero: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-children',
    name: 'Для Детей',
    slug: 'children',
    description: 'Детские мероприятия, семейные события',
    icon: 'child',
    color: 'yellow',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-education',
    name: 'Образование и Развитие',
    slug: 'education',
    description: 'Образовательные мероприятия, лекции, мастер-классы',
    icon: 'book',
    color: 'indigo',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-cinema-media',
    name: 'Кино и Медиа',
    slug: 'cinema-media',
    description: 'Кинопоказы, медиа-события, фильмы',
    icon: 'film',
    color: 'red',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-entertainment-nightlife',
    name: 'Развлечения и Ночная жизнь',
    slug: 'entertainment-nightlife',
    description: 'Развлекательные мероприятия, вечеринки, клубы',
    icon: 'party',
    color: 'violet',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-gastronomy',
    name: 'Гастрономия',
    slug: 'gastronomy',
    description: 'Гастрономические события, дегустации, кулинарные мероприятия',
    icon: 'restaurant',
    color: 'amber',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-hobbies-crafts',
    name: 'Хобби и Ремесла',
    slug: 'hobbies-crafts',
    description: 'Рукоделие, ремесла, творческие мастер-классы',
    icon: 'craft',
    color: 'teal',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-ecology-health',
    name: 'Экология и ЗОЖ',
    slug: 'ecology-health',
    description: 'Экологические и здоровьесберегающие мероприятия',
    icon: 'eco',
    color: 'emerald',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-business-networking',
    name: 'Бизнес и Нетворкинг',
    slug: 'business-networking',
    description: 'Бизнес-мероприятия, нетворкинг, профессиональные встречи',
    icon: 'business',
    color: 'slate',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-psychology-spiritual',
    name: 'Психология и Духовное развитие',
    slug: 'psychology-spiritual',
    description: 'Психологические тренинги, духовные практики',
    icon: 'mind',
    color: 'cyan',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'cat-fashion-beauty',
    name: 'Мода и Красота',
    slug: 'fashion-beauty',
    description: 'Модные показы, beauty-события, стиль',
    icon: 'style',
    color: 'rose',
    featuredonhero: false,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
];

// Helper function to get categories featured on hero
export function getCategoriesFeaturedOnHero(): Category[] {
  return mockCategories.filter(category => category.featuredonhero);
}

// Helper function to get category by id
export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find(category => category.id === id);
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find(category => category.slug === slug);
}