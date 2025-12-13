'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateCommunityDesign } from '../actions'

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
}

export default function DesignSettingsForm({ community }: DesignSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
      setAvatarFile(file)
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
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('communityId', community.id)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('location', formData.location)
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }
      
      if (coverFile) {
        formDataToSend.append('cover', coverFile)
      }

      const result = await updateCommunityDesign(formDataToSend)

      if (result.success) {
        setMessage({ type: 'success', text: 'Настройки успешно сохранены!' })
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Сообщения об успехе/ошибке */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Превью страницы */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Превью страницы
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Так будет выглядеть шапка вашей страницы сообщества
        </p>

        {/* Превью Hero Section */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden">
          {/* Cover Image */}
          <div className="absolute inset-0">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Preview cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="flex gap-4 items-end">
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Preview avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-white">
                <h1 className="text-2xl font-bold mb-1">{formData.name || 'Название сообщества'}</h1>
                <p className="text-sm text-gray-200 mb-2">{formData.description || 'Описание сообщества'}</p>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{formData.location || 'Локация'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Обложка сообщества */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Обложка сообщества
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Рекомендуемый размер: 1200x400 пикселей. Форматы: JPG, PNG
        </p>

        {coverPreview && (
          <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={coverPreview}
              alt="Обложка"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex gap-3">
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
            {coverPreview ? 'Изменить обложку' : 'Загрузить обложку'}
          </label>
          {coverPreview && (
            <button
              type="button"
              onClick={() => {
                setCoverFile(null)
                setCoverPreview(null)
              }}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      {/* Логотип сообщества */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Логотип сообщества
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Рекомендуемый размер: 400x400 пикселей. Форматы: JPG, PNG
        </p>

        {avatarPreview && (
          <div className="mb-4 relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg mx-auto">
            <Image
              src={avatarPreview}
              alt="Логотип"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {avatarPreview ? 'Изменить логотип' : 'Загрузить логотип'}
          </label>
          {avatarPreview && (
            <button
              type="button"
              onClick={() => {
                setAvatarFile(null)
                setAvatarPreview(null)
              }}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Основная информация
        </h2>

        <div className="space-y-5">
          {/* Название */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Название сообщества *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Например: Клуб любителей театра"
            />
          </div>

          {/* Краткое описание */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Краткое описание *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Короткое описание вашего сообщества (до 200 символов)"
            />
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              {formData.description.length}/200 символов
            </p>
          </div>

          {/* Локация */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Локация *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Например: Иркутск, Центральный район"
            />
          </div>
        </div>
      </div>



      {/* Кнопки действий */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors font-medium"
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  )
}