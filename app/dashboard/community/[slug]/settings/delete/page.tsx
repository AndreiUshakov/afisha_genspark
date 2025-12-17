import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DeleteCommunityForm from './components/DeleteCommunityForm';
import { getCommunityEventsInfo } from './actions';

interface DeletePageProps {
  params: {
    slug: string;
  };
}

export default async function DeleteCommunityPage({ params }: DeletePageProps) {
  const supabase = await createClient();
  const { slug } = await params;
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/auth/login');
  }

  // Проверяем, что сообщество принадлежит пользователю
  const { data: community, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .is('deleted_at', null)
    .single();
  
  if (!community) {
    notFound();
  }

  // Получаем информацию о событиях
  const eventsInfo = await getCommunityEventsInfo(slug);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Заголовок с предупреждением */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
            <svg className="size-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Удаление сообщества
            </h1>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              Это действие нельзя будет отменить самостоятельно
            </p>
          </div>
        </div>
      </div>

      {/* Информационный блок */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 dark:bg-yellow-900/20 dark:border-yellow-600">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
              Важная информация об удалении
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc list-inside space-y-1">
                <li>Сообщество будет <strong>удалено</strong> вместе или отдельно от мероприятий</li>
                <li>Вы можете выбрать, что делать с событиями: удалить все, только будущие или сохранить все</li>
                <li>Обратитесь к администратору сайта, если захотите восстановить сообщество</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Информация о сообществе */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 dark:bg-neutral-800 dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Информация о сообществе
        </h2>
        <div className="flex items-center gap-4 mb-6">
          {community.avatar_url ? (
            <img
              src={community.avatar_url}
              alt={community.name}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {community.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {community.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              {community.description || 'Описание не указано'}
            </p>
          </div>
        </div>

        {/* Статистика событий */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {eventsInfo.totalEvents}
            </div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              Всего событий
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {eventsInfo.futureEvents}
            </div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              Запланированных
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {eventsInfo.pastEvents}
            </div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              Прошедших
            </div>
          </div>
        </div>

        {/* Список будущих событий */}
        {eventsInfo.futureEvents > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Запланированные события:
            </h3>
            <div className="space-y-2">
              {eventsInfo.futureEventsList.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                >
                  <svg className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      {new Date(event.start_date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {eventsInfo.futureEvents > 10 && (
                <div className="text-sm text-gray-600 dark:text-neutral-400 text-center py-2">
                  ... и еще {eventsInfo.futureEvents - 10} событий
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Форма удаления */}
      <DeleteCommunityForm
        communitySlug={slug}
        communityName={community.name}
        hasEvents={eventsInfo.totalEvents > 0}
        hasFutureEvents={eventsInfo.futureEvents > 0}
      />
    </div>
  );
}