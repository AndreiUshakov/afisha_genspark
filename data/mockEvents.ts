// Mock data for events - matches Supabase schema
// This data will be replaced with real Supabase queries later

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  cover_image_url: string;
  category_id: string;
  category_name?: string;
  organizer_type: 'individual' | 'community' | 'commercial';
  organizer_id?: string;
  organizer_name?: string;
  organizer_avatar?: string;
  event_date: string;
  end_date?: string;
  location: string;
  address: string;
  price_type: 'free' | 'paid' | 'donation';
  price_min?: number;
  price_max?: number;
  age_restriction?: string;
  format: 'online' | 'offline' | 'hybrid';
  capacity?: number;
  registered_count: number;
  tags: string[];
  views_count: number;
  favorites_count: number;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  social_links?: {
    vk?: string;
    telegram?: string;
    instagram?: string;
  };
  requirements?: string;
  program?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Байкальский фестиваль музыки',
    slug: 'baykalskiy-festival-muzyki',
    description: 'Крупнейший музыкальный фестиваль у озера Байкал с участием известных артистов со всей России.',
    full_description: `Байкальский фестиваль музыки — это уникальное событие, которое объединяет любителей музыки со всей страны. Фестиваль проходит на живописном берегу озера Байкал и предлагает незабываемые впечатления от выступлений известных музыкантов.

**Программа фестиваля:**

**День 1 (15 марта):**
- 14:00 - Открытие фестиваля
- 15:00 - Выступление местных групп
- 17:00 - Концерт приглашенных артистов
- 20:00 - Главное шоу вечера

**День 2 (16 марта):**
- 12:00 - Дневные выступления
- 15:00 - Мастер-классы от музыкантов
- 18:00 - Вечерний концерт
- 21:00 - Закрытие фестиваля

Фестиваль включает в себя несколько сцен с разными музыкальными направлениями: рок, джаз, электронная музыка и фолк. Помимо концертов, посетители могут насладиться местной кухней, посетить выставку декоративно-прикладного искусства и принять участие в мастер-классах.

**Что взять с собой:**
- Удобную обувь и одежду по погоде
- Головной убор и солнцезащитный крем
- Воду и легкие перекусы
- Коврик или раскладное кресло

**Важная информация:**
- На территории фестиваля работает гардероб
- Доступна парковка (места ограничены)
- Работает пункт медицинской помощи
- Запрещено приносить алкоголь, стеклянную посуду и пиротехнику`,
    cover_image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    category_id: 'cat-music',
    category_name: 'Музыка',
    organizer_type: 'community',
    organizer_id: 'org-1',
    organizer_name: 'Сообщество музыкантов Иркутска',
    organizer_avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    event_date: '2025-03-15T14:00:00Z',
    end_date: '2025-03-16T22:00:00Z',
    location: 'Берег озера Байкал',
    address: 'Иркутская область, поселок Листвянка, ул. Набережная, 1',
    price_type: 'paid',
    price_min: 1500,
    price_max: 5000,
    age_restriction: '16+',
    format: 'offline',
    capacity: 5000,
    registered_count: 3421,
    tags: ['музыка', 'фестиваль', 'байкал', 'концерт', 'на природе'],
    views_count: 15234,
    favorites_count: 892,
    contact_phone: '+7 (902) 123-45-67',
    contact_email: 'info@baykalfest.ru',
    website_url: 'https://baykalfest.ru',
    social_links: {
      vk: 'https://vk.com/baykalfest',
      telegram: 'https://t.me/baykalfest',
      instagram: 'https://instagram.com/baykalfest',
    },
    requirements: 'Необходимо иметь при себе паспорт или другой документ, удостоверяющий личность. Дети до 16 лет только в сопровождении взрослых.',
    program: 'Двухдневная программа с выступлениями более 20 артистов, мастер-классы, фуд-корт, выставка.',
    is_featured: true,
    is_published: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-02-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Выставка современного искусства',
    slug: 'vystavka-sovremennogo-iskusstva',
    description: 'Коллекция работ местных и приглашенных художников в галерее им. Сукачева',
    full_description: `Выставка современного искусства представляет собрание работ талантливых художников из Иркутска и других городов России. Экспозиция охватывает различные направления и техники современного искусства.

**О выставке:**

Выставка включает более 50 работ в различных жанрах: живопись, графика, скульптура, инсталляции и видео-арт. Каждое произведение — это уникальный взгляд автора на современный мир, его проблемы и красоту.

**Особенности выставки:**
- Интерактивные инсталляции
- Видео-арт в отдельном зале
- Экскурсии с куратором (по выходным в 14:00 и 16:00)
- Мастер-классы от художников (каждую субботу)

**Представленные художники:**
- Анна Соколова (Иркутск) - абстракционизм
- Дмитрий Волков (Москва) - фигуративная живопись
- Елена Петрова (Иркутск) - инсталляции
- Михаил Кузнецов (Санкт-Петербург) - видео-арт

Выставка будет интересна как искушенным ценителям искусства, так и тем, кто только начинает знакомство с современным искусством. Вход свободный, приглашаем всех желающих!`,
    cover_image_url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
    category_id: 'cat-culture',
    category_name: 'Культура',
    organizer_type: 'commercial',
    organizer_id: 'org-2',
    organizer_name: 'Галерея им. Сукачева',
    organizer_avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200',
    event_date: '2025-03-01T10:00:00Z',
    end_date: '2025-03-31T18:00:00Z',
    location: 'Галерея им. Сукачева',
    address: 'г. Иркутск, ул. Ленина, 5',
    price_type: 'free',
    age_restriction: '0+',
    format: 'offline',
    capacity: 200,
    registered_count: 0,
    tags: ['искусство', 'выставка', 'живопись', 'культура'],
    views_count: 8921,
    favorites_count: 456,
    contact_phone: '+7 (3952) 33-44-55',
    contact_email: 'gallery@sukachev.ru',
    website_url: 'https://sukachev.gallery',
    social_links: {
      vk: 'https://vk.com/sukachevgallery',
      telegram: 'https://t.me/sukachevgallery',
    },
    requirements: 'Фото- и видеосъемка только после согласования с администрацией галереи.',
    program: 'Выставка работает ежедневно с 10:00 до 18:00, выходной - понедельник. Экскурсии по выходным.',
    is_featured: false,
    is_published: true,
    created_at: '2025-01-15T12:00:00Z',
    updated_at: '2025-02-10T09:00:00Z',
  },
  {
    id: '3',
    title: 'Мастер-класс по гончарному делу',
    slug: 'master-klass-po-goncharnomu-delu',
    description: 'Научитесь создавать керамические изделия на гончарном круге',
    full_description: `Приглашаем вас на увлекательный мастер-класс по гончарному делу! Под руководством опытного мастера вы узнаете основы работы с глиной и создадите свое собственное керамическое изделие.

**Что вас ждет:**

На мастер-классе вы:
- Познакомитесь с историей гончарного искусства
- Узнаете о свойствах глины и ее подготовке
- Научитесь работать на гончарном круге
- Создадите собственное изделие (чашку, вазу или тарелку)
- Узнаете о процессе обжига и глазурования

**Программа мастер-класса:**
- 14:00-14:30 - Знакомство, рассказ о технике
- 14:30-16:00 - Практическая работа на гончарном круге
- 16:00-16:30 - Декорирование изделия
- 16:30-17:00 - Завершение работы, чаепитие

**Важная информация:**
- Все материалы и инструменты предоставляются
- Необходима удобная одежда, которую не жалко испачкать
- Фартуки предоставляются
- Готовое изделие можно будет забрать через неделю после обжига

**О мастере:**
Ирина Смирнова - керамист с 15-летним стажем, выпускница Строгановского училища, участница множества выставок. Обучение проводится в дружелюбной атмосфере, подходит для начинающих.

Количество мест ограничено - не более 8 человек в группе для обеспечения индивидуального подхода к каждому участнику.`,
    cover_image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    category_id: 'cat-education',
    category_name: 'Образование',
    organizer_type: 'individual',
    organizer_id: 'org-3',
    organizer_name: 'Ирина Смирнова',
    organizer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    event_date: '2025-03-20T14:00:00Z',
    end_date: '2025-03-20T17:00:00Z',
    location: 'Творческая мастерская "Глиняная птица"',
    address: 'г. Иркутск, ул. Карла Маркса, 45, 2 этаж',
    price_type: 'paid',
    price_min: 2500,
    age_restriction: '12+',
    format: 'offline',
    capacity: 8,
    registered_count: 5,
    tags: ['мастер-класс', 'гончарное дело', 'керамика', 'творчество', 'handmade'],
    views_count: 3421,
    favorites_count: 234,
    contact_phone: '+7 (902) 765-43-21',
    contact_email: 'pottery@example.com',
    social_links: {
      vk: 'https://vk.com/pottery_irkutsk',
      instagram: 'https://instagram.com/pottery_irkutsk',
    },
    requirements: 'Удобная одежда, которую не жалко испачкать. Длинные волосы необходимо собрать.',
    program: 'Теоретическая часть, практическая работа на гончарном круге, декорирование, чаепитие.',
    is_featured: true,
    is_published: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-18T16:00:00Z',
  },
  {
    id: '4',
    title: 'Забег "Весенний Байкал"',
    slug: 'zabeg-vesenniy-baykal',
    description: 'Ежегодный забег вдоль берега озера Байкал на дистанции 5 и 10 км',
    full_description: `Приглашаем всех любителей бега принять участие в традиционном весеннем забеге "Весенний Байкал"! Это отличная возможность пробежать по живописному маршруту вдоль легендарного озера и открыть новый спортивный сезон.

**О забеге:**

Забег проводится уже 7-й год подряд и собирает более 1000 участников из Иркутской области и других регионов. Маршрут проходит вдоль берега Байкала, открывая потрясающие виды на озеро и окружающие горы.

**Дистанции:**
- 5 км - для начинающих и любителей
- 10 км - для опытных бегунов

**Программа мероприятия:**
- 08:00-09:30 - Регистрация участников, выдача стартовых номеров
- 09:30-09:45 - Разминка с инструктором
- 10:00 - Старт забега на 10 км
- 10:15 - Старт забега на 5 км
- 11:30-13:00 - Финиш, награждение победителей
- 13:00-14:00 - Фуршет для всех участников

**В стоимость входит:**
- Стартовый пакет (номер, чип для хронометража)
- Футболка участника
- Медаль финишера
- Питание на дистанции
- Фуршет после забега
- Фотографии с мероприятия

**Награждение:**
Победители в каждой возрастной категории (18-29, 30-39, 40-49, 50+) получают медали и призы от спонсоров.

**Требования:**
- Возраст от 16 лет (до 18 лет - с разрешения родителей)
- Медицинская справка не требуется, но рекомендуется
- Спортивная одежда по погоде, удобная беговая обувь

Регистрация онлайн до 25 апреля. Количество мест ограничено!`,
    cover_image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    category_id: 'cat-sport',
    category_name: 'Спорт',
    organizer_type: 'community',
    organizer_id: 'org-4',
    organizer_name: 'Клуб бега "Байкальский марафон"',
    organizer_avatar: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=200',
    event_date: '2025-04-28T10:00:00Z',
    end_date: '2025-04-28T14:00:00Z',
    location: 'Поселок Листвянка',
    address: 'Иркутская область, п. Листвянка, набережная Байкала',
    price_type: 'paid',
    price_min: 800,
    price_max: 1200,
    age_restriction: '16+',
    format: 'offline',
    capacity: 1000,
    registered_count: 567,
    tags: ['спорт', 'бег', 'байкал', 'здоровье', 'марафон'],
    views_count: 12456,
    favorites_count: 678,
    contact_phone: '+7 (902) 555-66-77',
    contact_email: 'info@baykalrun.ru',
    website_url: 'https://baykalrun.ru',
    social_links: {
      vk: 'https://vk.com/baykalrun',
      telegram: 'https://t.me/baykalrun',
      instagram: 'https://instagram.com/baykalrun',
    },
    requirements: 'Спортивная форма, медицинская справка рекомендуется. Регистрация обязательна.',
    program: 'Регистрация, разминка, забег на 5 и 10 км, награждение, фуршет.',
    is_featured: true,
    is_published: true,
    created_at: '2025-01-20T11:00:00Z',
    updated_at: '2025-02-20T14:00:00Z',
  },
  {
    id: '5',
    title: 'Лекция о космосе для детей',
    slug: 'lektsiya-o-kosmose-dlya-detey',
    description: 'Увлекательный рассказ о планетах, звездах и космических путешествиях',
    full_description: `Приглашаем юных исследователей космоса на увлекательную лекцию о тайнах Вселенной! Астроном и популяризатор науки Алексей Петров расскажет о планетах Солнечной системы, звездах и космических путешествиях.

**Программа лекции:**

**Часть 1: Солнечная система (30 минут)**
- Что такое Солнечная система?
- Планеты-гиганты и планеты земной группы
- Интересные факты о каждой планете
- Луна и ее влияние на Землю

**Часть 2: Звезды и галактики (30 минут)**
- Что такое звезды и как они рождаются?
- Созвездия: как их находить на небе
- Наша галактика - Млечный Путь
- Другие галактики во Вселенной

**Часть 3: Космические путешествия (30 минут)**
- История освоения космоса
- Первые космонавты
- Современные космические станции
- Планы по освоению Марса

**Часть 4: Вопросы и ответы (30 минут)**
- Дети могут задать любые вопросы о космосе
- Просмотр коротких видеороликов
- Раздача материалов (карта звездного неба)

**О лекторе:**
Алексей Петров - астроном, кандидат физико-математических наук, сотрудник Иркутского планетария. Автор популярного YouTube-канала о космосе с аудиторией более 100 тысяч подписчиков.

**Что получат дети:**
- Увлекательный рассказ с показом фотографий и видео
- Карту звездного неба в подарок
- Возможность посмотреть в телескоп (если позволит погода)
- Ответы на все свои вопросы о космосе

Лекция построена в интерактивном формате - дети не только слушают, но и участвуют в обсуждении, отгадывают космические загадки и делятся своими знаниями.

Рекомендуемый возраст: 7-12 лет. Родители могут присутствовать бесплатно.`,
    cover_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    category_id: 'cat-education',
    category_name: 'Образование',
    organizer_type: 'commercial',
    organizer_id: 'org-5',
    organizer_name: 'Иркутский планетарий',
    organizer_avatar: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200',
    event_date: '2025-03-25T15:00:00Z',
    end_date: '2025-03-25T17:00:00Z',
    location: 'Иркутский планетарий',
    address: 'г. Иркутск, ул. Декабрьских Событий, 44',
    price_type: 'paid',
    price_min: 400,
    age_restriction: '7+',
    format: 'offline',
    capacity: 50,
    registered_count: 38,
    tags: ['образование', 'дети', 'космос', 'наука', 'лекция'],
    views_count: 5678,
    favorites_count: 345,
    contact_phone: '+7 (3952) 77-88-99',
    contact_email: 'planetarium@example.com',
    website_url: 'https://irkutsk-planetarium.ru',
    social_links: {
      vk: 'https://vk.com/irkutskplanetarium',
      telegram: 'https://t.me/irkutskplanetarium',
    },
    requirements: 'Рекомендуется для детей 7-12 лет. Родители могут присутствовать бесплатно.',
    program: 'Интерактивная лекция с видео, карта звездного неба в подарок, наблюдение в телескоп.',
    is_featured: false,
    is_published: true,
    created_at: '2025-02-05T13:00:00Z',
    updated_at: '2025-02-22T10:00:00Z',
  },
  {
    id: '6',
    title: 'Фестиваль уличной еды',
    slug: 'festival-ulichnoy-edy',
    description: 'Попробуйте блюда кухонь мира от лучших фуд-траков города',
    full_description: `Главное гастрономическое событие весны - Фестиваль уличной еды! Более 30 фуд-траков представят блюда разных кухонь мира, а также пройдут кулинарные мастер-классы и конкурсы.

**Что вас ждет:**

**Кухни мира:**
- Азиатская кухня: суши, рамен, том-ям, пад-тай
- Европейская кухня: паста, пицца, бургеры, хот-доги
- Восточная кухня: шаурма, плов, лагман, манты
- Русская кухня: блины, пироги, шашлык
- Десерты: вафли, блинчики, мороженое, сладкая вата

**Развлекательная программа:**

**Суббота:**
- 12:00 - Открытие фестиваля
- 13:00 - Мастер-класс "Как готовить бургеры"
- 15:00 - Конкурс на самого быстрого едока
- 17:00 - Живая музыка
- 19:00 - Вечернее шоу

**Воскресенье:**
- 12:00 - Детская программа
- 14:00 - Мастер-класс по приготовлению пиццы
- 16:00 - Конкурс на лучший рецепт от посетителей
- 18:00 - Концерт местных групп
- 20:00 - Закрытие фестиваля

**Особенности:**
- Более 30 участников
- Живая музыка весь день
- Детская зона с аниматорами
- Фотозона
- Продажа фермерских продуктов
- Мастер-классы от шеф-поваров

**Цены:**
Вход свободный! Цены на блюда от 150 до 800 рублей. Средний чек - 500-700 рублей. Принимаются наличные и карты.

**Инфраструктура:**
- Зона отдыха с навесами
- Детская площадка
- Туалеты
- Бесплатная питьевая вода
- Парковка

Приходите всей семьей! Фестиваль будет интересен и взрослым, и детям. Не забудьте взять с собой хорошее настроение и аппетит!`,
    cover_image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category_id: 'cat-food',
    category_name: 'Еда',
    organizer_type: 'commercial',
    organizer_id: 'org-6',
    organizer_name: 'Event Agency "Праздник"',
    organizer_avatar: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200',
    event_date: '2025-05-10T12:00:00Z',
    end_date: '2025-05-11T20:00:00Z',
    location: 'Площадь Кирова',
    address: 'г. Иркутск, площадь Кирова',
    price_type: 'free',
    age_restriction: '0+',
    format: 'offline',
    capacity: 10000,
    registered_count: 0,
    tags: ['еда', 'фестиваль', 'стритфуд', 'семья', 'развлечения'],
    views_count: 18934,
    favorites_count: 1234,
    contact_phone: '+7 (902) 999-88-77',
    contact_email: 'foodfest@example.com',
    website_url: 'https://streetfood-irkutsk.ru',
    social_links: {
      vk: 'https://vk.com/streetfood_irk',
      telegram: 'https://t.me/streetfood_irk',
      instagram: 'https://instagram.com/streetfood_irk',
    },
    requirements: 'Вход свободный. Принимаются наличные и карты.',
    program: 'Более 30 фуд-траков, мастер-классы, конкурсы, живая музыка, детская зона.',
    is_featured: true,
    is_published: true,
    created_at: '2025-02-10T12:00:00Z',
    updated_at: '2025-02-25T15:00:00Z',
  },
];

