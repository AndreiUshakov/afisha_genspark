import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Проверяем, что мы на клиенте
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be used in browser environment')
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}