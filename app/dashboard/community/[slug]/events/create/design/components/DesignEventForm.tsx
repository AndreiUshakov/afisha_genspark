'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateEventDesign } from '../../actions'

interface Event {
  id: string
  title: string
  cover_image_url: string | null
  gallery_images: string[]
}

interface CommunityMedia {
  id: string
  file_url: string
  file_type: string
  title: string | null
}

interface DesignEventFormProps {
  event: Event
  communitySlug: string
  communityMedia: CommunityMedia[]
}

export default function DesignEventForm({ event, communitySlug, communityMedia }: DesignEventFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Состояние для обложки
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(event.cover_image_url)
  const [removeCover, setRemoveCover] = useState(false)

  // Состояние для галереи
  const [galleryImages, setGalleryImages] = useState<string[]>(event.gallery_images || [])
  const [showMediaSelector, setShowMediaSelector] = useState(false)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Можно загружать только изображения' })
        e.target.value = ''
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Размер файла не должен превышать 5 МБ' })
        e.target.value = ''
        return
      }
      
      setCoverFile(file)
      setRemoveCover(false)
      setMessage(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
    setRemoveCover(true)
  }

  const handleSelectFromGallery = (imageUrl: string) => {
    if (!galleryImages.includes(imageUrl)) {
      setGalleryImages([...galleryImages, imageUrl])
    }
  }

  const handleRemoveFromGallery = (imageUrl: string) => {
    setGalleryImages(galleryImages.filter(img => img !== imageUrl))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('eventId', event.id)
      formData.append('communitySlug', communitySlug)
      
      if (removeCover) {
        formData.append('removeCover', 'true')
      } else if (coverFile) {
        formData.append('cover', coverFile)
      }
      
      formData.append('galleryImages', JSON.stringify(galleryImages))

      const result = await updateEventDesign(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Оформление сохранено! Переходим к контенту...' })
        setTimeout(() => {
          router.push(`/dashboard/community/${communitySlug}/events/create/content?eventId=${event.id}`)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.error || 'Произошла ошибка при сохранении' })
      }
    } catch (error) {
      console.error('Error updating event design:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при сохранении' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Сообщение об успехе/ошибке */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900' 
            : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900'
        }`}>
          {message.text}
        </div>
      )}

      {/* Обложка мероприятия */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Обложка мероприятия
        </h2>

        <div className="space-y-4">
          {/* Превью обложки */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-900">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Обложка не загружена</p>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium">
              <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Загрузить обложку
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
            {coverPreview && (
              <button
                onClick={handleRemoveCover}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Удалить
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Рекомендуемый размер: 1200x630px. Максимальный размер файла: 5 МБ
          </p>
        </div>
      </div>

      {/* Фотогалерея */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Фотогалерея мероприятия
          </h2>
          <button
            onClick={() => setShowMediaSelector(!showMediaSelector)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {showMediaSelector ? 'Скрыть медиагалерею' : 'Выбрать из медиагалереи'}
          </button>
        </div>

        {/* Медиагалерея сообщества */}
        {showMediaSelector && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Медиагалерея сообщества
            </h3>
            {communityMedia.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {communityMedia.filter(m => m.file_type.startsWith('image/')).map((media) => (
                  <button
                    key={media.id}
                    onClick={() => handleSelectFromGallery(media.file_url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      galleryImages.includes(media.file_url)
                        ? 'border-green-500 ring-2 ring-green-500'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-purple-500'
                    }`}
                  >
                    <Image
                      src={media.file_url}
                      alt={media.title || 'Media'}
                      fill
                      className="object-cover"
                    />
                    {galleryImages.includes(media.file_url) && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-neutral-400 text-center py-8">
                Медиагалерея сообщества пуста. Загрузите изображения в разделе "Медиа галерея".
              </p>
            )}
          </div>
        )}

        {/* Выбранные изображения */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveFromGallery(imageUrl)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Фотогалерея пуста</p>
            <p className="text-sm mt-1">Выберите изображения из медиагалереи сообщества</p>
          </div>
        )}
      </div>

      {/* Информационный блок */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Использование медиагалереи сообщества
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Вы можете использовать изображения из общей медиагалереи вашего сообщества. 
              Это удобно для повторного использования фотографий команды, помещений или других материалов.
            </p>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/community/${communitySlug}/events/create/basic?eventId=${event.id}`)}
          className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
        >
          ← Назад к основным настройкам
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/community/${communitySlug}/events/create/content?eventId=${event.id}`)}
            className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
          >
            Пропустить
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить и продолжить →'}
          </button>
        </div>
      </div>
    </div>
  )
}