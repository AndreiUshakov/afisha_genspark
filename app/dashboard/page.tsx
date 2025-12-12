import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmailVerificationBanner from '@/components/dashboard/EmailVerificationBanner'
import EmptyState from '@/components/dashboard/EmptyState'
import ProtectedLink from './components/ProtectedLink'
import SuccessBanner from './components/SuccessBanner'
import UserCommunities from './components/UserCommunities'

async function getUserData() {
  const supabase = await createClient()
  
  // Получаем текущего пользователя
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Получаем профиль пользователя из таблицы profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Получаем избранные события
  const { data: favorites, count: favoritesCount } = await supabase
    .from('favorites')
    .select('*, event:events(*)', { count: 'exact' })
    .eq('user_id', user.id)
    .not('event_id', 'is', null)

  // Получаем регистрации на события
  const { data: registrations, count: registrationsCount } = await supabase
    .from('event_registrations')
    .select('*, event:events(*)', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', 'registered')
    .gte('event.start_date', new Date().toISOString())
    .order('event(start_date)', { ascending: true })
    .limit(3)

  // Получаем посещенные события
  const { count: attendedCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'attended')

  // Получаем сообщества пользователя с категориями
  const { data: communities } = await supabase
    .from('communities')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Получаем профиль эксперта
  const { data: expertProfile } = await supabase
    .from('experts')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  // Получаем подписки на сообщества
  const { count: subscriptionsCount } = await supabase
    .from('community_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return {
    user,
    profile,
    favorites: favorites || [],
    favoritesCount: favoritesCount || 0,
    registrations: registrations || [],
    upcomingCount: registrationsCount || 0,
    attendedCount: attendedCount || 0,
    subscriptionsCount: subscriptionsCount || 0,
    communities: communities || [],
    expertProfile,
  }
}

export default async function DashboardPage() {
  const data = await getUserData()
  const isEmailVerified = data.user.email_confirmed_at !== null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Баннер об успешном подтверждении email */}
      <SuccessBanner />
      
      {/* Баннер о неподтвержденном email */}
      {!isEmailVerified && data.user.email && (
        <EmailVerificationBanner email={data.user.email} />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Добро пожаловать{data.profile?.full_name ? `, ${data.profile.full_name}` : ''}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Управляйте своим профилем и отслеживайте избранные события
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Избранные</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.favoritesCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Подписки</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.subscriptionsCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Ближайшие</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.upcomingCount}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Посещено</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.attendedCount}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg dark:bg-orange-900/20">
              <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Мои сообщества */}
      {data.communities.length > 0 && (
        <div className="mb-8">
          <UserCommunities communities={data.communities} />
        </div>
      )}

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Быстрые действия
          </h2>
          <div className="space-y-3">
            <a href="/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <svg className="size-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Найти мероприятия</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Открыть каталог событий</p>
              </div>
            </a>
            <a href="/dashboard/favorites" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="p-2 bg-red-50 rounded-lg dark:bg-red-900/20">
                <svg className="size-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Мое избранное</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Посмотреть сохраненные события</p>
              </div>
            </a>
            <ProtectedLink
              href="/dashboard/create-community"
              isEmailVerified={isEmailVerified}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                !isEmailVerified
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
              }`}
            >
              <div className="p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
                <svg className="size-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Создать сообщество
                  {!isEmailVerified && <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">🔒</span>}
                </p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Стать организатором событий</p>
              </div>
            </ProtectedLink>
            <ProtectedLink
              href="/dashboard/expert"
              isEmailVerified={isEmailVerified}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                !isEmailVerified
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
              }`}
            >
              <div className="p-2 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                <svg className="size-5 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Стать экспертом
                  {!isEmailVerified && <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">🔒</span>}
                </p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">Предложить свои услуги</p>
              </div>
            </ProtectedLink>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ближайшие события
          </h2>
          {data.registrations.length === 0 ? (
            <EmptyState
              icon={
                <svg className="size-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
              title="Нет предстоящих событий"
              description="Зарегистрируйтесь на интересующие вас мероприятия, чтобы они отображались здесь"
              action={{
                label: 'Найти события',
                href: '/events'
              }}
            />
          ) : (
            <div className="space-y-4">
              {data.registrations.map((reg: any) => {
                const event = reg.event
                const date = new Date(event.start_date)
                return (
                  <div key={reg.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {date.getDate()}
                      <span className="text-xs ml-1">
                        {date.toLocaleDateString('ru', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} • {event.venue_name || 'Онлайн'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

       {/* Медиагалерея - превью ПЕРЕНОСИМ В СТРАНИЦУ СООБЩЕСТВА */}
        {/*     <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📸 Медиагалерея
          </h2>
          <a href="/dashboard/community/media" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
            Посмотреть все →
          </a>
        </div>
        
        {data.communities.length === 0 && !data.expertProfile ? (
          <EmptyState
            icon={
              <svg className="size-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            }
            title="Медиагалерея пуста"
            description="Создайте сообщество или профиль эксперта, чтобы начать загружать фотографии и видео"
          />
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
                'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
                'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
                'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400'
              ].map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-700 hover:opacity-80 transition-opacity cursor-pointer">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              {data.communities.length > 0 && (
                <a
                  href="/dashboard/community/media"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                >
                  Управление галереей
                </a>
              )}
              {data.expertProfile && (
                <a
                  href="/dashboard/expert/media"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
                >
                  Галерея эксперта
                </a>
              )}
            </div>
          </>
        )}
      </div> */}

    </div>
  )
}
