// Типы блоков контента для страницы "О сообществе"

export type BlockType = 'heading' | 'text' | 'image'

export interface HeadingBlockContent {
  text: string
}

export interface TextBlockContent {
  html: string
}

export interface ImageBlockContent {
  url: string
  alt: string
  caption?: string
}

export type BlockContent = HeadingBlockContent | TextBlockContent | ImageBlockContent

export interface ContentBlock {
  id: string
  community_id: string
  block_type: BlockType
  content: BlockContent
  position: number
  created_at: string
  updated_at: string
}

export interface CreateBlockInput {
  block_type: BlockType
  content: BlockContent
  position: number
}

export interface UpdateBlockInput {
  id: string
  content?: BlockContent
  position?: number
}

// Типы для компонентов
export interface BlockEditorProps<T extends BlockContent = BlockContent> {
  content: T
  onChange: (content: T) => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export interface BlockPreviewProps<T extends BlockContent = BlockContent> {
  content: T
}