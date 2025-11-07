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
  {
    id: '7',
    title: 'Театральный фестиваль "Золотая Маска"',
    slug: 'teatralny-festival-zolotaya-maska',
    description: 'Гастроли лучших спектаклей России по версии национальной театральной премии',
    full_description: `Фестиваль "Золотая Маска" представляет лучшие спектакли сезона из разных городов России. В программе: драма, комедия, современный танец и экспериментальные постановки.

**Программа фестиваля:**
- "Вишневый сад" (МХТ им. Чехова, Москва)
- "Гроза" (Александринский театр, Санкт-Петербург)
- "Три сестры" (Театр Наций, Москва)
- Современная хореография от театра "Провинциальные танцы" (Екатеринбург)

**Даты показов:**
15-25 апреля 2025 года

**Особенности:**
- Встречи с режиссерами после спектаклей
- Мастер-классы по актерскому мастерству
- Выставка театральных костюмов и декораций`,
    cover_image_url: 'https://images.unsplash.com/photo-1625737251459-017c301457d8?w=800',
    category_id: 'cat-culture',
    category_name: 'Культура',
    organizer_type: 'commercial',
    organizer_id: 'org-7',
    organizer_name: 'Фонд "Золотая Маска"',
    organizer_avatar: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=200',
    event_date: '2025-04-15T19:00:00Z',
    end_date: '2025-04-25T22:00:00Z',
    location: 'Иркутский драматический театр',
    address: 'г. Иркутск, ул. Карла Маркса, 14',
    price_type: 'paid',
    price_min: 1000,
    price_max: 3500,
    age_restriction: '16+',
    format: 'offline',
    capacity: 800,
    registered_count: 450,
    tags: ['театр', 'фестиваль', 'культура', 'спектакли'],
    views_count: 7890,
    favorites_count: 567,
    contact_phone: '+7 (3952) 22-33-44',
    contact_email: 'info@goldenmask.ru',
    website_url: 'https://goldenmask.ru',
    social_links: {
      vk: 'https://vk.com/goldenmask',
      telegram: 'https://t.me/goldenmask',
    },
    requirements: 'Дресс-код: вечерний наряд. Фото- и видеосъемка запрещены.',
    program: 'Спектакли, встречи с режиссерами, мастер-классы, выставка.',
    is_featured: true,
    is_published: true,
    created_at: '2025-01-25T12:00:00Z',
    updated_at: '2025-03-10T15:00:00Z',
  },
  {
    id: '8',
    title: 'Йога-тур на Ольхоне',
    slug: 'yoga-tur-na-olhone',
    description: 'Недельный ретрит с йогой и медитациями на берегу Байкала',
    full_description: `Погрузитесь в практику йоги и медитации в одном из самых энергетически сильных мест Байкала - острове Ольхон. Ежедневные занятия на берегу озера, вегетарианское питание и прогулки по священным местам.

**Программа тура:**
- Ежедневные утренние и вечерние занятия йогой
- Медитации на восходе и закате солнца
- Экскурсия к мысу Бурхан и скале Шаманка
- Посещение песчаных дюн Сарайского пляжа
- Лекции по философии йоги и здоровому питанию

**В стоимость включено:**
- Проживание в эко-отеле
- 3-разовое вегетарианское питание
- Трансфер из Иркутска и обратно
- Все занятия и экскурсии`,
    cover_image_url: 'https://images.unsplash.com/photo-1723406230636-aa8c4ac1e6c5?w=800',
    category_id: 'cat-sport',
    category_name: 'Спорт',
    organizer_type: 'community',
    organizer_id: 'org-8',
    organizer_name: 'Йога-студия "Байкальский ветер"',
    organizer_avatar: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=200',
    event_date: '2025-06-10T08:00:00Z',
    end_date: '2025-06-17T18:00:00Z',
    location: 'Остров Ольхон',
    address: 'Иркутская область, остров Ольхон, пос. Хужир',
    price_type: 'paid',
    price_min: 25000,
    age_restriction: '18+',
    format: 'offline',
    capacity: 15,
    registered_count: 12,
    tags: ['йога', 'ретрит', 'байкал', 'здоровье', 'медитация'],
    views_count: 4321,
    favorites_count: 289,
    contact_phone: '+7 (902) 111-22-33',
    contact_email: 'yoga@baikalwind.ru',
    website_url: 'https://baikalwind-yoga.ru',
    social_links: {
      instagram: 'https://instagram.com/baikalwind_yoga',
    },
    requirements: 'При себе иметь коврик для йоги, удобную одежду, купальные принадлежности.',
    program: '7-дневный ретрит с йогой, медитациями и экскурсиями.',
    is_featured: true,
    is_published: true,
    created_at: '2025-02-15T10:00:00Z',
    updated_at: '2025-03-20T14:00:00Z',
  },
  {
    id: '9',
    title: 'IT-конференция "Байкал Digital"',
    slug: 'it-konferentsiya-baykal-digital',
    description: 'Главная технологическая конференция Сибири о digital-трендах',
    full_description: `"Байкал Digital" - ежегодная конференция для IT-специалистов, предпринимателей и digital-маркетологов. В программе: кейсы ведущих компаний, мастер-классы, нетворкинг.

**Основные темы:**
- Искусственный интеллект в бизнесе
- Digital-маркетинг 2025
- Кибербезопасность
- Управление IT-проектами
- Стартапы и инвестиции

**Спикеры:**
- Иван Петров (Head of AI, Яндекс)
- Мария Сидорова (CEO, Digital Agency)
- Алексей Иванов (Основатель стартапа "NeuroTech")
- Ольга Смирнова (CTO, СберТех)

**Для участников:**
- Доступ ко всем докладам
- Раздаточные материалы
- Обед и кофе-брейки
- Сертификат участника
- Доступ к записям выступлений`,
    cover_image_url: 'https://images.unsplash.com/photo-1708795446274-a3314a154688?w=800',
    category_id: 'cat-education',
    category_name: 'Образование',
    organizer_type: 'commercial',
    organizer_id: 'org-9',
    organizer_name: 'IT-сообщество Сибири',
    organizer_avatar: 'https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?w=200',
    event_date: '2025-05-22T09:00:00Z',
    end_date: '2025-05-23T18:00:00Z',
    location: 'Конференц-центр "Сибирь"',
    address: 'г. Иркутск, ул. Байкальская, 279',
    price_type: 'paid',
    price_min: 5000,
    price_max: 15000,
    age_restriction: '18+',
    format: 'hybrid',
    capacity: 300,
    registered_count: 245,
    tags: ['IT', 'конференция', 'технологии', 'образование', 'стартапы'],
    views_count: 8765,
    favorites_count: 654,
    contact_phone: '+7 (3952) 55-66-77',
    contact_email: 'info@baikaldigital.ru',
    website_url: 'https://baikaldigital.ru',
    social_links: {
      vk: 'https://vk.com/baikaldigital',
      telegram: 'https://t.me/baikaldigital_conf',
    },
    requirements: 'Для очного участия необходима предварительная регистрация.',
    program: '2 дня докладов, мастер-классов и нетворкинга. Онлайн-трансляция доступна.',
    is_featured: true,
    is_published: true,
    created_at: '2025-01-30T11:00:00Z',
    updated_at: '2025-03-15T12:00:00Z',
  },
  {
    id: '10',
    title: 'Фестиваль красок Холи',
    slug: 'festival-krasok-holi',
    description: 'Яркий праздник весны с музыкой и разноцветными красками',
    full_description: `Традиционный индийский праздник Холи теперь в Иркутске! Танцы под зажигательную музыку, море ярких красок и отличное настроение.

**Программа:**
- 12:00 - Начало фестиваля, раздача красок
- 13:00 - Танцевальный флешмоб
- 14:00 - Концерт этнической музыки
- 15:00 - Конкурс на самый яркий образ
- 16:00 - Запуск цветных дымов
- 17:00 - Закрытие фестиваля

**Что взять с собой:**
- Белую футболку, которую не жалко испачкать
- Солнцезащитные очки
- Воду
- Хорошее настроение!

**Краски:**
Безопасные экологичные краски на основе кукурузного крахмала будут предоставлены организаторами.`,
    cover_image_url: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800', 
    category_id: 'cat-entertainment',
    category_name: 'Развлечения',
    organizer_type: 'community',
    organizer_id: 'org-10',
    organizer_name: 'Культурный центр "Индия"',
    organizer_avatar: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=200',
    event_date: '2025-04-12T12:00:00Z',
    end_date: '2025-04-12T17:00:00Z',
    location: 'Парк Парижской Коммуны',
    address: 'г. Иркутск, ул. Рабочая, 18',
    price_type: 'free',
    age_restriction: '6+',
    format: 'offline',
    capacity: 2000,
    registered_count: 1567,
    tags: ['фестиваль', 'холи', 'краски', 'музыка', 'танцы'],
    views_count: 11234,
    favorites_count: 987,
    contact_phone: '+7 (902) 444-55-66',
    contact_email: 'holi@india-center.ru',
    website_url: 'https://india-center.ru',
    social_links: {
      vk: 'https://vk.com/india_center',
      instagram: 'https://instagram.com/india_center_irk',
    },
    requirements: 'Дети до 12 лет только в сопровождении взрослых.',
    program: 'Танцы, музыка, конкурсы, запуск красок.',
    is_featured: true,
    is_published: true,
    created_at: '2025-02-20T14:00:00Z',
    updated_at: '2025-03-25T10:00:00Z',
  },
  {
    id: '11',
    title: 'Мастер-класс по сыроварению',
    slug: 'master-klass-po-syrovareniyu',
    description: 'Научитесь готовить домашние сыры под руководством опытного сыровара',
    full_description: `На мастер-классе вы освоите технологию приготовления разных видов сыра и узнаете все секреты сыроварения.

**Программа:**
1. Теоретическая часть:
   - Виды сыров и их особенности
   - Необходимое оборудование и ингредиенты
   - Технологии приготовления

2. Практическая часть:
   - Приготовление моцареллы
   - Приготовление творожного сыра
   - Приготовление твердого сыра (чеддер)

3. Дегустация:
   - Проба приготовленных сыров
   - Подбор вина к сырам
   - Ответы на вопросы

**Вы получите:**
- Рецепты всех приготовленных сыров
- Список необходимого оборудования
- Контакты поставщиков качественных ингредиентов
- Приготовленные своими руками сыры (около 1 кг)`,
    cover_image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
    category_id: 'cat-food',
    category_name: 'Еда',
    organizer_type: 'individual',
    organizer_id: 'org-11',
    organizer_name: 'Андрей Семенов',
    organizer_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    event_date: '2025-04-18T11:00:00Z',
    end_date: '2025-04-18T15:00:00Z',
    location: 'Фермерский кооператив "Свои продукты"',
    address: 'г. Иркутск, ул. Полярная, 15',
    price_type: 'paid',
    price_min: 3500,
    age_restriction: '16+',
    format: 'offline',
    capacity: 10,
    registered_count: 8,
    tags: ['мастер-класс', 'сыр', 'кулинария', 'еда', 'фермерство'],
    views_count: 2987,
    favorites_count: 198,
    contact_phone: '+7 (902) 777-88-99',
    contact_email: 'cheese@ferma.ru',
    social_links: {
      telegram: 'https://t.me/cheese_master_irk',
    },
    requirements: 'Фартуки и все материалы предоставляются.',
    program: 'Теория сыроварения, практическое приготовление 3 видов сыра, дегустация.',
    is_featured: false,
    is_published: true,
    created_at: '2025-03-01T09:00:00Z',
    updated_at: '2025-03-28T16:00:00Z',
  },
  {
    id: '12',
    title: 'Ночная экскурсия в Ботанический сад',
    slug: 'nochnaya-ekskursiya-v-botanicheskiy-sad',
    description: 'Уникальная возможность увидеть ночную жизнь растений',
    full_description: `Ботанический сад Иркутского государственного университета приглашает на необычную ночную экскурсию. С фонариками вы пройдете по тропинкам сада и увидите, как растения ведут себя ночью.

**Программа экскурсии:**
- Знакомство с ночными опылителями
- Демонстрация растений, цветущих ночью
- Рассказ о биоритмах растений
- Наблюдение за ночными животными сада
- Чаепитие с травами из сада

**Особенности:**
- Группа не более 15 человек
- Выдаются специальные фонарики с красным светом
- Возможность сделать уникальные фотографии
- Сувенир на память - набор семян ночных цветов`,
    cover_image_url: 'https://images.unsplash.com/photo-1636616467462-b0d6c8286955?w=800', 
    category_id: 'cat-nature',
    category_name: 'Природа',
    organizer_type: 'community',
    organizer_id: 'org-12',
    organizer_name: 'Ботанический сад ИГУ',
    organizer_avatar: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=200',
    event_date: '2025-05-15T21:00:00Z',
    end_date: '2025-05-15T23:30:00Z',
    location: 'Ботанический сад ИГУ',
    address: 'г. Иркутск, ул. Кольцова, 93',
    price_type: 'paid',
    price_min: 800,
    age_restriction: '12+',
    format: 'offline',
    capacity: 15,
    registered_count: 14,
    tags: ['экскурсия', 'природа', 'ботаника', 'ночь', 'растения'],
    views_count: 3456,
    favorites_count: 256,
    contact_phone: '+7 (3952) 44-55-66',
    contact_email: 'botanicalsad@isu.ru',
    website_url: 'https://botan.isu.ru',
    social_links: {
      vk: 'https://vk.com/botsad_irk',
    },
    requirements: 'Удобная обувь, одежда по погоде. Фотоаппараты приветствуются.',
    program: 'Ночная прогулка по ботаническому саду с гидом, наблюдение за растениями, чаепитие.',
    is_featured: true,
    is_published: true,
    created_at: '2025-03-10T10:00:00Z',
    updated_at: '2025-04-05T12:00:00Z',
  },
  // СОБЫТИЯ НОЯБРЯ 2025 (20 событий)
  {
    id: '13',
    title: 'Концерт джазового квартета "Иркутск Блюз"',
    slug: 'kontsert-irkutsk-blues',
    description: 'Вечер живого джаза и блюза в уютной атмосфере',
    cover_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'community',
    organizer_name: 'Джаз-клуб "Синий вагон"',
    event_date: '2025-11-01T19:00:00Z',
    end_date: '2025-11-01T22:00:00Z',
    location: 'Джаз-клуб "Синий вагон"',
    address: 'г. Иркутск, ул. Карла Маркса, 28',
    price_type: 'paid',
    price_min: 800,
    price_max: 1500,
    age_restriction: '18+',
    format: 'offline',
    capacity: 80,
    registered_count: 45,
    tags: ['джаз', 'блюз', 'концерт', 'музыка'],
    views_count: 2341,
    favorites_count: 123,
    contact_phone: '+7 (3952) 11-22-33',
    contact_email: 'info@jazzclub-irk.ru',
    requirements: '',
    program: 'Концерт джазового квартета с авторскими композициями.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2025-10-15T12:00:00Z',
  },
  {
    id: '14',
    title: 'Выставка фотографий "Красоты Сибири"',
    slug: 'vystavka-krasoty-sibiri',
    description: 'Фотовыставка о природных красотах Сибирского региона',
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category_id: 'cat-exhibitions-art',
    category_name: 'Выставки и Искусство',
    organizer_type: 'commercial',
    organizer_name: 'Фотогалерея "Объектив"',
    event_date: '2025-11-02T10:00:00Z',
    end_date: '2025-11-30T18:00:00Z',
    location: 'Фотогалерея "Объектив"',
    address: 'г. Иркутск, ул. Ленина, 12',
    price_type: 'free',
    age_restriction: '0+',
    format: 'offline',
    capacity: 100,
    registered_count: 0,
    tags: ['фотография', 'выставка', 'сибирь', 'природа'],
    views_count: 1865,
    favorites_count: 98,
    contact_phone: '+7 (3952) 44-55-66',
    contact_email: 'gallery@objektiv.ru',
    requirements: '',
    program: 'Фотовыставка работает ежедневно с 10:00 до 18:00.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-10T09:00:00Z',
    updated_at: '2025-10-20T11:00:00Z',
  },
  {
    id: '15',
    title: 'Воркшоп по акварельной живописи',
    slug: 'workshop-akvarel',
    description: 'Мастер-класс по основам акварельной техники',
    cover_image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    category_id: 'cat-hobbies-crafts',
    category_name: 'Хобби и Ремесла',
    organizer_type: 'individual',
    organizer_name: 'Мария Петрова',
    event_date: '2025-11-03T14:00:00Z',
    end_date: '2025-11-03T17:00:00Z',
    location: 'Арт-студия "Палитра"',
    address: 'г. Иркутск, ул. Сухэ-Батора, 7',
    price_type: 'paid',
    price_min: 1200,
    age_restriction: '14+',
    format: 'offline',
    capacity: 12,
    registered_count: 9,
    tags: ['акварель', 'живопись', 'мастер-класс', 'творчество'],
    views_count: 987,
    favorites_count: 56,
    contact_phone: '+7 (902) 123-45-67',
    contact_email: 'maria@art-palette.ru',
    requirements: 'Материалы предоставляются.',
    program: 'Изучение основ акварельной техники, создание работы.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-15T14:00:00Z',
    updated_at: '2025-10-25T16:00:00Z',
  },
  {
    id: '16',
    title: 'Детский спектакль "Золушка"',
    slug: 'spektakl-zolushka',
    description: 'Интерактивный спектакль для детей по мотивам сказки',
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    category_id: 'cat-children',
    category_name: 'Для Детей',
    organizer_type: 'commercial',
    organizer_name: 'Детский театр "Сказка"',
    event_date: '2025-11-04T11:00:00Z',
    end_date: '2025-11-04T12:30:00Z',
    location: 'Детский театр "Сказка"',
    address: 'г. Иркутск, ул. Российская, 15',
    price_type: 'paid',
    price_min: 300,
    price_max: 500,
    age_restriction: '3+',
    format: 'offline',
    capacity: 150,
    registered_count: 98,
    tags: ['детям', 'спектакль', 'сказка', 'театр'],
    views_count: 3456,
    favorites_count: 234,
    contact_phone: '+7 (3952) 88-99-00',
    contact_email: 'info@skazka-theater.ru',
    requirements: 'Дети до 7 лет в сопровождении взрослых.',
    program: 'Интерактивный спектакль с участием зрителей.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-10-20T12:00:00Z',
  },
  {
    id: '17',
    title: 'Кинопремьера "Байкальские легенды"',
    slug: 'kinopremyera-baykalskie-legendy',
    description: 'Премьера документального фильма о легендах озера Байкал',
    cover_image_url: 'https://images.unsplash.com/photo-1489599728142-aa389fb04d30?w=800',
    category_id: 'cat-cinema-media',
    category_name: 'Кино и Медиа',
    organizer_type: 'commercial',
    organizer_name: 'Кинотеатр "Байкал"',
    event_date: '2025-11-05T19:30:00Z',
    end_date: '2025-11-05T21:30:00Z',
    location: 'Кинотеатр "Байкал"',
    address: 'г. Иркутск, ул. Лермонтова, 32',
    price_type: 'paid',
    price_min: 250,
    price_max: 400,
    age_restriction: '12+',
    format: 'offline',
    capacity: 200,
    registered_count: 156,
    tags: ['кино', 'премьера', 'байкал', 'документальный'],
    views_count: 4321,
    favorites_count: 287,
    contact_phone: '+7 (3952) 55-66-77',
    contact_email: 'info@baikal-cinema.ru',
    requirements: '',
    program: 'Премьерный показ фильма, встреча с режиссером.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-20T11:00:00Z',
    updated_at: '2025-10-25T14:00:00Z',
  },
  {
    id: '18',
    title: 'Бизнес-завтрак "Стартапы Сибири"',
    slug: 'biznes-zavtrak-startapy-sibiri',
    description: 'Сетевое мероприятие для предпринимателей и инвесторов',
    cover_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category_id: 'cat-business-networking',
    category_name: 'Бизнес и Нетворкинг',
    organizer_type: 'commercial',
    organizer_name: 'IT-парк Иркутск',
    event_date: '2025-11-06T08:00:00Z',
    end_date: '2025-11-06T10:00:00Z',
    location: 'IT-парк Иркутск',
    address: 'г. Иркутск, ул. Байкальская, 105',
    price_type: 'paid',
    price_min: 1000,
    age_restriction: '18+',
    format: 'offline',
    capacity: 50,
    registered_count: 38,
    tags: ['бизнес', 'стартапы', 'нетворкинг', 'предпринимательство'],
    views_count: 1876,
    favorites_count: 91,
    contact_phone: '+7 (3952) 22-33-44',
    contact_email: 'events@itpark-irkutsk.ru',
    requirements: 'Для предпринимателей и инвесторов.',
    program: 'Завтрак, презентации стартапов, нетворкинг.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-01T12:00:00Z',
    updated_at: '2025-10-15T14:00:00Z',
  },
  {
    id: '19',
    title: 'Йога на рассвете в парке',
    slug: 'yoga-na-rassvete',
    description: 'Утренняя практика йоги в городском парке',
    cover_image_url: 'https://images.unsplash.com/photo-1506629905607-b5f42b6a0b80?w=800',
    category_id: 'cat-ecology-health',
    category_name: 'Экология и ЗОЖ',
    organizer_type: 'community',
    organizer_name: 'Йога-сообщество "Утро"',
    event_date: '2025-11-07T06:30:00Z',
    end_date: '2025-11-07T07:30:00Z',
    location: 'Парк имени Парижской Коммуны',
    address: 'г. Иркутск, ул. Рабочая, 20',
    price_type: 'donation',
    age_restriction: '16+',
    format: 'offline',
    capacity: 30,
    registered_count: 24,
    tags: ['йога', 'здоровье', 'утро', 'парк'],
    views_count: 765,
    favorites_count: 67,
    contact_phone: '+7 (902) 567-89-01',
    contact_email: 'morning@yoga-irk.ru',
    requirements: 'Коврик для йоги с собой.',
    program: 'Утренняя практика на свежем воздухе.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-20T08:00:00Z',
    updated_at: '2025-10-28T10:00:00Z',
  },
  {
    id: '20',
    title: 'Винная дегустация "Вина Франции"',
    slug: 'vinnaya-degustatsiya-fretsii',
    description: 'Дегустация французских вин с сомелье',
    cover_image_url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=800',
    category_id: 'cat-gastronomy',
    category_name: 'Гастрономия',
    organizer_type: 'commercial',
    organizer_name: 'Винный бар "Bordeaux"',
    event_date: '2025-11-08T18:00:00Z',
    end_date: '2025-11-08T20:00:00Z',
    location: 'Винный бар "Bordeaux"',
    address: 'г. Иркутск, ул. 3 Июля, 45',
    price_type: 'paid',
    price_min: 2500,
    age_restriction: '21+',
    format: 'offline',
    capacity: 20,
    registered_count: 18,
    tags: ['вино', 'дегустация', 'франция', 'сомелье'],
    views_count: 1234,
    favorites_count: 89,
    contact_phone: '+7 (3952) 77-88-99',
    contact_email: 'info@bordeaux-bar.ru',
    requirements: 'Документ, удостоверяющий возраст.',
    program: 'Дегустация 6 французских вин с закусками.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-05T15:00:00Z',
    updated_at: '2025-10-22T17:00:00Z',
  },
  {
    id: '21',
    title: 'Психологический тренинг "Работа со стрессом"',
    slug: 'trening-rabota-so-stressom',
    description: 'Практический тренинг по управлению стрессом',
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    category_id: 'cat-psychology-spiritual',
    category_name: 'Психология и Духовное развитие',
    organizer_type: 'individual',
    organizer_name: 'Анна Волкова, психолог',
    event_date: '2025-11-10T10:00:00Z',
    end_date: '2025-11-10T16:00:00Z',
    location: 'Центр психологии "Гармония"',
    address: 'г. Иркутск, ул. Чкалова, 25',
    price_type: 'paid',
    price_min: 3000,
    age_restriction: '18+',
    format: 'offline',
    capacity: 15,
    registered_count: 12,
    tags: ['психология', 'стресс', 'тренинг', 'здоровье'],
    views_count: 892,
    favorites_count: 54,
    contact_phone: '+7 (902) 345-67-89',
    contact_email: 'anna@harmony-psy.ru',
    requirements: '',
    program: '6-часовой тренинг с практическими упражнениями.',
    is_featured: false,
    is_published: true,
    created_at: '2025-09-30T12:00:00Z',
    updated_at: '2025-10-18T14:00:00Z',
  },
  {
    id: '22',
    title: 'Модный показ осенней коллекции',
    slug: 'modnyy-pokaz-osen',
    description: 'Показ новой осенней коллекции местных дизайнеров',
    cover_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    category_id: 'cat-fashion-beauty',
    category_name: 'Мода и Красота',
    organizer_type: 'commercial',
    organizer_name: 'Fashion Studio "Style"',
    event_date: '2025-11-12T19:00:00Z',
    end_date: '2025-11-12T21:00:00Z',
    location: 'ТЦ "Модуль"',
    address: 'г. Иркутск, ул. Лермонтова, 81',
    price_type: 'paid',
    price_min: 800,
    price_max: 1500,
    age_restriction: '16+',
    format: 'offline',
    capacity: 100,
    registered_count: 78,
    tags: ['мода', 'показ', 'дизайн', 'осень'],
    views_count: 2345,
    favorites_count: 156,
    contact_phone: '+7 (3952) 99-11-22',
    contact_email: 'info@style-studio.ru',
    requirements: '',
    program: 'Показ коллекции, фуршет, знакомство с дизайнерами.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-25T13:00:00Z',
    updated_at: '2025-10-20T15:00:00Z',
  },
  {
    id: '23',
    title: 'Лекция "Экология Байкала"',
    slug: 'lektsiya-ekologiya-baykala',
    description: 'Научно-популярная лекция об экосистеме озера Байкал',
    cover_image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    category_id: 'cat-education',
    category_name: 'Образование',
    organizer_type: 'commercial',
    organizer_name: 'Лимнологический институт СО РАН',
    event_date: '2025-11-16T18:00:00Z',
    end_date: '2025-11-16T19:30:00Z',
    location: 'Иркутский университет',
    address: 'г. Иркутск, ул. Карла Маркса, 1',
    price_type: 'free',
    age_restriction: '12+',
    format: 'offline',
    capacity: 200,
    registered_count: 89,
    tags: ['экология', 'байкал', 'наука', 'лекция'],
    views_count: 1456,
    favorites_count: 98,
    contact_phone: '+7 (3952) 42-65-43',
    contact_email: 'science@lin.irk.ru',
    requirements: '',
    program: 'Лекция с презентацией и видеоматериалами.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-12T11:00:00Z',
    updated_at: '2025-10-26T13:00:00Z',
  },
  {
    id: '24',
    title: 'Турнир по настольному теннису',
    slug: 'turnir-nastolnyy-tennis',
    description: 'Любительский турнир по настольному теннису',
    cover_image_url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800',
    category_id: 'cat-sport',
    category_name: 'Спорт',
    organizer_type: 'community',
    organizer_name: 'Спортивный клуб "Ракетка"',
    event_date: '2025-11-16T10:00:00Z',
    end_date: '2025-11-16T18:00:00Z',
    location: 'Спорткомплекс "Труд"',
    address: 'г. Иркутск, ул. Трудовая, 45',
    price_type: 'paid',
    price_min: 500,
    age_restriction: '14+',
    format: 'offline',
    capacity: 32,
    registered_count: 28,
    tags: ['спорт', 'теннис', 'турнир', 'соревнования'],
    views_count: 876,
    favorites_count: 43,
    contact_phone: '+7 (902) 234-56-78',
    contact_email: 'info@raketa-club.ru',
    requirements: 'Ракетка и спортивная форма.',
    program: 'Турнир на выбывание, награждение победителей.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-08T14:00:00Z',
    updated_at: '2025-10-24T16:00:00Z',
  },
  {
    id: '25',
    title: 'Ночная вечеринка в стиле 80-х',
    slug: 'vecherinka-80s',
    description: 'Ретро-вечеринка с музыкой и костюмами 80-х',
    cover_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'commercial',
    organizer_name: 'Ночной клуб "Neon"',
    event_date: '2025-11-16T22:00:00Z',
    end_date: '2025-11-17T04:00:00Z',
    location: 'Ночной клуб "Neon"',
    address: 'г. Иркутск, ул. Декабрьских Событий, 55',
    price_type: 'paid',
    price_min: 1000,
    age_restriction: '18+',
    format: 'offline',
    capacity: 150,
    registered_count: 89,
    tags: ['вечеринка', '80е', 'ретро', 'танцы'],
    views_count: 3421,
    favorites_count: 234,
    contact_phone: '+7 (3952) 88-77-66',
    contact_email: 'party@neon-club.ru',
    requirements: 'Дресс-код: стиль 80-х приветствуется.',
    program: 'DJ-сет, конкурсы, призы за лучший костюм.',
    is_featured: true,
    is_published: true,
    created_at: '2025-10-02T16:00:00Z',
    updated_at: '2025-10-19T18:00:00Z',
  },
  {
    id: '26',
    title: 'Фестиваль народных ремесел',
    slug: 'festival-narodnyh-remesel',
    description: 'Выставка и мастер-классы по традиционным ремеслам',
    cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    category_id: 'cat-festivals',
    category_name: 'Фестивали',
    organizer_type: 'commercial',
    organizer_name: 'Культурный центр "Традиция"',
    event_date: '2025-11-18T11:00:00Z',
    end_date: '2025-11-18T18:00:00Z',
    location: 'Выставочный зал "Сибэкспоцентр"',
    address: 'г. Иркутск, ул. Байкальская, 253В',
    price_type: 'paid',
    price_min: 300,
    price_max: 600,
    age_restriction: '6+',
    format: 'offline',
    capacity: 300,
    registered_count: 167,
    tags: ['ремесла', 'фестиваль', 'традиции', 'мастер-классы'],
    views_count: 2178,
    favorites_count: 145,
    contact_phone: '+7 (3952) 33-44-55',
    contact_email: 'info@tradition-center.ru',
    requirements: '',
    program: 'Выставка, мастер-классы по гончарному делу, ткачеству.',
    is_featured: false,
    is_published: true,
    created_at: '2025-09-28T10:00:00Z',
    updated_at: '2025-10-21T12:00:00Z',
  },
  {
    id: '27',
    title: 'Концерт органной музыки',
    slug: 'kontsert-organnoy-muzyki',
    description: 'Вечер классической органной музыки',
    cover_image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'commercial',
    organizer_name: 'Филармония Иркутска',
    event_date: '2025-11-24T19:00:00Z',
    end_date: '2025-11-24T21:00:00Z',
    location: 'Органный зал филармонии',
    address: 'г. Иркутск, ул. Сухэ-Батора, 2',
    price_type: 'paid',
    price_min: 600,
    price_max: 1200,
    age_restriction: '12+',
    format: 'offline',
    capacity: 250,
    registered_count: 189,
    tags: ['орган', 'классика', 'концерт', 'музыка'],
    views_count: 1567,
    favorites_count: 112,
    contact_phone: '+7 (3952) 20-07-77',
    contact_email: 'tickets@philharmonic-irk.ru',
    requirements: '',
    program: 'Произведения Баха, Франка, современных композиторов.',
    is_featured: false,
    is_published: true,
    created_at: '2025-09-18T11:00:00Z',
    updated_at: '2025-10-16T13:00:00Z',
  },
  {
    id: '28',
    title: 'Мастер-класс по изготовлению мыла',
    slug: 'master-klass-mylo',
    description: 'Создание натурального мыла ручной работы',
    cover_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    category_id: 'cat-hobbies-crafts',
    category_name: 'Хобби и Ремесла',
    organizer_type: 'individual',
    organizer_name: 'Ольга Ремезова',
    event_date: '2025-11-24T15:00:00Z',
    end_date: '2025-11-24T17:30:00Z',
    location: 'Мастерская "Handmade"',
    address: 'г. Иркутск, ул. Железнодорожная, 12',
    price_type: 'paid',
    price_min: 1500,
    age_restriction: '12+',
    format: 'offline',
    capacity: 10,
    registered_count: 8,
    tags: ['мыло', 'handmade', 'мастер-класс', 'ремесла'],
    views_count: 654,
    favorites_count: 38,
    contact_phone: '+7 (902) 456-78-90',
    contact_email: 'olga@handmade-irk.ru',
    requirements: 'Все материалы предоставляются.',
    program: 'Изготовление 3 видов мыла с ароматами.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-14T13:00:00Z',
    updated_at: '2025-10-27T15:00:00Z',
  },
  {
    id: '29',
    title: 'Стендап шоу "Смейтесь громче"',
    slug: 'stendup-show',
    description: 'Вечер стендап комедии с местными комиками',
    cover_image_url: 'https://images.unsplash.com/photo-1585459733446-98d480b0a1d9?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'community',
    organizer_name: 'Comedy Club Иркутск',
    event_date: '2025-11-24T20:00:00Z',
    end_date: '2025-11-24T22:00:00Z',
    location: 'Антикафе "Место"',
    address: 'г. Иркутск, ул. Седова, 19',
    price_type: 'paid',
    price_min: 400,
    age_restriction: '16+',
    format: 'offline',
    capacity: 60,
    registered_count: 48,
    tags: ['стендап', 'комедия', 'юмор', 'шоу'],
    views_count: 1789,
    favorites_count: 98,
    contact_phone: '+7 (902) 678-90-12',
    contact_email: 'info@comedy-irk.ru',
    requirements: '',
    program: 'Выступления 4 комиков, открытый микрофон.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-11T17:00:00Z',
    updated_at: '2025-10-25T19:00:00Z',
  },
  {
    id: '30',
    title: 'Игротека настольных игр',
    slug: 'igroteka-nastolnyh-igr',
    description: 'Вечер настольных игр для всей семьи',
    cover_image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
    category_id: 'cat-children',
    category_name: 'Для Детей',
    organizer_type: 'commercial',
    organizer_name: 'Игровой клуб "Кубик"',
    event_date: '2025-11-30T16:00:00Z',
    end_date: '2025-11-30T20:00:00Z',
    location: 'Игровой клуб "Кубик"',
    address: 'г. Иркутск, ул. Чехова, 22',
    price_type: 'paid',
    price_min: 300,
    age_restriction: '6+',
    format: 'offline',
    capacity: 40,
    registered_count: 28,
    tags: ['настольные игры', 'семья', 'дети', 'развлечения'],
    views_count: 987,
    favorites_count: 67,
    contact_phone: '+7 (3952) 66-77-88',
    contact_email: 'info@kubik-club.ru',
    requirements: '',
    program: 'Более 50 видов настольных игр, турниры.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-18T12:00:00Z',
    updated_at: '2025-10-29T14:00:00Z',
  },
  {
    id: '31',
    title: 'Кулинарный мастер-класс "Итальянская кухня"',
    slug: 'kulinarniy-mk-italiya',
    description: 'Готовим настоящую итальянскую пасту и пиццу',
    cover_image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
    category_id: 'cat-gastronomy',
    category_name: 'Гастрономия',
    organizer_type: 'individual',
    organizer_name: 'Шеф Марко Росси',
    event_date: '2025-11-30T17:00:00Z',
    end_date: '2025-11-30T20:00:00Z',
    location: 'Кулинарная студия "Gusto"',
    address: 'г. Иркутск, ул. Красноармейская, 8',
    price_type: 'paid',
    price_min: 2800,
    age_restriction: '16+',
    format: 'offline',
    capacity: 12,
    registered_count: 10,
    tags: ['кулинария', 'италия', 'паста', 'пицца'],
    views_count: 1456,
    favorites_count: 89,
    contact_phone: '+7 (3952) 11-33-55',
    contact_email: 'marco@gusto-studio.ru',
    requirements: 'Фартуки предоставляются.',
    program: 'Приготовление пасты карбонара и маргариты.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-22T14:00:00Z',
    updated_at: '2025-11-01T16:00:00Z',
  },
  {
    id: '32',
    title: 'Концерт камерной музыки',
    slug: 'kontsert-kamernoy-muzyki',
    description: 'Вечер камерной музыки в исполнении трио',
    cover_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'commercial',
    organizer_name: 'Музыкальное общество "Гармония"',
    event_date: '2025-11-30T18:30:00Z',
    end_date: '2025-11-30T20:30:00Z',
    location: 'Камерный зал консерватории',
    address: 'г. Иркутск, ул. Сухэ-Батора, 6',
    price_type: 'paid',
    price_min: 500,
    price_max: 900,
    age_restriction: '12+',
    format: 'offline',
    capacity: 80,
    registered_count: 62,
    tags: ['камерная музыка', 'трио', 'классика', 'концерт'],
    views_count: 876,
    favorites_count: 54,
    contact_phone: '+7 (3952) 44-66-88',
    contact_email: 'info@harmony-music.ru',
    requirements: '',
    program: 'Произведения Шуберта, Брамса, Шостаковича.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-25T11:00:00Z',
    updated_at: '2025-11-02T13:00:00Z',
  },
  
  // СОБЫТИЯ ДЕКАБРЯ 2025 (30 событий)
  {
    id: '33',
    title: 'Новогодняя ярмарка мастеров',
    slug: 'novogodnyaya-yarmarka-masterov',
    description: 'Праздничная ярмарка с подарками ручной работы',
    cover_image_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    category_id: 'cat-festivals',
    category_name: 'Фестивали',
    organizer_type: 'commercial',
    organizer_name: 'Городская администрация',
    event_date: '2025-12-01T10:00:00Z',
    end_date: '2025-12-31T20:00:00Z',
    location: 'Сквер Кирова',
    address: 'г. Иркутск, площадь Кирова',
    price_type: 'free',
    age_restriction: '0+',
    format: 'offline',
    capacity: 5000,
    registered_count: 0,
    tags: ['новый год', 'ярмарка', 'подарки', 'handmade'],
    views_count: 12345,
    favorites_count: 678,
    contact_phone: '+7 (3952) 52-52-52',
    contact_email: 'events@irkutsk.ru',
    requirements: '',
    program: 'Ежедневная работа мастеров, концерты по выходным.',
    is_featured: true,
    is_published: true,
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-11-15T12:00:00Z',
  },
  {
    id: '34',
    title: 'Спектакль "Щелкунчик"',
    slug: 'spektakl-schelkunchik',
    description: 'Новогодний балет для всей семьи',
    cover_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    category_id: 'cat-theater-performance',
    category_name: 'Театр и Перформанс',
    organizer_type: 'commercial',
    organizer_name: 'Театр оперы и балета',
    event_date: '2025-12-02T18:00:00Z',
    end_date: '2025-12-02T20:30:00Z',
    location: 'Театр оперы и балета',
    address: 'г. Иркутск, ул. Сухэ-Батора, 2А',
    price_type: 'paid',
    price_min: 800,
    price_max: 3000,
    age_restriction: '6+',
    format: 'offline',
    capacity: 400,
    registered_count: 356,
    tags: ['балет', 'щелкунчик', 'новый год', 'дети'],
    views_count: 8765,
    favorites_count: 456,
    contact_phone: '+7 (3952) 20-90-90',
    contact_email: 'tickets@opera-irkutsk.ru',
    requirements: '',
    program: 'Классический балет Чайковского в 2 действиях.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-01T12:00:00Z',
    updated_at: '2025-11-10T14:00:00Z',
  },
  {
    id: '35',
    title: 'Мастер-класс по декупажу',
    slug: 'master-klass-dekupazh',
    description: 'Создаем праздничные украшения в технике декупаж',
    cover_image_url: 'https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=800',
    category_id: 'cat-hobbies-crafts',
    category_name: 'Хобби и Ремесла',
    organizer_type: 'individual',
    organizer_name: 'Евгения Краснова',
    event_date: '2025-12-03T14:00:00Z',
    end_date: '2025-12-03T17:00:00Z',
    location: 'Творческий центр "Радуга"',
    address: 'г. Иркутск, ул. Партизанская, 23',
    price_type: 'paid',
    price_min: 1200,
    age_restriction: '10+',
    format: 'offline',
    capacity: 15,
    registered_count: 12,
    tags: ['декупаж', 'мастер-класс', 'новый год', 'декор'],
    views_count: 765,
    favorites_count: 45,
    contact_phone: '+7 (902) 789-01-23',
    contact_email: 'zhenya@rainbow-center.ru',
    requirements: 'Материалы предоставляются.',
    program: 'Декорируем коробки и бутылки к празднику.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-01T11:00:00Z',
    updated_at: '2025-11-18T13:00:00Z',
  },
  {
    id: '36',
    title: 'Рождественский концерт хора',
    slug: 'rozhdestvenskiy-kontsert-hora',
    description: 'Праздничный концерт церковного хора',
    cover_image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'community',
    organizer_name: 'Знаменский собор',
    event_date: '2025-12-05T17:00:00Z',
    end_date: '2025-12-05T19:00:00Z',
    location: 'Знаменский собор',
    address: 'г. Иркутск, ул. Ангарская, 14',
    price_type: 'donation',
    age_restriction: '0+',
    format: 'offline',
    capacity: 300,
    registered_count: 0,
    tags: ['рождество', 'хор', 'духовная музыка', 'концерт'],
    views_count: 2134,
    favorites_count: 89,
    contact_phone: '+7 (3952) 24-46-68',
    contact_email: 'info@znamensky-sobor.ru',
    requirements: '',
    program: 'Рождественские песнопения и классика.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-20T15:00:00Z',
    updated_at: '2025-11-20T17:00:00Z',
  },
  {
    id: '37',
    title: 'Детская новогодняя елка',
    slug: 'detskaya-novogodnyaya-elka',
    description: 'Праздник для детей с Дедом Морозом и подарками',
    cover_image_url: 'https://images.unsplash.com/photo-1544273677-6d55dd9b8df5?w=800',
    category_id: 'cat-children',
    category_name: 'Для Детей',
    organizer_type: 'commercial',
    organizer_name: 'ДК "Современник"',
    event_date: '2025-12-07T11:00:00Z',
    end_date: '2025-12-07T13:00:00Z',
    location: 'ДК "Современник"',
    address: 'г. Иркутск, ул. Советская, 109',
    price_type: 'paid',
    price_min: 400,
    price_max: 600,
    age_restriction: '3+',
    format: 'offline',
    capacity: 200,
    registered_count: 178,
    tags: ['новый год', 'дети', 'дед мороз', 'подарки'],
    views_count: 5432,
    favorites_count: 321,
    contact_phone: '+7 (3952) 35-46-57',
    contact_email: 'info@sovremennik-dk.ru',
    requirements: 'Дети до 5 лет с родителями.',
    program: 'Спектакль, игры с героями, вручение подарков.',
    is_featured: true,
    is_published: true,
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2025-11-12T12:00:00Z',
  },
  {
    id: '38',
    title: 'Кино под открытым небом "Ирония судьбы"',
    slug: 'kino-ironiya-sudby',
    description: 'Показ новогоднего фильма на открытом воздухе',
    cover_image_url: 'https://images.unsplash.com/photo-1489599728142-aa389fb04d30?w=800',
    category_id: 'cat-cinema-media',
    category_name: 'Кино и Медиа',
    organizer_type: 'community',
    organizer_name: 'Парк культуры',
    event_date: '2025-12-08T18:00:00Z',
    end_date: '2025-12-08T21:00:00Z',
    location: 'Парк культуры',
    address: 'г. Иркутск, ул. Советская, 47',
    price_type: 'free',
    age_restriction: '12+',
    format: 'offline',
    capacity: 500,
    registered_count: 0,
    tags: ['кино', 'новый год', 'ирония судьбы', 'открытый воздух'],
    views_count: 3456,
    favorites_count: 234,
    contact_phone: '+7 (3952) 42-84-26',
    contact_email: 'info@park-culture.ru',
    requirements: 'Теплая одежда, пледы.',
    program: 'Показ фильма, глинтвейн и закуски.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-05T14:00:00Z',
    updated_at: '2025-11-22T16:00:00Z',
  },
  {
    id: '39',
    title: 'Бизнес-встреча "Итоги года"',
    slug: 'biznes-vstrecha-itogi-goda',
    description: 'Подведение итогов года для предпринимателей',
    cover_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category_id: 'cat-business-networking',
    category_name: 'Бизнес и Нетворкинг',
    organizer_type: 'commercial',
    organizer_name: 'Торгово-промышленная палата',
    event_date: '2025-12-10T14:00:00Z',
    end_date: '2025-12-10T18:00:00Z',
    location: 'Отель "Ангара"',
    address: 'г. Иркутск, ул. Сухэ-Батора, 7',
    price_type: 'paid',
    price_min: 2500,
    age_restriction: '18+',
    format: 'offline',
    capacity: 100,
    registered_count: 87,
    tags: ['бизнес', 'итоги года', 'нетворкинг', 'предпринимательство'],
    views_count: 1876,
    favorites_count: 92,
    contact_phone: '+7 (3952) 24-35-46',
    contact_email: 'events@tppirk.ru',
    requirements: 'Для предпринимателей и руководителей.',
    program: 'Презентации, нетворкинг, фуршет.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-30T13:00:00Z',
    updated_at: '2025-11-25T15:00:00Z',
  },
  {
    id: '40',
    title: 'Зимняя школа здоровья',
    slug: 'zimnyaya-shkola-zdorovya',
    description: 'Курс лекций о здоровом образе жизни зимой',
    cover_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category_id: 'cat-ecology-health',
    category_name: 'Экология и ЗОЖ',
    organizer_type: 'commercial',
    organizer_name: 'Центр здоровья "Вита"',
    event_date: '2025-12-12T16:00:00Z',
    end_date: '2025-12-12T18:00:00Z',
    location: 'Медицинский центр "Вита"',
    address: 'г. Иркутск, ул. Красноказачья, 147',
    price_type: 'free',
    age_restriction: '16+',
    format: 'offline',
    capacity: 50,
    registered_count: 34,
    tags: ['здоровье', 'зима', 'образование', 'лекции'],
    views_count: 987,
    favorites_count: 67,
    contact_phone: '+7 (3952) 46-57-68',
    contact_email: 'info@vita-center.ru',
    requirements: '',
    program: 'Лекции о питании, физической активности зимой.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-08T12:00:00Z',
    updated_at: '2025-11-28T14:00:00Z',
  },
  {
    id: '41',
    title: 'Показ зимней коллекции',
    slug: 'pokaz-zimney-kollektsii',
    description: 'Модный показ зимней одежды 2026',
    cover_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    category_id: 'cat-fashion-beauty',
    category_name: 'Мода и Красота',
    organizer_type: 'commercial',
    organizer_name: 'Дом моды "Элегант"',
    event_date: '2025-12-13T18:00:00Z',
    end_date: '2025-12-13T20:00:00Z',
    location: 'ТЦ "Европа"',
    address: 'г. Иркутск, ул. Дзержинского, 15',
    price_type: 'paid',
    price_min: 600,
    price_max: 1200,
    age_restriction: '16+',
    format: 'offline',
    capacity: 120,
    registered_count: 89,
    tags: ['мода', 'зима', 'коллекция', 'показ'],
    views_count: 2345,
    favorites_count: 156,
    contact_phone: '+7 (3952) 57-68-79',
    contact_email: 'info@elegant-fashion.ru',
    requirements: '',
    program: 'Показ коллекции, презентация трендов 2026.',
    is_featured: false,
    is_published: true,
    created_at: '2025-10-25T15:00:00Z',
    updated_at: '2025-11-15T17:00:00Z',
  },
  {
    id: '42',
    title: 'Лекция "Астрономия зимнего неба"',
    slug: 'lektsiya-astronomiya-zimnego-neba',
    description: 'О созвездиях и планетах зимнего неба',
    cover_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    category_id: 'cat-education',
    category_name: 'Образование',
    organizer_type: 'commercial',
    organizer_name: 'Планетарий Иркутска',
    event_date: '2025-12-15T19:00:00Z',
    end_date: '2025-12-15T21:00:00Z',
    location: 'Планетарий',
    address: 'г. Иркутск, ул. Декабрьских Событий, 44',
    price_type: 'paid',
    price_min: 300,
    price_max: 500,
    age_restriction: '12+',
    format: 'offline',
    capacity: 80,
    registered_count: 62,
    tags: ['астрономия', 'зима', 'созвездия', 'планеты'],
    views_count: 1456,
    favorites_count: 89,
    contact_phone: '+7 (3952) 68-79-90',
    contact_email: 'info@planetarium-irk.ru',
    requirements: '',
    program: 'Лекция с показом звездного неба в планетарии.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-10T16:00:00Z',
    updated_at: '2025-12-01T18:00:00Z',
  },
  {
    id: '43',
    title: 'Турнир по шахматам',
    slug: 'turnir-po-shahmatam',
    description: 'Зимний турнир по шахматам для любителей',
    cover_image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
    category_id: 'cat-sport',
    category_name: 'Спорт',
    organizer_type: 'community',
    organizer_name: 'Шахматный клуб "Гроссмейстер"',
    event_date: '2025-12-16T10:00:00Z',
    end_date: '2025-12-16T18:00:00Z',
    location: 'Шахматный клуб "Гроссмейстер"',
    address: 'г. Иркутск, ул. Чкалова, 47',
    price_type: 'paid',
    price_min: 300,
    age_restriction: '10+',
    format: 'offline',
    capacity: 64,
    registered_count: 58,
    tags: ['шахматы', 'турнир', 'спорт', 'интеллект'],
    views_count: 876,
    favorites_count: 54,
    contact_phone: '+7 (902) 890-12-34',
    contact_email: 'info@chess-irk.ru',
    requirements: 'Знание правил игры в шахматы.',
    program: 'Турнир по швейцарской системе, награждение.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-12T11:00:00Z',
    updated_at: '2025-12-02T13:00:00Z',
  },
  {
    id: '44',
    title: 'Новогодняя вечеринка в баре',
    slug: 'novogodnyaya-vecherinka-bar',
    description: 'Празднование Нового года с DJ и коктейлями',
    cover_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'commercial',
    organizer_name: 'Бар "Остров"',
    event_date: '2025-12-18T21:00:00Z',
    end_date: '2025-12-19T03:00:00Z',
    location: 'Бар "Остров"',
    address: 'г. Иркутск, ул. Красноармейская, 14',
    price_type: 'paid',
    price_min: 1500,
    age_restriction: '18+',
    format: 'offline',
    capacity: 80,
    registered_count: 67,
    tags: ['новый год', 'вечеринка', 'DJ', 'коктейли'],
    views_count: 3421,
    favorites_count: 189,
    contact_phone: '+7 (3952) 79-90-01',
    contact_email: 'party@ostrov-bar.ru',
    requirements: 'Новогодний дресс-код приветствуется.',
    program: 'DJ-сет, конкурсы, новогодние коктейли.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-01T20:00:00Z',
    updated_at: '2025-11-20T22:00:00Z',
  },
  {
    id: '45',
    title: 'Ярмарка новогодних подарков',
    slug: 'yarmarka-novogodnih-podarkov',
    description: 'Большая ярмарка с подарками для всей семьи',
    cover_image_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    category_id: 'cat-festivals',
    category_name: 'Фестивали',
    organizer_type: 'commercial',
    organizer_name: 'ТЦ "Форт"',
    event_date: '2025-12-20T11:00:00Z',
    end_date: '2025-12-20T20:00:00Z',
    location: 'ТЦ "Форт"',
    address: 'г. Иркутск, ул. Лермонтова, 298',
    price_type: 'free',
    age_restriction: '0+',
    format: 'offline',
    capacity: 1000,
    registered_count: 0,
    tags: ['ярмарка', 'подарки', 'новый год', 'семья'],
    views_count: 4567,
    favorites_count: 267,
    contact_phone: '+7 (3952) 90-01-12',
    contact_email: 'events@fort-mall.ru',
    requirements: '',
    program: 'Продажа подарков, мастер-классы, аниматоры.',
    is_featured: true,
    is_published: true,
    created_at: '2025-10-15T13:00:00Z',
    updated_at: '2025-11-18T15:00:00Z',
  },
  {
    id: '46',
    title: 'Концерт рок-группы "Снегопад"',
    slug: 'kontsert-rok-gruppy-snegopad',
    description: 'Зимний концерт популярной рок-группы',
    cover_image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'commercial',
    organizer_name: 'Концертное агентство "Рок"',
    event_date: '2025-12-21T20:00:00Z',
    end_date: '2025-12-21T23:00:00Z',
    location: 'ДК "Энергетик"',
    address: 'г. Иркутск, ул. Трилиссера, 23',
    price_type: 'paid',
    price_min: 800,
    price_max: 1800,
    age_restriction: '16+',
    format: 'offline',
    capacity: 300,
    registered_count: 267,
    tags: ['рок', 'концерт', 'снегопад', 'зима'],
    views_count: 5432,
    favorites_count: 345,
    contact_phone: '+7 (3952) 01-23-45',
    contact_email: 'tickets@rock-agency.ru',
    requirements: '',
    program: 'Концерт из 2 частей, презентация нового альбома.',
    is_featured: true,
    is_published: true,
    created_at: '2025-10-10T18:00:00Z',
    updated_at: '2025-11-25T20:00:00Z',
  },
  {
    id: '47',
    title: 'Мастер-класс по валянию из шерсти',
    slug: 'master-klass-valyanie-sherst',
    description: 'Создаем теплые аксессуары из шерсти',
    cover_image_url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
    category_id: 'cat-hobbies-crafts',
    category_name: 'Хобби и Ремесла',
    organizer_type: 'individual',
    organizer_name: 'Светлана Иванова',
    event_date: '2025-12-22T13:00:00Z',
    end_date: '2025-12-22T16:00:00Z',
    location: 'Мастерская "Теплые руки"',
    address: 'г. Иркутск, ул. Баррикад, 34',
    price_type: 'paid',
    price_min: 1800,
    age_restriction: '12+',
    format: 'offline',
    capacity: 8,
    registered_count: 7,
    tags: ['валяние', 'шерсть', 'мастер-класс', 'аксессуары'],
    views_count: 543,
    favorites_count: 34,
    contact_phone: '+7 (902) 123-45-67',
    contact_email: 'svetlana@warm-hands.ru',
    requirements: 'Материалы предоставляются.',
    program: 'Валяние шапки или шарфа на выбор.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-15T14:00:00Z',
    updated_at: '2025-12-05T16:00:00Z',
  },
  {
    id: '48',
    title: 'Новогоднее караоке',
    slug: 'novogodnee-karaoke',
    description: 'Караоке-вечеринка с новогодними песнями',
    cover_image_url: 'https://images.unsplash.com/photo-1516873240891-4a6ffe8cfb08?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'commercial',
    organizer_name: 'Караоке-клуб "Звезда"',
    event_date: '2025-12-23T19:00:00Z',
    end_date: '2025-12-23T23:00:00Z',
    location: 'Караоке-клуб "Звезда"',
    address: 'г. Иркутск, ул. Советская, 125',
    price_type: 'paid',
    price_min: 500,
    age_restriction: '16+',
    format: 'offline',
    capacity: 50,
    registered_count: 38,
    tags: ['караоке', 'новый год', 'песни', 'вечеринка'],
    views_count: 1876,
    favorites_count: 97,
    contact_phone: '+7 (3952) 34-56-78',
    contact_email: 'info@zvezda-karaoke.ru',
    requirements: '',
    program: 'Караоке, конкурсы, призы за лучшее исполнение.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-18T17:00:00Z',
    updated_at: '2025-12-08T19:00:00Z',
  },
  {
    id: '49',
    title: 'Игротека для взрослых',
    slug: 'igroteka-dlya-vzroslyh',
    description: 'Вечер настольных игр для взрослых компаний',
    cover_image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'commercial',
    organizer_name: 'Антикафе "Игра"',
    event_date: '2025-12-24T18:00:00Z',
    end_date: '2025-12-24T23:00:00Z',
    location: 'Антикафе "Игра"',
    address: 'г. Иркутск, ул. Карла Маркса, 67',
    price_type: 'paid',
    price_min: 400,
    age_restriction: '18+',
    format: 'offline',
    capacity: 30,
    registered_count: 24,
    tags: ['настольные игры', 'взрослые', 'компания', 'досуг'],
    views_count: 987,
    favorites_count: 65,
    contact_phone: '+7 (3952) 45-67-89',
    contact_email: 'info@igra-cafe.ru',
    requirements: '',
    program: 'Стратегии, ролевые игры, чай/кофе.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-20T15:00:00Z',
    updated_at: '2025-12-10T17:00:00Z',
  },
  {
    id: '50',
    title: 'Кулинарный мастер-класс "Новогодние десерты"',
    slug: 'kulinarniy-mk-novogodnie-deserty',
    description: 'Готовим праздничные торты и пирожные',
    cover_image_url: 'https://images.unsplash.com/photo-1578298975216-cc5b95a94433?w=800',
    category_id: 'cat-gastronomy',
    category_name: 'Гастрономия',
    organizer_type: 'individual',
    organizer_name: 'Шеф-кондитер Анна Белкина',
    event_date: '2025-12-26T15:00:00Z',
    end_date: '2025-12-26T18:00:00Z',
    location: 'Кондитерская "Сладкие мечты"',
    address: 'г. Иркутск, ул. Лермонтова, 156',
    price_type: 'paid',
    price_min: 2200,
    age_restriction: '14+',
    format: 'offline',
    capacity: 10,
    registered_count: 9,
    tags: ['кулинария', 'десерты', 'новый год', 'торты'],
    views_count: 1543,
    favorites_count: 87,
    contact_phone: '+7 (3952) 56-78-90',
    contact_email: 'anna@sweet-dreams.ru',
    requirements: 'Фартуки предоставляются.',
    program: 'Готовим 3 вида новогодних десертов.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-22T13:00:00Z',
    updated_at: '2025-12-12T15:00:00Z',
  },
  {
    id: '51',
    title: 'Новогодний концерт симфонического оркестра',
    slug: 'novogodniy-kontsert-simfonicheskogo',
    description: 'Праздничный концерт классической музыки',
    cover_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category_id: 'cat-concerts-music',
    category_name: 'Концерты и Музыка',
    organizer_type: 'commercial',
    organizer_name: 'Иркутская филармония',
    event_date: '2025-12-27T19:00:00Z',
    end_date: '2025-12-27T21:30:00Z',
    location: 'Концертный зал филармонии',
    address: 'г. Иркутск, ул. Сухэ-Батора, 2',
    price_type: 'paid',
    price_min: 700,
    price_max: 2000,
    age_restriction: '6+',
    format: 'offline',
    capacity: 400,
    registered_count: 346,
    tags: ['симфония', 'новый год', 'классика', 'оркестр'],
    views_count: 4321,
    favorites_count: 267,
    contact_phone: '+7 (3952) 20-07-77',
    contact_email: 'tickets@philharmonic-irk.ru',
    requirements: '',
    program: 'Произведения Штрауса, Чайковского, оперетта.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-15T12:00:00Z',
    updated_at: '2025-11-30T14:00:00Z',
  },
  {
    id: '52',
    title: 'Медитативная практика "Встреча зимы"',
    slug: 'meditat-praktika-vstrecha-zimy',
    description: 'Групповая медитация и практики осознанности',
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category_id: 'cat-psychology-spiritual',
    category_name: 'Психология и Духовное развитие',
    organizer_type: 'community',
    organizer_name: 'Центр медитации "Путь"',
    event_date: '2025-12-28T11:00:00Z',
    end_date: '2025-12-28T13:00:00Z',
    location: 'Центр медитации "Путь"',
    address: 'г. Иркутск, ул. Киевская, 42',
    price_type: 'donation',
    age_restriction: '16+',
    format: 'offline',
    capacity: 25,
    registered_count: 18,
    tags: ['медитация', 'зима', 'осознанность', 'практики'],
    views_count: 765,
    favorites_count: 43,
    contact_phone: '+7 (902) 567-89-01',
    contact_email: 'info@meditation-path.ru',
    requirements: 'Удобная одежда, коврики предоставляются.',
    program: '2 часа медитативных практик с чаепитием.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-25T10:00:00Z',
    updated_at: '2025-12-15T12:00:00Z',
  },
  {
    id: '53',
    title: 'Новогодний мюзикл "Двенадцать месяцев"',
    slug: 'novogodniy-myuzikl-12-mesyatsev',
    description: 'Семейный мюзикл по мотивам сказки Маршака',
    cover_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    category_id: 'cat-theater-performance',
    category_name: 'Театр и Перформанс',
    organizer_type: 'commercial',
    organizer_name: 'Театр юного зрителя',
    event_date: '2025-12-29T18:00:00Z',
    end_date: '2025-12-29T20:00:00Z',
    location: 'ТЮЗ',
    address: 'г. Иркутск, ул. Ленина, 23',
    price_type: 'paid',
    price_min: 500,
    price_max: 1000,
    age_restriction: '6+',
    format: 'offline',
    capacity: 200,
    registered_count: 178,
    tags: ['мюзикл', 'новый год', 'дети', 'сказка'],
    views_count: 3456,
    favorites_count: 234,
    contact_phone: '+7 (3952) 27-54-84',
    contact_email: 'tickets@tuz-irk.ru',
    requirements: '',
    program: 'Мюзикл в 2 действиях с интермедией.',
    is_featured: true,
    is_published: true,
    created_at: '2025-09-10T15:00:00Z',
    updated_at: '2025-11-28T17:00:00Z',
  },
  {
    id: '54',
    title: 'Спортивный турнир по боулингу',
    slug: 'turnir-po-boulingu',
    description: 'Новогодний турнир по боулингу для любителей',
    cover_image_url: 'https://images.unsplash.com/photo-1544966503-7c73b1fbbf0c?w=800',
    category_id: 'cat-sport',
    category_name: 'Спорт',
    organizer_type: 'commercial',
    organizer_name: 'Боулинг-центр "Страйк"',
    event_date: '2025-12-30T15:00:00Z',
    end_date: '2025-12-30T19:00:00Z',
    location: 'Боулинг-центр "Страйк"',
    address: 'г. Иркутск, ул. Байкальская, 105Б',
    price_type: 'paid',
    price_min: 800,
    age_restriction: '12+',
    format: 'offline',
    capacity: 48,
    registered_count: 42,
    tags: ['боулинг', 'турнир', 'новый год', 'спорт'],
    views_count: 1234,
    favorites_count: 76,
    contact_phone: '+7 (3952) 78-90-12',
    contact_email: 'info@strike-bowling.ru',
    requirements: 'Сменная обувь предоставляется.',
    program: 'Командный турнир, призы, фуршет.',
    is_featured: false,
    is_published: true,
    created_at: '2025-11-28T16:00:00Z',
    updated_at: '2025-12-18T18:00:00Z',
  },
  {
    id: '55',
    title: 'Грандиозная новогодняя вечеринка',
    slug: 'grandioznaya-novogodnyaya-vecherinka',
    description: 'Самая большая новогодняя вечеринка города',
    cover_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category_id: 'cat-entertainment-nightlife',
    category_name: 'Развлечения и Ночная жизнь',
    organizer_type: 'commercial',
    organizer_name: 'Event Agency "Праздник+"',
    event_date: '2025-12-31T22:00:00Z',
    end_date: '2026-01-01T06:00:00Z',
    location: 'ДК "Энергетик"',
    address: 'г. Иркутск, ул. Трилиссера, 23',
    price_type: 'paid',
    price_min: 2500,
    price_max: 5000,
    age_restriction: '18+',
    format: 'offline',
    capacity: 800,
    registered_count: 623,
    tags: ['новый год', 'вечеринка', '2026', 'грандиозно'],
    views_count: 15432,
    favorites_count: 892,
    contact_phone: '+7 (3952) 99-88-77',
    contact_email: 'newyear@party-plus.ru',
    requirements: 'Нарядный дресс-код обязателен.',
    program: 'DJ-сеты, шоу-программа, салют в полночь.',
    is_featured: true,
    is_published: true,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-12-20T12:00:00Z',
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
