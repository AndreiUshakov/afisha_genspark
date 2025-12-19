'use client'

import { useState } from 'react'
import { toggleEventPublish } from '../../../actions'
import { useRouter } from 'next/navigation'

interface PublishEventButtonProps {
  eventId: string
  isPublished: boolean
  communitySlug: string
}

export function PublishEventButton({ eventId, isPublished, communitySlug }: PublishEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTogglePublish = async () => {
    if (isLoading) return

    const action = isPublished ? 'снять с публикации' : 'опубликовать'
    const confirmed = confirm(
      `Вы уверены, что хотите ${action} это мероприятие?${
        isPublished 
          ? '\n\nМероприятие станет недоступным для пользователей.' 
          : '\n\nМероприятие станет видимым для всех пользователей.'
      }`
    )

    if (!confirmed) return

    setIsLoading(true)

    try {
      await toggleEventPublish(eventId)
      router.refresh()
    } catch (error) {
      console.error('Error toggling event publish status:', error)
      alert(`Ошибка при изменении статуса публикации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleTogglePublish}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isPublished
          ? 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-yellow-400'
          : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400'
      } disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Обработка...</span>
        </>
      ) : isPublished ? (
        <>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Снять с публикации</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Опубликовать</span>
        </>
      )}
    </button>
  )
}