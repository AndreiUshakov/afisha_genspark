'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentBlock, BlockType, BlockContent } from '@/lib/types/content-blocks'
import { 
  createContentBlock, 
  updateContentBlock, 
  deleteContentBlock, 
  reorderContentBlocks 
} from '../actions'
import HeadingBlockEditor from './HeadingBlockEditor'
import TextBlockEditor from './TextBlockEditor'
import ImageBlockEditor from './ImageBlockEditor'

interface ContentBuilderProps {
  communityId: string
  initialBlocks: ContentBlock[]
}

export default function ContentBuilder({ communityId, initialBlocks }: ContentBuilderProps) {
  const router = useRouter()
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
  const [isAddingBlock, setIsAddingBlock] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const handleAddBlock = async (blockType: BlockType) => {
    setIsSaving(true)
    setMessage(null)

    try {
      let content: BlockContent
      
      switch (blockType) {
        case 'heading':
          content = { text: '' }
          break
        case 'text':
          content = { html: '' }
          break
        case 'image':
          content = { url: '', alt: '' }
          break
      }

      const result = await createContentBlock(communityId, {
        block_type: blockType,
        content,
        position: blocks.length
      })

      if (result.success && result.data) {
        setBlocks([...blocks, result.data])
        setIsAddingBlock(false)
        setMessage({ type: 'success', text: 'Блок добавлен' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка при добавлении блока' })
      }
    } catch (error) {
      console.error('Error adding block:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при добавлении блока' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const result = await updateContentBlock(communityId, {
        id: blockId,
        content
      })

      if (result.success && result.data) {
        setBlocks(blocks.map(b => b.id === blockId ? result.data! : b))
        setMessage({ type: 'success', text: 'Блок обновлен' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка при обновлении блока' })
      }
    } catch (error) {
      console.error('Error updating block:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при обновлении блока' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) {
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await deleteContentBlock(communityId, blockId)

      if (result.success) {
        setBlocks(blocks.filter(b => b.id !== blockId))
        setMessage({ type: 'success', text: 'Блок удален' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Ошибка при удалении блока' })
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка при удалении блока' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[newIndex]
    newBlocks[newIndex] = temp

    setBlocks(newBlocks)

    // Сохраняем новый порядок
    setIsSaving(true)
    try {
      const blockIds = newBlocks.map(b => b.id)
      const result = await reorderContentBlocks(communityId, blockIds)
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Порядок блоков изменен' })
        router.refresh()
      } else {
        // Откатываем изменения при ошибке
        setBlocks(blocks)
        setMessage({ type: 'error', text: result.error || 'Ошибка при изменении порядка' })
      }
    } catch (error) {
      console.error('Error reordering blocks:', error)
      setBlocks(blocks)
      setMessage({ type: 'error', text: 'Произошла ошибка при изменении порядка' })
    } finally {
      setIsSaving(false)
    }
  }

  const renderBlock = (block: ContentBlock, index: number) => {
    const commonProps = {
      onDelete: () => handleDeleteBlock(block.id),
      onMoveUp: index > 0 ? () => handleMoveBlock(index, 'up') : undefined,
      onMoveDown: index < blocks.length - 1 ? () => handleMoveBlock(index, 'down') : undefined,
      isFirst: index === 0,
      isLast: index === blocks.length - 1
    }

    switch (block.block_type) {
      case 'heading':
        return (
          <HeadingBlockEditor
            key={block.id}
            content={block.content as any}
            onChange={(content) => handleUpdateBlock(block.id, content)}
            {...commonProps}
          />
        )
      case 'text':
        return (
          <TextBlockEditor
            key={block.id}
            content={block.content as any}
            onChange={(content) => handleUpdateBlock(block.id, content)}
            {...commonProps}
          />
        )
      case 'image':
        return (
          <ImageBlockEditor
            key={block.id}
            content={block.content as any}
            onChange={(content) => handleUpdateBlock(block.id, content)}
            communityId={communityId}
            {...commonProps}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Конструктор страницы "О сообществе"
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
              <p>• Добавляйте блоки: заголовки (H2), текст с форматированием, изображения</p>
              <p>• Используйте кнопки со стрелками для изменения порядка блоков</p>
              <p>• Изображения загружаются в медиагалерею сообщества</p>
              <p>• Все изменения сохраняются автоматически</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length > 0 ? (
        <div className="space-y-4">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">
            Страница пока пуста. Добавьте первый блок!
          </p>
        </div>
      )}

      {/* Add Block Button */}
      {!isAddingBlock ? (
        <button
          onClick={() => setIsAddingBlock(true)}
          disabled={isSaving}
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg text-gray-600 dark:text-neutral-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Добавить блок
        </button>
      ) : (
        <div className="bg-white dark:bg-neutral-800 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Выберите тип блока
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleAddBlock('heading')}
              disabled={isSaving}
              className="p-6 border-2 border-gray-200 dark:border-neutral-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-block mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Заголовок</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Заголовок второго уровня (H2)</p>
            </button>

            <button
              onClick={() => handleAddBlock('text')}
              disabled={isSaving}
              className="p-6 border-2 border-gray-200 dark:border-neutral-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-block mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Текст</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Блок с форматированным текстом</p>
            </button>

            <button
              onClick={() => handleAddBlock('image')}
              disabled={isSaving}
              className="p-6 border-2 border-gray-200 dark:border-neutral-700 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg inline-block mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Изображение</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Загрузить фото из галереи</p>
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setIsAddingBlock(false)}
              disabled={isSaving}
              className="px-4 py-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}