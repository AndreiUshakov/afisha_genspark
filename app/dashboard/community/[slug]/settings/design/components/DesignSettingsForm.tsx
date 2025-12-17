'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateCommunityDesign } from '@/app/dashboard/community/[slug]/settings/design/actions'

interface Community {
  id: string
  name: string
  slug: string
  description: string
  location: string
  avatar_url: string | null
  cover_url: string | null
}

interface DesignSettingsFormProps {
  community: Community
  isReadOnly?: boolean
}

export default function DesignSettingsForm({ community, isReadOnly = false }: DesignSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Режим редактирования
  const [editMode, setEditMode] = useState<'view' | 'edit'>('view')

  // Состояние формы
  const [formData, setFormData] = useState({
    name: community.name,
    description: community.description,
    location: community.location,
  })

  // Состояние для изображений
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(community.avatar_url)
  const [coverPreview, setCoverPreview] = useState<string | null>(community.cover_url)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Можно загружать только изображения' })
        e.target.value = ''
        return
      }
      
      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Размер файла не должен превышать 5 МБ' })
        e.target.value = ''
        return
      }
      
      setAvatarFile(file)
      setRemoveAvatar(false) // Сбрасываем флаг удаления при выборе нового файла
      setMessage(null) // Очищаем предыдущие сообщения об ошибках
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Можно загружать только изображения' })
        e.target.value = ''
        return
      }
      
      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Размер файла не должен превышать 5 МБ' })
        e.target.value = ''
        return
      }
      
      setCoverFile(file)
      setRemoveCover(false) // Сбрасываем флаг удаления при выборе нового файла
      setMessage(null) // Очищаем предыдущие сообщения об ошибках
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [removeCover, setRemoveCover] = useState(false)

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
    setRemoveCover(true)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('communityId', community.id)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('location', formData.location)
      
      if (removeAvatar) {
        formDataToSend.append('removeAvatar', 'true')
      } else if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }
      
      if (removeCover) {
        formDataToSend.append('removeCover', 'true')
      } else if (coverFile) {
        formDataToSend.append('cover', coverFile)
      }

      const result = await updateCommunityDesign(formDataToSend)

      if (result.success) {
        setMessage({ type: 'success', text: 'Настройки успешно сохранены!' })
        setEditMode('view')
        setAvatarFile(null)
        setCoverFile(null)
        setRemoveAvatar(false)
        setRemoveCover(false)
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Произошла ошибка при сохранении' })
      }
    } catch (error) {
      console.error('Error updating community:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при сохранении' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Заголовок и кнопки управления */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          {!isReadOnly && (
            <>
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
                  disabled={isSubmitting || isReadOnly}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '💾 Сохранение...' : '💾 Сохранить изменения'}
                </button>
              )}
            </>
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

      {/* Превью страницы сообщества - как на публичной странице */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] md:h-[500px]">
          {/* Cover Image */}
          <div className="absolute inset-0">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
            
            {/* Кнопки управления обложкой в режиме редактирования */}
            {editMode === 'edit' && !isReadOnly && (
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <label className="cursor-pointer px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-colors shadow-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Удалить
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-8 md:pb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Community Avatar */}
              <div className="relative flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Кнопки управления логотипом */}
                {editMode === 'edit' && !isReadOnly && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <label className="cursor-pointer p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        onClick={handleRemoveAvatar}
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Community Info */}
              <div className="flex-1 text-white pb-2">
                {editMode === 'edit' && !isReadOnly ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-3xl md:text-5xl font-bold text-white bg-white/10 backdrop-blur-sm border-b-2 border-white/50 focus:outline-none focus:border-white w-full px-2 py-1 rounded"
                      placeholder="Название сообщества"
                    />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      maxLength={200}
                      className="text-lg md:text-xl text-gray-200 bg-white/10 backdrop-blur-sm border-b border-white/30 focus:outline-none focus:border-white/50 w-full px-2 py-1 rounded resize-none"
                      placeholder="Краткое описание"
                      rows={2}
                    />
                    <p className="text-xs text-gray-300">
                      {formData.description.length}/200 символов
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl md:text-5xl font-bold">{formData.name}</h1>
                      {community.id && (
                        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl">{formData.description}</p>
                  </>
                )}
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>1,234 подписчика</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {editMode === 'edit' && !isReadOnly ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-white/10 backdrop-blur-sm border-b border-white/30 focus:outline-none focus:border-white/50 px-2 py-1 rounded text-white"
                        placeholder="Локация"
                      />
                    ) : (
                      <span>{formData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>15 событий</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Подсказка в режиме редактирования */}
      {editMode === 'edit' && !isReadOnly && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Режим редактирования активен
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
                <p>• Используйте кнопки в правом верхнем углу для загрузки/удаления обложки</p>
                <p>• Используйте кнопки под логотипом для загрузки/удаления логотипа</p>
                <p>• Кликните на текст, чтобы отредактировать название и описание</p>
                <p>• Кликните на локацию, чтобы изменить её</p>
                <p>• Не забудьте сохранить изменения!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}