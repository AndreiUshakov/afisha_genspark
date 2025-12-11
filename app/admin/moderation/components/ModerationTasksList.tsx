'use client';

import { ModerationTask } from '@/lib/supabase/admin';
import Link from 'next/link';

interface ModerationTasksListProps {
  tasks: ModerationTask[];
}

export default function ModerationTasksList({ tasks }: ModerationTasksListProps) {
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'community': return 'Сообщество';
      case 'event': return 'Мероприятие';
      case 'post': return 'Пост';
      case 'expert': return 'Эксперт';
      default: return type;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'community': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'event': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'post': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'expert': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'community':
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </>
        );
      case 'event':
        return (
          <>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </>
        );
      case 'post':
        return (
          <>
            <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
            <polyline points="14 2 14 8 20 8"/>
          </>
        );
      case 'expert':
        return (
          <>
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </>
        );
      default:
        return <circle cx="12" cy="12" r="10"/>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'normal': return 'text-blue-600 dark:text-blue-400';
      case 'low': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-neutral-700">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/admin/moderation/${task.id}`}
          className="block px-6 py-5 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Иконка типа контента */}
              <div className={`p-3 rounded-lg ${getContentTypeColor(task.content_type).split(' ')[0]} dark:${getContentTypeColor(task.content_type).split(' ')[2]}`}>
                <svg 
                  className={`size-6 ${getContentTypeColor(task.content_type).split(' ')[1]} dark:${getContentTypeColor(task.content_type).split(' ')[3]}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {getContentTypeIcon(task.content_type)}
                </svg>
              </div>

              {/* Информация о задаче */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getContentTypeColor(task.content_type)}`}>
                    {getContentTypeLabel(task.content_type)}
                  </span>
                  {task.priority !== 'normal' && (
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'urgent' && '🔴 Срочно'}
                      {task.priority === 'high' && '🟠 Высокий приоритет'}
                      {task.priority === 'low' && '⚪ Низкий приоритет'}
                    </span>
                  )}
                </div>
                
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {task.metadata?.name || task.metadata?.title || 'Без названия'}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {task.metadata?.description || 'Нет описания'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {new Date(task.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {task.metadata?.slug && (
                    <span className="flex items-center gap-1">
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      {task.metadata.slug}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка действия */}
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                Проверить
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}