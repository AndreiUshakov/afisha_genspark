'use client'

import { useState } from 'react'
import { updateBasicSettings, type UpdateBasicSettingsData } from '../actions'
import { FilterSelector } from '@/app/dashboard/create-community/components/FilterSelector'
import { FILTER_OPTIONS } from '@/types/community'

interface Category {
  id: string
  name: string
  slug: string
}

interface Community {
  id: string
  name: string
  description: string
  category_id: string
  target_audience: string[] | null
  wishes: string[] | null
  age_categories: string[] | null
  contact_email: string | null
  contact_phone: string | null
  social_links: {
    vk?: string
    telegram?: string
    max?: string
    website?: string
  } | null
}

interface BasicSettingsFormProps {
  community: Community
  categories: Category[]
  isReadOnly?: boolean
}

export default function BasicSettingsForm({ community, categories, isReadOnly = false }: BasicSettingsFormProps) {
  const [formData, setFormData] = useState<UpdateBasicSettingsData>({
    name: community.name,
    description: community.description,
    category_id: community.category_id,
    target_audience: community.target_audience || [],
    wishes: community.wishes || [],
    age_categories: community.age_categories || [],
    contact_email: community.contact_email || '',
    contact_phone: community.contact_phone || '',
    social_links: {
      vk: community.social_links?.vk || '',
      telegram: community.social_links?.telegram || '',
      max: community.social_links?.max || '',
      website: community.social_links?.website || ''
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateBasicSettingsData, string>>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)
    setErrors({})

    // Валидация
    const newErrors: Partial<Record<keyof UpdateBasicSettingsData, string>> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно'
    } else if (formData.description.length > 200) {
      newErrors.description = 'Описание не должно превышать 200 символов'
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Выберите категорию'
    }
    
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Некорректный email адрес'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSaving(false)
      return
    }

    const result = await updateBasicSettings(community.id, formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Настройки успешно сохранены!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Произошла ошибка при сохранении' })
    }

    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isReadOnly}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
              placeholder="Например: Клуб любителей театра"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Категория */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Категория *
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              disabled={isReadOnly}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.category_id
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category_id}</p>
            )}
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
              rows={3}
              maxLength={200}
              disabled={isReadOnly}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed`}
              placeholder="Короткое описание вашего сообщества (до 200 символов)"
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              {formData.description.length}/200 символов
            </p>
          </div>
        </div>
      </div>

      {/* Фильтры аудитории */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Фильтры и аудитория
        </h2>
        
        <div className="space-y-5">
          <div className={isReadOnly ? 'pointer-events-none opacity-60' : ''}>
            <FilterSelector
              label="Для кого"
              options={FILTER_OPTIONS.TARGET_AUDIENCE}
              selected={formData.target_audience}
              onChange={(selected) => setFormData({ ...formData, target_audience: selected })}
              placeholder="Поиск по аудитории..."
            />
          </div>

          <div className={isReadOnly ? 'pointer-events-none opacity-60' : ''}>
            <FilterSelector
              label="Я хочу"
              options={FILTER_OPTIONS.WISHES}
              selected={formData.wishes}
              onChange={(selected) => setFormData({ ...formData, wishes: selected })}
              placeholder="Поиск по целям..."
            />
          </div>

          <div className={isReadOnly ? 'pointer-events-none opacity-60' : ''}>
            <FilterSelector
              label="Возрастные категории"
              options={FILTER_OPTIONS.AGE_CATEGORIES}
              selected={formData.age_categories}
              onChange={(selected) => setFormData({ ...formData, age_categories: selected })}
              placeholder="Поиск по возрасту..."
              searchable={false}
            />
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Контактная информация
        </h2>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Email для связи *
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              disabled={isReadOnly}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.contact_email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
              placeholder="community@example.com"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.contact_email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              disabled={isReadOnly}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
        </div>
      </div>

      {/* Социальные сети */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Социальные сети
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium text-gray-600 dark:text-neutral-400">VK</span>
            <input
              type="url"
              value={formData.social_links.vk}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, vk: e.target.value }
              })}
              disabled={isReadOnly}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="https://vk.com/your-community"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium text-gray-600 dark:text-neutral-400">Telegram</span>
            <input
              type="url"
              value={formData.social_links.telegram}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, telegram: e.target.value }
              })}
              disabled={isReadOnly}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="https://t.me/your-channel"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium text-gray-600 dark:text-neutral-400">MAX</span>
            <input
              type="url"
              value={formData.social_links.max}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, max: e.target.value }
              })}
              disabled={isReadOnly}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="https://max.ru/your-page"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium text-gray-600 dark:text-neutral-400">Сайт</span>
            <input
              type="url"
              value={formData.social_links.website}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, website: e.target.value }
              })}
              disabled={isReadOnly}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="https://your-website.com"
            />
          </div>
        </div>
      </div>

      {/* Кнопка сохранения */}
      {!isReadOnly && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}
    </form>
  )
}