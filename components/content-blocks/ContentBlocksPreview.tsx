import Image from 'next/image'
import type { ContentBlock } from '@/lib/types/content-blocks'
import CarouselBlock from './CarouselBlock'

interface ContentBlocksPreviewProps {
  blocks: ContentBlock[]
}

export default function ContentBlocksPreview({ blocks }: ContentBlocksPreviewProps) {
  if (blocks.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {blocks.map((block) => {
            switch (block.block_type) {
              case 'heading':
                return (
                  <h2 
                    key={block.id}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                  >
                    {(block.content as any).text}
                  </h2>
                )
              
              case 'text':
                return (
                  <div 
                    key={block.id}
                    className="prose prose-lg max-w-none dark:prose-invert dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: (block.content as any).html }}
                  />
                )
              
              case 'image':
                const imageContent = block.content as any
                return (
                  <figure key={block.id} className="space-y-3">
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={imageContent.url}
                        alt={imageContent.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {imageContent.caption && (
                      <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
                        {imageContent.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              
              case 'carousel':
                const carouselContent = block.content as any
                return (
                  <div key={block.id} className="w-full">
                    <CarouselBlock content={carouselContent} />
                  </div>
                )
              
              default:
                return null
            }
          })}
        </div>
      </div>
    </section>
  )
}