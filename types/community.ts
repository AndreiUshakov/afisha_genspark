/**
 * Типы для расширенной модели сообщества
 */

/**
 * Социальные ссылки сообщества
 */
export interface SocialLinks {
  vk?: string;
  telegram?: string;
  max?: string;
  website?: string;
  facebook?: string;
}

/**
 * Фотография в альбоме
 */
export interface Photo {
  id: string;
  url: string;
  thumbnail_url: string;
  caption?: string;
  order: number;
  uploaded_at: string;
}

/**
 * Альбом фотографий
 */
export interface PhotoAlbum {
  id: string;
  title: string;
  description?: string;
  photos: Photo[];
  cover_photo_id?: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean; // показывать на главной странице
}

/**
 * Расширенная модель сообщества
 */
export interface Community {
  // Базовые поля
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string; // краткое описание (до 200 символов)
  
  // Визуальные элементы
  avatar_url: string;
  cover_url: string;
  
  // Категоризация
  category_id: string;
  category_name?: string;
  
  // Статистика
  members_count: number;
  
  // Контактная информация
  location: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  social_links?: SocialLinks;
  
  // Новые поля для расширенного функционала
  full_description?: string; // WYSIWYG контент (HTML)
  target_audience?: string[]; // "для кого" - массив выбранных опций
  wishes?: string[]; // "я хочу" - массив выбранных опций
  age_categories?: string[]; // возрастные категории
  
  // Контент страницы
  page_content?: string; // JSON сериализованный CraftJS контент
  photo_albums?: PhotoAlbum[]; // альбомы фотографий
  
  // Статусы
  is_verified: boolean;
  is_published: boolean;
  draft_step?: 1 | 2; // текущий шаг черновика
  
  // Временные метки
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * Данные формы для Шага 1
 */
export interface Step1FormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  full_description: string;
  target_audience: string[];
  wishes: string[];
  age_categories: string[];
  location: string;
  contact_email: string;
  contact_phone?: string;
  social_links: SocialLinks;
}

/**
 * Данные формы для Шага 2
 */
export interface Step2FormData {
  cover_image: File | null;
  logo_image: File | null;
  page_content: string; // CraftJS JSON
  photo_albums: PhotoAlbum[];
}

/**
 * Полные данные формы создания сообщества
 */
export interface CreateCommunityFormData extends Step1FormData, Step2FormData {
  current_step: 1 | 2;
}

/**
 * Опции для фильтров
 */
export const FILTER_OPTIONS = {
  // "Для кого" - социальная аудитория
  TARGET_AUDIENCE: [
    'Для родителей с детьми',
    'Для школьных классов',
    'Для студентов',
    'Для работающих',
    'Для предпринимателей',
    'Для людей с ОВЗ',
    'Для творческих людей',
    'Для спортсменов',
    'Для пенсионеров',
    'Для волонтёров',
    'Для иностранцев/экспатов',
    'Для религиозных общин',
    'Для профессиональных сообществ',
    'Для молодежных объединений',
    'Для семейных пар',
    'Для одиноких',
    'Для учителей и педагогов',
    'Для общественных организаций',
    'Для безработных',
    'Для многодетных семей',
    'Для военнослужащих и ветеранов',
    'Для туристов и гостей города',
    'Для всех социально активных',
    'Для всех желающих'
  ],
  
  // "Я хочу" - желания/цели
  WISHES: [
    'Поиграть',
    'Посмотреть',
    'Учиться',
    'Познакомиться',
    'Удивиться',
    'Вдохновиться',
    'Оттянуться',
    'Поразмышлять',
    'Отдохнуть',
    'Развлечься',
    'Потусоваться',
    'Получить опыт',
    'Проявить себя',
    'Погулять',
    'Почувствовать атмосферу',
    'Творить',
    'Исследовать'
  ],
  
  // Возрастные категории
  AGE_CATEGORIES: [
    'Малыши 0+',
    'Младшие школьники 6+',
    'Старшие школьники 12+',
    'Подростки 16+',
    'Взрослые 18+'
  ],
  
  // Категории сообществ
  CATEGORIES: [
    { id: 'cat-culture', name: 'Культура и искусство' },
    { id: 'cat-sport', name: 'Спорт и здоровье' },
    { id: 'cat-education', name: 'Образование' },
    { id: 'cat-hobby', name: 'Хобби и увлечения' },
    { id: 'cat-business', name: 'Бизнес и карьера' },
    { id: 'cat-social', name: 'Социальные проекты' },
    { id: 'cat-tech', name: 'Технологии' },
    { id: 'cat-family', name: 'Семья и дети' },
    { id: 'cat-ecology', name: 'Экология' },
    { id: 'cat-other', name: 'Другое' }
  ]
} as const;