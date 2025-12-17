'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { CarouselBlockContent, BlockEditorProps, CarouselImage } from '@/lib/types/content-blocks'
import { getCommunityMedia } from '../../../media/actions'
import { uploadBlockImage } from '../actions'

interface MediaItem {
  id: string
  file_url: string
  file_name: string
  uploaded_at: string
}

interface CarouselBlockEditorProps extends BlockEditorProps<CarouselBlockContent> {
  communityId: string
  communitySlug: string
  isReadOnly?: boolean
}

export default function CarouselBlockEditor({
  content,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  communityId,
  communitySlug,
  isReadOnly
}: CarouselBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [images, setImages] = useState<CarouselImage[]>(content.images || [])
  const [slidesPerView, setSlidesPerView] = useState(content.slidesPerView || 4)
  const [slidesPerViewMobile, setSlidesPerViewMobile] = useState(content.slidesPerViewMobile || 1)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryMedia, setGalleryMedia] = useState<MediaItem[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null)

  useEffect(() => {
    if (showGallery && galleryMedia.length === 0) {
      loadGalleryMedia()
    }
  }, [showGallery])

  const loadGalleryMedia = async () => {
    setLoadingGallery(true)
    try {
      const result = await getCommunityMedia(communitySlug)
      if (result.success && result.media) {
        setGalleryMedia(result.media)
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoadingGallery(false)
    }
  }

  const refreshGallery = () => {
    setGalleryMedia([])
    loadGalleryMedia()
  }

  const selectFromGallery = (mediaItem: MediaItem) => {
    const newImage: CarouselImage = {
      url: mediaItem.file_url,
      alt: mediaItem.file_name.replace(/\.[^/.]+$/, ''),
      caption: ''
    }
    
    if (editingImageIndex !== null) {
      const newImages = [...images]
      newImages[editingImageIndex] = newImage
      setImages(newImages)
      setEditingImageIndex(null)
    } else {
      setImages([...images, newImage])
    }
    setShowGallery(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Валидация файлов
    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: не является изображением`)
      } else if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: размер превышает 5 МБ`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      alert('Ошибки при загрузке:\n' + errors.join('\n'))
    }

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      const uploadedImages: CarouselImage[] = []
      
      // Загружаем файлы последовательно
      for (const file of validFiles) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('communityId', communityId)

        const result = await uploadBlockImage(formData)

        if (result.success && result.data) {
          uploadedImages.push({
            url: result.data.url,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            caption: ''
          })
        } else {
          errors.push(`${file.name}: ${result.error || 'ошибка загрузки'}`)
        }
      }

      if (uploadedImages.length > 0) {
        setImages([...images, ...uploadedImages])
        
        if (showGallery) {
          await loadGalleryMedia()
        }
      }

      if (errors.length > 0) {
        alert('Некоторые файлы не были загружены:\n' + errors.join('\n'))
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Произошла ошибка при загрузке изображений')
    } finally {
      setIsUploading(false)
      // Сбрасываем input для возможности повторной загрузки тех же файлов
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[newIndex]
    newImages[newIndex] = temp
    setImages(newImages)
  }

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], caption }
    setImages(newImages)
  }

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], alt }
    setImages(newImages)
  }

  const handleSave = () => {
    onChange({ 
      images, 
      slidesPerView, 
      slidesPerViewMobile 
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setImages(content.images || [])
    setSlidesPerView(content.slidesPerView || 4)
    setSlidesPerViewMobile(content.slidesPerViewMobile || 1)
    setIsEditing(false)
    setEditingImageIndex(null)
  }

  return (
    <div className="group relative bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-lg p-6 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
      {/* Toolbar */}
      {!isReadOnly && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {!isFirst && onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
              title="Переместить вверх"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {!isLast && onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
              title="Переместить вниз"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              title="Удалить блок"
            >
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Block Label */}
      <div className="mb-3 flex items-center gap-2">
        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded">
          <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Карусель изображений</span>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Слайдов на десктопе
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={slidesPerView}
                onChange={(e) => setSlidesPerView(parseInt(e.target.value) || 4)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Слайдов на мобильных
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={slidesPerViewMobile}
                onChange={(e) => setSlidesPerViewMobile(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>
          </div>

          {/* Upload and Gallery Buttons */}
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-center">
                {isUploading ? 'Загрузка...' : 'Загрузить изображения'}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setEditingImageIndex(null)
                setShowGallery(!showGallery)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              disabled={isUploading}
            >
              {showGallery ? 'Скрыть галерею' : 'Из галереи'}
            </button>
            {showGallery && (
              <button
                type="button"
                onClick={refreshGallery}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                disabled={loadingGallery}
              >
                🔄 Обновить
              </button>
            )}
          </div>

          {/* Gallery Selection */}
          {showGallery && (
            <div className="border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Выберите изображение из медиагалереи
              </h4>
              {loadingGallery ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Загрузка...
                </div>
              ) : galleryMedia.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Галерея пуста. Загрузите изображения в медиагалерею.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {galleryMedia.map(item => (
                    <div
                      key={item.id}
                      onClick={() => selectFromGallery(item)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <Image
                        src={item.file_url}
                        alt={item.file_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Images List */}
          {images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Изображения в карусели ({images.length})
              </h4>
              <div className="space-y-2">
                {images.map((image, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                        placeholder="Alt текст"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-neutral-800 dark:text-white"
                      />
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        placeholder="Подпись (необязательно)"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-neutral-800 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, 'up')}
                          className="p-1 bg-gray-200 dark:bg-neutral-700 rounded hover:bg-gray-300 dark:hover:bg-neutral-600"
                          title="Вверх"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          onClick={() => moveImage(index, 'down')}
                          className="p-1 bg-gray-200 dark:bg-neutral-700 rounded hover:bg-gray-300 dark:hover:bg-neutral-600"
                          title="Вниз"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={images.length === 0 || isUploading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={isReadOnly ? undefined : () => setIsEditing(true)}
          className={isReadOnly ? '' : 'cursor-pointer'}
        >
          {content.images && content.images.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Изображений: {content.images.length} | 
                Слайдов: {content.slidesPerView || 4} (десктоп), {content.slidesPerViewMobile || 1} (мобильные)
              </div>
              <div className="grid grid-cols-4 gap-2">
                {content.images.slice(0, 8).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {content.images.length > 8 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  +{content.images.length - 8} изображений
                </p>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 dark:text-neutral-500 italic">Кликните для добавления изображений в карусель</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}