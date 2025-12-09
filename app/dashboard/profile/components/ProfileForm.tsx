'use client'

import { useState, useRef } from 'react'
import { updateProfile, uploadAvatar, type ProfileData } from '../actions'
import Image from 'next/image'

interface ProfileFormProps {
  profile: ProfileData
  emailVerified: boolean
}

export default function ProfileForm({ profile, emailVerified }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
  })
  
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.url) {
      setAvatarUrl(result.url)
      setMessage({ type: 'success', text: 'Аватар успешно обновлен' })
    }

    setIsUploadingAvatar(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Профиль успешно обновлен' })
    }

    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
    })
    setMessage(null)
  }

  // Получаем инициалы для аватара
  const getInitials = () => {
    if (formData.full_name) {
      const parts = formData.full_name.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return parts[0][0].toUpperCase()
    }
    return profile.email[0].toUpperCase()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 dark:bg-neutral-800 dark:border-neutral-700">
      {/* Сообщения */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Аватар и основная информация */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="size-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity disabled:opacity-50 relative group"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Аватар"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {getInitials()}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
          {isUploadingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData.full_name || 'Имя не указано'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 dark:text-neutral-400">{profile.email}</p>
            {emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Подтвержден
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Не подтвержден
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Форма редактирования */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Полное имя
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Иван Петров"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
            Email нельзя изменить
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Местоположение
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Иркутск, Россия"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Веб-сайт
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            О себе
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Расскажите о себе..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}