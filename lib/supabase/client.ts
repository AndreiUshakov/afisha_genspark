import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Проверяем, что мы на клиенте
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be used in browser environment')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    console.error('❌ Отсутствуют переменные окружения Supabase:', {
      missing: missingVars,
      current: {
        url: supabaseUrl ? 'установлена' : 'отсутствует',
        key: supabaseAnonKey ? 'установлен' : 'отсутствует'
      }
    })
    console.error('📖 Инструкция по настройке: см. AMVERA_ENV_SETUP.md')
    
    throw new Error(
      `Отсутствуют переменные окружения Supabase: ${missingVars.join(', ')}. ` +
      'Для деплоя на Amvera добавьте их в Settings → Environment Variables. ' +
      'См. AMVERA_ENV_SETUP.md для подробных инструкций.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}