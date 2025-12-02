import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Загружаем переменные окружения из .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testConnection() {
  console.log('🔍 Проверка подключения к Supabase...\n')
  
  console.log('URL:', supabaseUrl)
  console.log('Key (первые 20 символов):', supabaseKey.substring(0, 20) + '...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Проверяем подключение через простой запрос
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.log('⚠️  Таблица profiles еще не создана (это нормально на начальном этапе)')
      console.log('Ошибка:', error.message)
      console.log('Ошибка:', error.stack)
      console.log('\n✅ Подключение к Supabase установлено!')
      console.log('📝 Следующий шаг: создать схему базы данных')
    } else {
      console.log('✅ Подключение успешно!')
      console.log('✅ Таблица profiles существует')
      console.log('Данные:', data)
    }
  } catch (err) {
    console.error('❌ Ошибка подключения:', err)
    console.log('\n🔧 Проверьте:')
    console.log('1. Правильность NEXT_PUBLIC_SUPABASE_URL в .env.local')
    console.log('2. Правильность NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local')
    console.log('3. Доступность Supabase проекта')
  }
}

async function debugRawRequest() {
  console.log('🔍 --- RAW DEBUG START ---');
  
  // Эндпоинт REST API Supabase (обычно /rest/v1/)
  const restUrl = `${supabaseUrl}/rest/v1/profiles?select=count&limit=1`;
  
  try {
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,          // API Key (обязательно)
        'Authorization': `Bearer ${supabaseKey}`, // JWT токен (обязательно)
        'Content-Type': 'application/json'
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    // Читаем тело ответа как текст, чтобы увидеть детали ошибки
    const text = await response.text();
    console.log('Body:', text);
    
    // Полезные заголовки отладки
    console.log('WWW-Authenticate Header:', response.headers.get('www-authenticate'));
    console.log('Date Header (check server time sync):', response.headers.get('date'));

  } catch (err) {
    console.error('Raw fetch error:', err);
  }
  console.log('🔍 --- RAW DEBUG END ---\n');
}

debugRawRequest();
testConnection()