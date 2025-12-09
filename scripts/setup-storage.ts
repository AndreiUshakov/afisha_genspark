/**
 * Скрипт для настройки Supabase Storage
 * Создает bucket для профилей, если его еще нет
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Отсутствуют переменные окружения NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🚀 Настройка Supabase Storage...\n')

  try {
    // Проверяем существование bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Ошибка при получении списка buckets:', listError.message)
      return
    }

    const profilesBucket = buckets?.find(b => b.name === 'profiles')

    if (profilesBucket) {
      console.log('✅ Bucket "profiles" уже существует')
      console.log(`   - ID: ${profilesBucket.id}`)
      console.log(`   - Public: ${profilesBucket.public}`)
      console.log(`   - Created: ${profilesBucket.created_at}`)
    } else {
      console.log('📦 Создание bucket "profiles"...')
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('profiles', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*']
      })

      if (createError) {
        console.error('❌ Ошибка при создании bucket:', createError.message)
        return
      }

      console.log('✅ Bucket "profiles" успешно создан')
      console.log(`   - ID: ${newBucket.name}`)
    }

    console.log('\n📋 Проверка политик...')
    console.log('⚠️  Политики нужно создать вручную через SQL или Supabase Dashboard')
    console.log('   См. файл: supabase/migrations/20231209_create_profiles_bucket.sql')

    console.log('\n✨ Настройка завершена!')
    
  } catch (error) {
    console.error('❌ Неожиданная ошибка:', error)
  }
}

setupStorage()