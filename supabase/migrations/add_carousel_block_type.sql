-- Добавление типа блока 'carousel' в constraint
ALTER TABLE public.community_content_blocks 
DROP CONSTRAINT IF EXISTS community_content_blocks_block_type_check;

ALTER TABLE public.community_content_blocks
ADD CONSTRAINT community_content_blocks_block_type_check 
CHECK (
  block_type = ANY (
    ARRAY['heading'::text, 'text'::text, 'image'::text, 'carousel'::text]
  )
);

-- Комментарий для документации
COMMENT ON COLUMN public.community_content_blocks.block_type IS 'Тип блока: heading, text, image, carousel';