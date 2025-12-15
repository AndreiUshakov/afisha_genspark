'use client'

import { useState, useRef, useEffect } from 'react'
import type { TextBlockContent, BlockEditorProps } from '@/lib/types/content-blocks'

export default function TextBlockEditor({ 
  content, 
  onChange, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: BlockEditorProps<TextBlockContent>) {
  const [isEditing, setIsEditing] = useState(false)
  const [html, setHtml] = useState(content.html)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    const newHtml = editorRef.current?.innerHTML || ''
    onChange({ html: newHtml })
    setHtml(newHtml)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.html
    }
    setHtml(content.html)
    setIsEditing(false)
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  return (
    <div className="group relative bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-lg p-6 hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
      {/* Toolbar */}
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
        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Текстовый блок</span>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {/* Rich Text Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Жирный"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Курсив"
            >
              <span className="italic">I</span>
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Подчеркнутый"
            >
              <span className="underline">U</span>
            </button>
            <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1"></div>
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Маркированный список"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Нумерованный список"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18m-9 8h9" />
              </svg>
            </button>
            <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1"></div>
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="По левому краю"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="По центру"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="По правому краю"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>
            <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1"></div>
            <button
              type="button"
              onClick={() => {
                const url = prompt('Введите URL:')
                if (url) execCommand('createLink', url)
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Добавить ссылку"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          {/* Editable Content */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: content.html }}
            className="min-h-[150px] p-4 border-2 border-purple-400 dark:border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:text-white prose prose-sm max-w-none dark:prose-invert"
            data-placeholder="Начните вводить текст..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
          onClick={() => setIsEditing(true)}
          className="cursor-pointer min-h-[100px]"
        >
          {content.html ? (
            <div 
              className="prose prose-sm max-w-none dark:prose-invert dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 italic">Кликните для редактирования текста</p>
          )}
        </div>
      )}
    </div>
  )
}