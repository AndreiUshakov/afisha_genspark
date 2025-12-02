import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Загружаем переменные окружения из .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Ошибка: Переменные окружения не настроены!')
  console.error('Проверьте файл .env.local:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Проверка подключения к Supabase...\n')
  console.log(`📍 URL: ${supabaseUrl}\n`)
  
  // Тест 1: Проверка базового подключения
  console.log('1️⃣ Проверка базового подключения...')
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Ошибка подключения:', error.message)
      console.error('💡 Возможные причины:')
      console.error('   - Таблицы еще не созданы')
      console.error('   - Неверные ключи доступа')
      console.error('   - Проблемы с сетью\n')
      return false
    }
    
    console.log('✅ Подключение успешно!\n')
  } catch (err) {
    console.error('❌ Критическая ошибка:', err)
    return false
  }
  
  // Тест 2: Проверка всех таблиц
  console.log('2️⃣ Проверка таблиц базы данных...')
  const tables = [
    'profiles',
    'categories', 
    'communities',
    'experts',
    'events',
    'posts',
    'favorites',
    'event_registrations',
    'reviews',
    'community_members'
  ]
  
  let allTablesExist = true
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.error(`❌ Таблица "${table}": ${error.message}`)
        allTablesExist = false
      } else {
        console.log(`✅ Таблица "${table}" доступна`)
      }
    } catch (err) {
      console.error(`❌ Таблица "${table}": Ошибка проверки`)
      allTablesExist = false
    }
  }
  
  console.log('')
  
  if (!allTablesExist) {
    console.error('⚠️  Некоторые таблицы не найдены!')
    console.error('💡 Выполните SQL-скрипт из файла supabase/schema.sql\n')
    return false
  }
  
  // Тест 3: Проверка Storage buckets
  console.log('3️⃣ Проверка Storage buckets...')
  const buckets = ['avatars', 'covers', 'events', 'communities', 'posts']
  
  try {
    const { data: existingBuckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('❌ Ошибка проверки Storage:', error.message)
    } else {
      const bucketNames = existingBuckets?.map(b => b.name) || []
      
      for (const bucket of buckets) {
        if (bucketNames.includes(bucket)) {
          console.log(`✅ Bucket "${bucket}" существует`)
        } else {
          console.log(`⚠️  Bucket "${bucket}" не найден`)
        }
      }
    }
  } catch (err) {
    console.error('❌ Ошибка проверки Storage:', err)
  }
  
  console.log('')
  
  // Тест 4: Проверка аутентификации
  console.log('4️⃣ Проверка Auth сервиса...')
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Ошибка Auth:', error.message)
    } else {
      console.log('✅ Auth сервис работает')
      if (data.session) {
        console.log(`   Пользователь: ${data.session.user.email}`)
      } else {
        console.log('   (Пользователь не авторизован)')
      }
    }
  } catch (err) {
    console.error('❌ Ошибка Auth:', err)
  }
  
  console.log('')
  
  // Итоговый результат
  console.log('═'.repeat(50))
  if (allTablesExist) {
    console.log('✨ Все проверки пройдены успешно!')
    console.log('🚀 Можно приступать к миграции данных')
    console.log('═'.repeat(50))
    return true
  } else {
    console.log('⚠️  Обнаружены проблемы')
    console.log('📖 Смотрите docs/SUPABASE_SETUP_GUIDE.md для инструкций')
    console.log('═'.repeat(50))
    return false
  }
}

testConnection()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('💥 Критическая ошибка:', err)
    process.exit(1)
  })