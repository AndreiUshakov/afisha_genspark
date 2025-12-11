import { getModerationTasks } from '@/lib/supabase/admin';
import ModerationTasksList from './components/ModerationTasksList';

export default async function ModerationPage() {
  const pendingTasks = await getModerationTasks({ status: 'pending' });
  const inReviewTasks = await getModerationTasks({ status: 'in_review' });

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Задачи модерации
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Проверка и публикация нового контента
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
          Все ({pendingTasks.length + inReviewTasks.length})
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-200 dark:border-neutral-700">
          Сообщества
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-200 dark:border-neutral-700">
          Мероприятия
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-200 dark:border-neutral-700">
          Посты
        </button>
        <button className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-200 dark:border-neutral-700">
          Эксперты
        </button>
      </div>

      {/* Ожидают проверки */}
      {pendingTasks.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ожидают проверки
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({pendingTasks.length})
              </span>
            </h2>
          </div>
          <ModerationTasksList tasks={pendingTasks} />
        </div>
      )}

      {/* На проверке */}
      {inReviewTasks.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              На проверке
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({inReviewTasks.length})
              </span>
            </h2>
          </div>
          <ModerationTasksList tasks={inReviewTasks} />
        </div>
      )}

      {/* Пустое состояние */}
      {pendingTasks.length === 0 && inReviewTasks.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-12">
          <div className="text-center">
            <svg className="mx-auto size-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Нет активных задач
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Все задачи модерации выполнены
            </p>
          </div>
        </div>
      )}
    </div>
  );
}