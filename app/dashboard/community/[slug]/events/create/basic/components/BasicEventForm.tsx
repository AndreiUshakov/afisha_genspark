'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEventDraft, type CreateEventBasicData } from '../../actions'
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
  slug: string
  category_id: string
  target_audience: string[] | null
  wishes: string[] | null
  age_categories: string[] | null
  categories?: {
    id: string
    name: string
    slug: string
  }
}

interface BasicEventFormProps {
  community: Community
  categories: Category[]
  communitySlug: string
}

export default function BasicEventForm({ community, categories, communitySlug }: BasicEventFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Инициализация формы с дефолтными значениями из сообщества
  const [formData, setFormData] = useState<CreateEventBasicData>({
    title: '',
    description: '',
    category_id: community.category_id || '',
    start_date: '',
    end_date: null,
    is_recurring: false,
    recurrence_pattern: null,
    location_type: 'physical',
    venue_name: null,
    venue_address: null,
    online_link: null,
    is_free: true,
    price_min: null,
    price_max: null,
    currency: 'RUB',
    ticket_link: null,
    capacity: null,
    age_restriction: null,
    tags: [],
    event_type: community.categories?.name || null,
    target_audience: community.target_audience || [],
    wishes: community.wishes || [],
    age_categories: community.age_categories || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)
    setErrors({})

    // Валидация
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно'
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Выберите категорию'
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Укажите дату начала'
    }

    if (formData.location_type === 'physical' && !formData.venue_name) {
      newErrors.venue_name = 'Укажите место проведения'
    }

    if (formData.location_type === 'online' && !formData.online_link) {
      newErrors.online_link = 'Укажите ссылку на онлайн-трансляцию'
    }

    if (!formData.is_free) {
      if (!formData.price_min) {
        newErrors.price_min = 'Укажите минимальную цену'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSaving(false)
      return
    }

    // Создаем черновик мероприятия
    const result = await createEventDraft(community.id, communitySlug, formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Мероприятие успешно создано!' })
      // Возвращаемся к списку мероприятий
      setTimeout(() => {
        router.push(`/dashboard/community/${communitySlug}/events`)
      }, 1500)
    } else {
      setMessage({ type: 'error', text: result.error || 'Произошла ошибка при создании' })
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Название мероприятия *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
              placeholder="Например: Мастер-класс по живописи"
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
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
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.category_id
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
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
              maxLength={500}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
              } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none`}
              placeholder="Короткое описание вашего мероприятия (до 500 символов)"
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              {formData.description.length}/500 символов
            </p>
          </div>
        </div>
      </div>

      {/* Дата и время */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Дата и время проведения
        </h2>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Дата начала */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Дата и время начала *
              </label>
              <input
                type="datetime-local"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.start_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.start_date}</p>
              )}
            </div>

            {/* Дата окончания */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Дата и время окончания
              </label>
              <input
                type="datetime-local"
                id="end_date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Повторяющееся мероприятие */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Повторяющееся мероприятие
            </label>
          </div>

          {formData.is_recurring && (
            <div>
              <label htmlFor="recurrence_pattern" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Паттерн повторения
              </label>
              <select
                id="recurrence_pattern"
                value={formData.recurrence_pattern || ''}
                onChange={(e) => setFormData({ ...formData, recurrence_pattern: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              >
                <option value="">Выберите паттерн</option>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Место проведения */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Место проведения
        </h2>
        
        <div className="space-y-5">
          {/* Тип локации */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
              Формат мероприятия *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.location_type === 'physical'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="location_type"
                  value="physical"
                  checked={formData.location_type === 'physical'}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value as any })}
                  className="w-4 h-4 text-emerald-600"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Офлайн</div>
                  <div className="text-xs text-gray-500">Физическое место</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.location_type === 'online'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="location_type"
                  value="online"
                  checked={formData.location_type === 'online'}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value as any })}
                  className="w-4 h-4 text-emerald-600"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Онлайн</div>
                  <div className="text-xs text-gray-500">Виртуальное</div>
                </div>
              </label>
            </div>
          </div>

          {/* Поля для физического места */}
          {formData.location_type === 'physical' && (
            <>
              <div>
                <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Название места *
                </label>
                <input
                  type="text"
                  id="venue_name"
                  value={formData.venue_name || ''}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.venue_name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                  } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                  placeholder="Например: Арт-пространство 'Среда'"
                />
                {errors.venue_name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.venue_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="venue_address" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  id="venue_address"
                  value={formData.venue_address || ''}
                  onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Улица, дом, корпус"
                />
              </div>
            </>
          )}

          {/* Поля для онлайн */}
          {formData.location_type === 'online' && (
            <div>
              <label htmlFor="online_link" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Ссылка на онлайн-трансляцию {formData.location_type === 'online' && '*'}
              </label>
              <input
                type="url"
                id="online_link"
                value={formData.online_link || ''}
                onChange={(e) => setFormData({ ...formData, online_link: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.online_link
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                placeholder="https://zoom.us/j/123456789"
              />
              {errors.online_link && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.online_link}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Стоимость и билеты */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Стоимость участия
        </h2>
        
        <div className="space-y-5">
          {/* Бесплатно или платно */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_free"
              checked={formData.is_free}
              onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_free" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Бесплатное мероприятие
            </label>
          </div>

          {!formData.is_free && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_min" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Минимальная цена *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price_min"
                      value={formData.price_min || ''}
                      onChange={(e) => setFormData({ ...formData, price_min: e.target.value ? Number(e.target.value) : null })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.price_min
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-neutral-600 focus:ring-emerald-500'
                      } bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                      placeholder="1000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
                  </div>
                  {errors.price_min && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.price_min}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price_max" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Максимальная цена
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price_max"
                      value={formData.price_max || ''}
                      onChange={(e) => setFormData({ ...formData, price_max: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="5000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="ticket_link" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Ссылка на покупку билетов
                </label>
                <input
                  type="url"
                  id="ticket_link"
                  value={formData.ticket_link || ''}
                  onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="https://tickets.example.com"
                />
              </div>
            </>
          )}

          {/* Вместимость */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Максимальное количество участников
            </label>
            <input
              type="number"
              id="capacity"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="100"
            />
            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
              Оставьте пустым, если количество не ограничено
            </p>
          </div>
        </div>
      </div>

      {/* Фильтры и аудитория */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Фильтры и аудитория
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">
          Настройки по умолчанию взяты из сообщества. Вы можете изменить их для этого мероприятия.
        </p>
        
        <div className="space-y-5">
          <FilterSelector
            label="Для кого"
            options={FILTER_OPTIONS.TARGET_AUDIENCE}
            selected={formData.target_audience}
            onChange={(selected) => setFormData({ ...formData, target_audience: selected })}
            placeholder="Поиск по аудитории..."
          />

          <FilterSelector
            label="Я хочу"
            options={FILTER_OPTIONS.WISHES}
            selected={formData.wishes}
            onChange={(selected) => setFormData({ ...formData, wishes: selected })}
            placeholder="Поиск по целям..."
          />

          <FilterSelector
            label="Возраст"
            options={FILTER_OPTIONS.AGE_CATEGORIES}
            selected={formData.age_categories}
            onChange={(selected) => setFormData({ ...formData, age_categories: selected })}
            placeholder="Поиск по возрасту..."
            searchable={false}
          />
        </div>
      </div>

      {/* Дополнительные настройки */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Дополнительно
        </h2>
        
        <div className="space-y-5">
          {/* Возрастное ограничение */}
          <div>
            <label htmlFor="age_restriction" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Возрастное ограничение
            </label>
            <select
              id="age_restriction"
              value={formData.age_restriction || ''}
              onChange={(e) => setFormData({ ...formData, age_restriction: e.target.value || null })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            >
              <option value="">Без ограничений</option>
              <option value="0+">0+</option>
              <option value="6+">6+</option>
              <option value="12+">12+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>

          {/* Теги */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Теги (через запятую)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="искусство, мастер-класс, живопись"
            />
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/community/${communitySlug}/events`)}
          className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium"
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSaving ? 'Создание...' : 'Создать мероприятие'}
        </button>
      </div>
    </form>
  )
}