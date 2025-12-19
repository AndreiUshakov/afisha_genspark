'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateEventDesignCover, uploadEventCoverImage } from '../actions'

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string | null
  location_type: 'physical' | 'online' | 'hybrid'
  venue_name: string | null
  venue_address: string | null
  cover_image_url: string | null
}

interface CommunityMedia {
  id: string
  file_url: string
  file_type?: string
  mime_type?: string
  title: string | null
}

interface DesignEventEditFormProps {
  event: Event
  communitySlug: string
  communityId: string
  communityMedia: CommunityMedia[]
}

export default function DesignEventEditForm({ event, communitySlug, communityId, communityMedia }: DesignEventEditFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Режим редактирования
  const [editMode, setEditMode] = useState<'view' | 'edit'>('view')

  // Состояние для обложки
  const [selectedCoverMediaId, setSelectedCoverMediaId] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(event.cover_image_url)
  const [removeCover, setRemoveCover] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleSelectCover = (mediaId: string, mediaUrl: string) => {
    setSelectedCoverMediaId(mediaId)
    setCoverPreview(mediaUrl)
    setRemoveCover(false)
    setMessage(null)
  }

  const handleRemoveCover = () => {
    setSelectedCoverMediaId(null)
    setCoverPreview(null)
    setRemoveCover(true)
    setCoverFile(null)
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Можно загружать только изображения' })
        e.target.value = ''
        return
      }
      
      // Проверка размера файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Размер файла не должен превышать 10 МБ' })
        e.target.value = ''
        return
      }
      
      setCoverFile(file)
      setRemoveCover(false)
      setSelectedCoverMediaId(null)
      setMessage(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadCover = async () => {
    if (!coverFile) return

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('eventId', event.id)
      formData.append('communityId', communityId)
      formData.append('coverFile', coverFile)

      const result = await uploadEventCoverImage(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Изображение загружено в медиагалерею и установлено как обложка!' })
        setCoverFile(null)
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Произошла ошибка при загрузке' })
      }
    } catch (error) {
      console.error('Error uploading cover:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при загрузке' })
    } finally {
      setIsUploading(false)
    }
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
      } else if (selectedCoverMediaId) {
        formData.append('coverMediaId', selectedCoverMediaId)
      }

      const result = await updateEventDesignCover(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Оформление успешно сохранено!' })
        setEditMode('view')
        setSelectedCoverMediaId(null)
        setRemoveCover(false)
        setCoverFile(null)
        router.refresh()
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

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Получение информации о месте
  const getLocationInfo = () => {
    if (event.location_type === 'online') {
      return 'Онлайн'
    } else if (event.location_type === 'hybrid') {
      return event.venue_name || 'Гибридный формат'
    } else {
      return event.venue_name || 'Офлайн'
    }
  }

  // Фильтруем только изображения
  const imageMedia = communityMedia.filter(m => {
    const mimeType = m.mime_type || m.file_type
    return mimeType && mimeType.startsWith('image/')
  })

  return (
    <div>
      {/* Заголовок и кнопки управления */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => setEditMode(editMode === 'view' ? 'edit' : 'view')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode === 'edit'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
            }`}
          >
            {editMode === 'edit' ? '👁️ Режим просмотра' : '✏️ Режим редактирования'}
          </button>
          {editMode === 'edit' && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? '💾 Сохранение...' : '💾 Сохранить изменения'}
            </button>
          )}
        </div>
      </div>

      {/* Сообщения об успехе/ошибке */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Превью страницы мероприятия - как на публичной странице */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] md:h-[500px]">
          {/* Cover Image */}
          <div className="absolute inset-0">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Event cover"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
          </div>

          {/* Event Info */}
          <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-8 md:pb-12">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl">{event.description}</p>
              
              {/* Event Details */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{getLocationInfo()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>125 участников</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Выбор обложки из медиагалереи */}
      {editMode === 'edit' && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Выбор обложки из медиагалереи
            </h2>
            <div className="flex gap-2">
              {/* Кнопка загрузки нового изображения */}
              <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Загрузить изображение
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="hidden"
                />
              </label>
              {coverPreview && (
                <button
                  onClick={handleRemoveCover}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Удалить обложку
                </button>
              )}
            </div>
          </div>

          {/* Превью и кнопка применения загруженного файла */}
          {coverFile && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Выбран файл: {coverFile.name}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Нажмите "Применить", чтобы загрузить изображение в медиагалерею и установить как обложку
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUploadCover}
                  disabled={isUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isUploading ? '⏳ Загрузка...' : '✓ Применить'}
                </button>
              </div>
            </div>
          )}

          {imageMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageMedia.map((media) => (
                <button
                  key={media.id}
                  onClick={() => handleSelectCover(media.id, media.file_url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    coverPreview === media.file_url
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-blue-300'
                  }`}
                >
                  <Image
                    src={media.file_url}
                    alt={media.title || 'Media'}
                    fill
                    className="object-cover"
                  />
                  {coverPreview === media.file_url && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {media.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                      {media.title}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
              <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Медиагалерея сообщества пуста</p>
              <p className="text-sm mt-1">Загрузите изображения в разделе "Медиа галерея" сообщества</p>
            </div>
          )}
        </div>
      )}

      {/* Подсказка в режиме редактирования */}
      {editMode === 'edit' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Как настроить обложку
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
                <p>• Используйте кнопку "Загрузить изображение" для добавления новой обложки - она автоматически сохранится в медиагалерею</p>
                <p>• Или выберите изображение из медиагалереи сообщества для использования в качестве обложки</p>
                <p>• Превью показывает, как мероприятие будет выглядеть на сайте</p>
                <p>• Не забудьте сохранить изменения кнопкой "💾 Сохранить изменения" после выбора из галереи!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}