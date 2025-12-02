import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { mockCategories } from '../data/mockCategories';

// Загружаем переменные окружения из .env.local
config({ path: '.env.local' });

// Инициализация Supabase клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Ошибка: Не заданы переменные окружения NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateCategories() {
  console.log('🚀 Начинаем миграцию категорий...\n');

  try {
    // Проверяем подключение
    const { error: connectionError } = await supabase.from('categories').select('count').limit(1);
    if (connectionError) {
      throw new Error(`Ошибка подключения к Supabase: ${connectionError.message}`);
    }

    console.log('✅ Подключение к Supabase установлено\n');

    // Подготавливаем данные для вставки
    const categoriesToInsert = mockCategories.map(category => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      featured_on_hero: category.featuredonhero,
      created_at: category.created_at,
      updated_at: category.updated_at
    }));

    console.log(`📊 Подготовлено категорий для миграции: ${categoriesToInsert.length}\n`);

    // Вставляем категории
    const { data, error } = await supabase
      .from('categories')
      .upsert(categoriesToInsert, {
        onConflict: 'slug',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      throw new Error(`Ошибка при вставке категорий: ${error.message}`);
    }

    console.log(`✅ Успешно мигрировано категорий: ${data?.length || 0}\n`);

    // Выводим статистику
    console.log('📈 Статистика миграции:');
    console.log('─'.repeat(50));
    
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('*');

    if (countError) {
      console.warn('⚠️  Не удалось получить статистику:', countError.message);
    } else {
      console.log(`Всего категорий в БД: ${allCategories?.length || 0}`);
      
      const featuredCount = allCategories?.filter(c => c.featured_on_hero).length || 0;
      console.log(`Категорий на главной: ${featuredCount}`);
      
      console.log('\n📋 Список категорий:');
      allCategories?.forEach((cat, index) => {
        const featured = cat.featured_on_hero ? '⭐' : '  ';
        console.log(`${featured} ${index + 1}. ${cat.name} (${cat.slug})`);
      });
    }

    console.log('\n✨ Миграция категорий завершена успешно!');

  } catch (error) {
    console.error('\n❌ Ошибка при миграции категорий:');
    console.error(error);
    process.exit(1);
  }
}

// Запускаем миграцию
migrateCategories();