import { getAllPosts } from '@/lib/supabase/admin';
import PostsTable from './components/PostsTable';

export default async function AdminPostsPage() {
  const posts = await getAllPosts();
  
  const publishedCount = posts.filter(p => p.is_published).length;
  const unpublishedCount = posts.filter(p => !p.is_published).length;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Управление постами блога
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Постмодерация публикаций в блоге
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Всего постов
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Опубликовано
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {publishedCount}
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
                Не опубликовано
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {unpublishedCount}
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
      </div>

      {/* Таблица постов */}
      <PostsTable posts={posts} />
    </div>
  );
}