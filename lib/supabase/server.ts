import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Проверяем наличие переменных окружения
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    console.error('❌ Отсутствуют переменные окружения Supabase:', missingVars.join(', '))
    console.error('📖 Инструкция по настройке: см. AMVERA_ENV_SETUP.md')
    
    throw new Error(
      `Отсутствуют переменные окружения Supabase: ${missingVars.join(', ')}. ` +
      'Для деплоя на Amvera добавьте их в Settings → Environment Variables. ' +
      'См. AMVERA_ENV_SETUP.md для подробных инструкций.'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Игнорируем ошибки в Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Игнорируем ошибки в Server Components
          }
        },
      },
    }
  )
}