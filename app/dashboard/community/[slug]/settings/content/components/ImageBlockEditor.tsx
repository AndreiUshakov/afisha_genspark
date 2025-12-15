'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ImageBlockContent, BlockEditorProps } from '@/lib/types/content-blocks'
import { uploadBlockImage } from '../actions'

interface ImageBlockEditorProps extends BlockEditorProps<ImageBlockContent> {
  communityId: string
}

export default function ImageBlockEditor({ 
  content, 
  onChange, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  communityId
}: ImageBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [url, setUrl] = useState(content.url)
  const [alt, setAlt] = useState(content.alt)
  const [caption, setCaption] = useState(content.caption || '')

  const handleSave = () => {
    onChange({ url, alt, caption: caption || undefined })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setUrl(content.url)
    setAlt(content.alt)
    setCaption(content.caption || '')
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения')
      return
    }

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('communityId', communityId)

      const result = await uploadBlockImage(formData)

      if (result.success && result.data) {
        setUrl(result.data.url)
        if (!alt) {
          setAlt(file.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        alert(result.error || 'Ошибка при загрузке изображения')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Произошла ошибка при загрузке изображения')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="group relative bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-600 transition-colors">
      {/* Toolbar */}
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
        <button
          onClick={onDelete}
          className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          title="Удалить блок"
        >
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Block Label */}
      <div className="mb-3 flex items-center gap-2">
        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Изображение</span>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Image Preview */}
          {url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-green-400 dark:border-green-600">
              <Image
                src={url}
                alt={alt}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
                {isUploading ? 'Загрузка...' : url ? 'Изменить изображение' : 'Загрузить изображение'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Альтернативный текст (обязательно)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Описание изображения для доступности"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Подпись (необязательно)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Подпись к изображению"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!url || !alt || isUploading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
          onClick={() => setIsEditing(true)}
          className="cursor-pointer"
        >
          {content.url ? (
            <div className="space-y-3">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={content.url}
                  alt={content.alt}
                  fill
                  className="object-contain"
                />
              </div>
              {content.caption && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
                  {content.caption}
                </p>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 dark:text-neutral-500 italic">Кликните для загрузки изображения</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}