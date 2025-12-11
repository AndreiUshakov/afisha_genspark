import { getAllExperts } from '@/lib/supabase/admin';
import ExpertsTable from './components/ExpertsTable';

export default async function AdminExpertsPage() {
  const experts = await getAllExperts();
  
  const activeCount = experts.filter(e => e.is_active).length;
  const inactiveCount = experts.filter(e => !e.is_active).length;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Управление экспертами
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Просмотр и модерация профилей экспертов
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Всего экспертов
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {experts.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Активные
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {activeCount}
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
                Неактивные
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {inactiveCount}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
              <svg className="size-6 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица экспертов */}
      <ExpertsTable experts={experts} />
    </div>
  );
}