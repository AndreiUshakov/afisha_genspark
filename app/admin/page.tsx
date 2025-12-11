import { getModerationStats, getModerationTasks } from '@/lib/supabase/admin';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const stats = await getModerationStats();
  const recentTasks = await getModerationTasks({ limit: 5 });

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Панель администратора
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Управление контентом и модерация сайта
        </p>
      </div>

      {/* Статистика модерации */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ожидают проверки
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.pending_count || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <svg className="size-6 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                На проверке
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.in_review_count || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg className="size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"/>
                <path d="m15 5-3-3-3 3"/>
                <path d="m9 19 3 3 3-3"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Одобрено сегодня
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.approved_today || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Отклонено сегодня
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.rejected_today || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <svg className="size-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/moderation"
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6"/>
                <path d="M9 16h6"/>
                <path d="m14 2-3 3.5L8 2"/>
                <path d="M3 10v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10"/>
                <path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Задачи модерации</h3>
              <p className="text-red-100 text-sm mt-1">
                {stats?.pending_count || 0} ожидают проверки
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/communities"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Сообщества</h3>
              <p className="text-blue-100 text-sm mt-1">Управление сообществами</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Мероприятия</h3>
              <p className="text-purple-100 text-sm mt-1">Постмодерация событий</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Последние задачи модерации */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Последние задачи
            </h2>
            <Link
              href="/admin/moderation"
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Смотреть все →
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {recentTasks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto size-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Нет активных задач модерации</p>
            </div>
          ) : (
            recentTasks.map((task) => (
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      task.content_type === 'community' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      task.content_type === 'event' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      task.content_type === 'post' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-orange-100 dark:bg-orange-900/20'
                    }`}>
                      <svg className={`size-5 ${
                        task.content_type === 'community' ? 'text-blue-600 dark:text-blue-400' :
                        task.content_type === 'event' ? 'text-purple-600 dark:text-purple-400' :
                        task.content_type === 'post' ? 'text-green-600 dark:text-green-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {task.content_type === 'community' && (
                          <>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </>
                        )}
                        {task.content_type === 'event' && (
                          <>
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                            <line x1="16" x2="16" y1="2" y2="6"/>
                            <line x1="8" x2="8" y1="2" y2="6"/>
                            <line x1="3" x2="21" y1="10" y2="10"/>
                          </>
                        )}
                        {task.content_type === 'post' && (
                          <>
                            <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </>
                        )}
                        {task.content_type === 'expert' && (
                          <>
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                          </>
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.content_type === 'community' && 'Сообщество'}
                        {task.content_type === 'event' && 'Мероприятие'}
                        {task.content_type === 'post' && 'Пост'}
                        {task.content_type === 'expert' && 'Эксперт'}
                        {' - '}
                        {task.metadata?.name || task.metadata?.title || 'Без названия'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(task.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    task.status === 'in_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    task.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {task.status === 'pending' && 'Ожидает'}
                    {task.status === 'in_review' && 'На проверке'}
                    {task.status === 'approved' && 'Одобрено'}
                    {task.status === 'rejected' && 'Отклонено'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}