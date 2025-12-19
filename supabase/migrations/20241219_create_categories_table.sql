-- Создание таблицы категорий для мероприятий
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji или название иконки
  color TEXT, -- цвет для UI
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- RLS политики
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Все могут читать активные категории
DROP POLICY IF EXISTS "Все могут читать активные категории" ON public.categories;
CREATE POLICY "Все могут читать активные категории" ON public.categories
  FOR SELECT USING (is_active = true);

-- Только админы могут управлять категориями
DROP POLICY IF EXISTS "Только админы управляют категориями" ON public.categories;
CREATE POLICY "Только админы управляют категориями" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Вставка базовых категорий
INSERT INTO public.categories (name, slug, description, icon, color, sort_order) VALUES
  ('Концерты и Музыка', 'concerts-music', 'Концерты, живая музыка, музыкальные фестивали', '🎵', '#FF6B6B', 1),
  ('Театр и Перформанс', 'theater-performance', 'Театральные постановки, перформансы, шоу', '🎭', '#4ECDC4', 2),
  ('Выставки и Искусство', 'exhibitions-art', 'Художественные выставки, галереи, арт-пространства', '🎨', '#95E1D3', 3),
  ('Образование', 'education', 'Лекции, курсы, семинары, мастер-классы', '📚', '#F38181', 4),
  ('Спорт', 'sport', 'Спортивные мероприятия, соревнования, тренировки', '⚽', '#AA96DA', 5),
  ('Фестивали', 'festivals', 'Культурные, музыкальные, гастрономические фестивали', '🎊', '#FCBAD3', 6),
  ('Для Детей', 'children', 'Детские мероприятия, спектакли, праздники', '🧸', '#FFFFD2', 7),
  ('Кино и Медиа', 'cinema-media', 'Кинопоказы, фестивали кино, медиа-события', '🎬', '#A8D8EA', 8),
  ('Развлечения и Ночная жизнь', 'entertainment-nightlife', 'Вечеринки, клубные мероприятия, развлечения', '🌙', '#AA96DA', 9),
  ('Гастрономия', 'gastronomy', 'Кулинарные мастер-классы, дегустации, фуд-ивенты', '🍴', '#FFD3B6', 10),
  ('Хобби и Ремесла', 'hobbies-crafts', 'Мастер-классы по рукоделию, творческие занятия', '✂️', '#FFAAA5', 11),
  ('Экология и ЗОЖ', 'ecology-health', 'Здоровый образ жизни, эко-инициативы, йога', '🌱', '#A8E6CF', 12),
  ('Бизнес и Нетворкинг', 'business-networking', 'Деловые встречи, конференции, нетворкинг', '💼', '#C7CEEA', 13),
  ('Психология и Духовное развитие', 'psychology-spiritual', 'Тренинги, медитации, духовные практики', '🧘', '#B5EAD7', 14),
  ('Мода и Красота', 'fashion-beauty', 'Показы мод, мастер-классы по красоте', '💄', '#FFB7B2', 15)
ON CONFLICT (slug) DO NOTHING;

-- Комментарии
COMMENT ON TABLE public.categories IS 'Категории мероприятий';
COMMENT ON COLUMN public.categories.parent_id IS 'Ссылка на родительскую категорию для иерархии';
COMMENT ON COLUMN public.categories.sort_order IS 'Порядок сортировки категорий';