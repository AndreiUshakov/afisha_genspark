'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleEventPublishStatus } from '@/app/admin/events/actions';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  start_date: string;
  created_at: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    email: string;
    full_name: string | null;
  } | null;
}

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events: initialEvents }: EventsTableProps) {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filteredEvents = events.filter(e => {
    if (filter === 'published') return e.is_published;
    if (filter === 'unpublished') return !e.is_published;
    return true;
  });

  const handleTogglePublish = async (eventId: string, currentStatus: boolean) => {
    setLoading(eventId);
    try {
      const result = await toggleEventPublishStatus(eventId, !currentStatus);
      
      if (result.success) {
        setEvents(prev => 
          prev.map(e => 
            e.id === eventId 
              ? { ...e, is_published: !currentStatus }
              : e
          )
        );
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      alert('Произошла ошибка при изменении статуса');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Список событий
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Все ({events.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'published'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Опубликованные ({events.filter(e => e.is_published).length})
            </button>
            <button
              onClick={() => setFilter('unpublished')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unpublished'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Не опубликованные ({events.filter(e => !e.is_published).length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Событие
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Организатор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Дата события
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Нет событий для отображения
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {event.cover_image_url ? (
                        <img
                          src={event.cover_image_url}
                          alt={event.title}
                          className="size-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                          <svg className="size-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                            <line x1="16" x2="16" y1="2" y2="6"/>
                            <line x1="8" x2="8" y1="2" y2="6"/>
                            <line x1="3" x2="21" y1="10" y2="10"/>
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/events/${event.slug}`}
                          target="_blank"
                          className="font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
                        >
                          {event.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {event.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.profiles?.full_name || 'Без имени'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {event.profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(event.start_date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.is_published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {event.is_published ? '✓ Опубликовано' : '⏳ Не опубликовано'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(event.id, event.is_published)}
                      disabled={loading === event.id}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        event.is_published
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === event.id ? 'Загрузка...' : event.is_published ? 'Снять с публикации' : 'Опубликовать'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}