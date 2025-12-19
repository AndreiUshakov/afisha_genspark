'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { publishEvent } from '../../actions'

interface PublishEventButtonProps {
  eventId: string
  communitySlug: string
}

export default function PublishEventButton({ eventId, communitySlug }: PublishEventButtonProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublish = async () => {
    setIsPublishing(true)
    setError(null)

    try {
      const result = await publishEvent(eventId, communitySlug)

      if (result.success) {
        // Обновляем страницу для показа нового статуса
        router.refresh()
        setShowConfirm(false)
      } else {
        setError(result.error || 'Произошла ошибка при публикации')
      }
    } catch (err) {
      console.error('Error publishing event:', err)
      setError('Произошла непредвиденная ошибка')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-colors font-medium flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Опубликовать мероприятие
      </button>

      {/* Модальное окно подтверждения */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Опубликовать мероприятие?
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
                  После публикации мероприятие будет отправлено на пост-модерацию администраторами. 
                  После одобрения оно станет доступно всем пользователям платформы.
                </p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Что произойдет после публикации:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li>Мероприятие отправится на модерацию</li>
                    <li>Администраторы проверят информацию</li>
                    <li>После одобрения событие появится в каталоге</li>
                    <li>Пользователи смогут регистрироваться на событие</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setError(null)
                }}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Публикация...' : 'Да, опубликовать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}