// Helper function to get event by slug
export function getEventBySlug(slug: string): Event | undefined {
  return mockEvents.find(event => event.slug === slug);
}

// Helper function to get related events (same category, excluding current)
export function getRelatedEvents(currentSlug: string, limit: number = 3): Event[] {
  const currentEvent = getEventBySlug(currentSlug);
  if (!currentEvent) return [];
  
  return mockEvents
    .filter(event => 
      event.slug !== currentSlug && 
      event.category_id === currentEvent.category_id &&
      event.is_published
    )
    .slice(0, limit);
}

// Helper function to format price
export function formatPrice(event: Event): string {
  if (event.price_type === 'free') {
    return 'Бесплатно';
  }
  if (event.price_type === 'donation') {
    return 'Донейшн';
  }
  if (event.price_min && event.price_max && event.price_min !== event.price_max) {
    return `${event.price_min} - ${event.price_max} ₽`;
  }
  if (event.price_min) {
    return `${event.price_min} ₽`;
  }
  return 'Уточняется';
}

// Helper function to format date
export function formatEventDate(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  if (!endDate) {
    return start.toLocaleDateString('ru-RU', options);
  }
  
  const end = new Date(endDate);
  const startDateStr = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const endDateStr = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  
  if (startDateStr === endDateStr) {
    return `${startDateStr}, ${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return `${startDateStr} - ${endDateStr}`;
}

// Helper function to get capacity status
export function getCapacityStatus(event: Event): { text: string; percentage: number; status: 'available' | 'limited' | 'full' } {
  if (!event.capacity) {
    return { text: 'Без ограничений', percentage: 0, status: 'available' };
  }
  
  const percentage = (event.registered_count / event.capacity) * 100;
  
  if (percentage >= 100) {
    return { text: 'Мест нет', percentage: 100, status: 'full' };
  }
  if (percentage >= 80) {
    return { text: `Осталось ${event.capacity - event.registered_count} мест`, percentage, status: 'limited' };
  }
  
  return { text: `Свободно ${event.capacity - event.registered_count} из ${event.capacity} мест`, percentage, status: 'available' };
}
