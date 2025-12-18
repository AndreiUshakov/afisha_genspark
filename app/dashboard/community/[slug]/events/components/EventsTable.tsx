'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Event, deleteEvent, toggleEventPublish, toggleEventFeatured } from '../actions'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface EventsTableProps {
  events: Event[]
  communitySlug: string
}

export default function EventsTable({ events, communitySlug }: EventsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isTogglingPublish, setIsTogglingPublish] = useState<string | null>(null)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState<string | null>(null)

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Вы уверены, что хотите удалить мероприятие "${eventTitle}"?`)) {
      return
    }

    setIsDeleting(eventId)
    try {
      await deleteEvent(eventId)
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Ошибка при удалении мероприятия')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleTogglePublish = async (eventId: string) => {
    setIsTogglingPublish(eventId)
    try {
      await toggleEventPublish(eventId)
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Ошибка при изменении статуса публикации')
    } finally {
      setIsTogglingPublish(null)
    }
  }

  const handleToggleFeatured = async (eventId: string) => {
    setIsTogglingFeatured(eventId)
    try {
      await toggleEventFeatured(eventId)
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Ошибка при изменении статуса избранного')
    } finally {
      setIsTogglingFeatured(null)
    }
  }

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const startDate = new Date(event.start_date)
    const endDate = event.end_date ? new Date(event.end_date) : null

    if (endDate && endDate < now) {
      return { label: 'Прошло', color: 'gray' }
    } else if (startDate <= now && (!endDate || endDate >= now)) {
      return { label: 'Идет сейчас', color: 'green' }
    } else {
      return { label: 'Запланировано', color: 'blue' }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          Нет мероприятий
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Начните с создания вашего первого мероприятия
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Мероприятие
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Дата начала
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Публикация
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Участники
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
            {events.map((event) => {
              const status = getEventStatus(event)
              return (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.cover_image_url ? (
                        <img
                          src={event.cover_image_url}
                          alt={event.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                          {event.is_featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              ⭐ Избранное
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">
                          {event.location_type === 'online' ? '🌐 Онлайн' : event.location_type === 'hybrid' ? '🔀 Гибрид' : '📍 ' + (event.venue_name || 'Офлайн')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(event.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status.color === 'green'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : status.color === 'blue'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(event.id)}
                      disabled={isTogglingPublish === event.id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.is_published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      } ${isTogglingPublish === event.id ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`}
                    >
                      {event.is_published ? '✓ Опубликовано' : '○ Черновик'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                    {event.registered_count} {event.capacity ? `/ ${event.capacity}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleFeatured(event.id)}
                        disabled={isTogglingFeatured === event.id}
                        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                          isTogglingFeatured === event.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={event.is_featured ? 'Убрать из избранного' : 'Добавить в избранное'}
                      >
                        <svg className={`h-5 w-5 ${event.is_featured ? 'text-yellow-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <Link
                        href={`/dashboard/community/${communitySlug}/events/${event.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={isDeleting === event.id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        {isDeleting === event.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}