'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { uploadCommunityMedia, deleteCommunityMedia } from './actions'

interface Community {
  id: string
  name: string
  slug: string
}

interface MediaItem {
  id: string
  community_id: string
  file_path: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
}

interface CommunityMediaClientProps {
  community: Community
  initialMedia: MediaItem[]
}

export default function CommunityMediaClient({ community, initialMedia }: CommunityMediaClientProps) {
  const router = useRouter()
  const [view, setView] = useState<'grid' | 'upload'>('grid')
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)

  // Синхронизируем локальное состояние с initialMedia при обновлении
  useEffect(() => {
    setMedia(initialMedia)
  }, [initialMedia])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)

  const maxCount = 200

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return []
    
    const validFiles: File[] = []
    const newErrors: string[] = []
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Неподдерживаемый формат. Используйте JPG, PNG или WebP`)
      } else if (file.size > maxSize) {
        newErrors.push(`${file.name}: Файл слишком большой. Максимум 10MB`)
      } else {
        validFiles.push(file)
      }
    })

    if (media.length + validFiles.length > maxCount) {
      newErrors.push(`Превышен лимит. Можно загрузить еще ${maxCount - media.length} фото`)
      return []
    }

    if (validFiles.length > 10) {
      newErrors.push('Можно загрузить максимум 10 файлов за раз')
      return []
    }

    setErrors(newErrors)
    return validFiles
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = validateFiles(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = validateFiles(e.target.files)
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setErrors([])
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('communityId', community.id)
      // Используем индексированные имена полей вместо одного имени 'files'
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })

      const result = await uploadCommunityMedia(formData)

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Успешно загружено ${result.uploaded} ${result.uploaded === 1 ? 'файл' : 'файлов'}`
        })
        setSelectedFiles([])
        setView('grid')
        // Обновляем страницу для получения новых данных
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка при загрузке' })
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при загрузке' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это изображение?')) return

    try {
      const result = await deleteCommunityMedia(id, community.slug)

      if (result.success) {
        setMedia(prev => prev.filter(item => item.id !== id))
        setMessage({ type: 'success', text: 'Изображение удалено' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка при удалении' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при удалении' })
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Медиагалерея
            </h1>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              Управление фотографиями сообщества "{community.name}"
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              📚 Галерея
            </button>
            <button
              onClick={() => setView('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              ⬆️ Загрузить
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Всего фото</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{media.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Доступно слотов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{maxCount - media.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Последняя загрузка</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {media.length > 0 
                  ? new Date(media[0].uploaded_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                  : 'Нет данных'
                }
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
        {view === 'upload' ? (
          <div className="space-y-4">
            {/* Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-200
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-neutral-600 hover:border-blue-400'
                }
                ${uploading || media.length >= maxCount ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading || media.length >= maxCount}
                className="hidden"
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {dragActive ? 'Отпустите файлы здесь' : 'Перетащите фото сюда'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                      или нажмите для выбора файлов
                    </p>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                      JPG, PNG, WebP до 10MB • Максимум 10 файлов за раз
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    Загружено: {media.length} / {maxCount}
                  </div>
                </div>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Выбрано файлов: {selectedFiles.length}
                  </p>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Очистить
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {uploading ? 'Загрузка...' : `Загрузить ${selectedFiles.length} ${selectedFiles.length === 1 ? 'файл' : 'файлов'}`}
                </button>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                  Ошибки при загрузке:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Media Grid */}
            {media.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 dark:text-neutral-400">
                  Медиабиблиотека пуста
                </p>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">
                  Загрузите первые фотографии
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map(item => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    {/* Image */}
                    <img
                      src={item.file_url}
                      alt={item.file_name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImage(item)
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                            title="Просмотр"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Удалить"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox для просмотра */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage.file_url}
            alt={selectedImage.file_name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-lg font-medium">
              {selectedImage.file_name}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Загружено: {new Date(selectedImage.uploaded_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}