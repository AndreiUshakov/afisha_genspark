'use client'

import { useState } from 'react'
import type { HeadingBlockContent, BlockEditorProps } from '@/lib/types/content-blocks'

export default function HeadingBlockEditor({
  content,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isReadOnly
}: BlockEditorProps<HeadingBlockContent> & { isReadOnly?: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(content.text)

  const handleSave = () => {
    onChange({ text })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setText(content.text)
    setIsEditing(false)
  }

  return (
    <div className="group relative bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-lg p-6 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
      {/* Toolbar */}
      {!isReadOnly && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Заголовок H2</span>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите заголовок..."
            className="w-full px-4 py-2 text-xl font-bold border-2 border-blue-400 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancel}
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
          {content.text ? (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{content.text}</h2>
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 italic">Кликните для редактирования заголовка</p>
          )}
        </div>
      )}
    </div>
  )
}