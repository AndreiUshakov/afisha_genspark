'use client';

import React, { useState, useRef } from 'react';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  content,
  onChange,
  placeholder = 'Расскажите о вашем сообществе...',
  minHeight = '300px'
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const MenuButton = ({ 
    onClick, 
    title,
    children 
  }: { 
    onClick: () => void; 
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-neutral-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800">
        <MenuButton
          onClick={() => insertFormatting('**', '**')}
          title="Жирный"
        >
          <strong className="text-sm">B</strong>
        </MenuButton>
        
        <MenuButton
          onClick={() => insertFormatting('*', '*')}
          title="Курсив"
        >
          <em className="text-sm">I</em>
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => insertFormatting('\n## ', '')}
          title="Заголовок 2"
        >
          <span className="text-sm font-semibold">H2</span>
        </MenuButton>
        
        <MenuButton
          onClick={() => insertFormatting('\n### ', '')}
          title="Заголовок 3"
        >
          <span className="text-sm font-semibold">H3</span>
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => insertFormatting('\n- ', '')}
          title="Маркированный список"
        >
          <span className="text-sm">• Список</span>
        </MenuButton>
        
        <MenuButton
          onClick={() => insertFormatting('\n1. ', '')}
          title="Нумерованный список"
        >
          <span className="text-sm">1. Список</span>
        </MenuButton>
        
        <div className="w-px bg-gray-300 dark:bg-neutral-600 mx-1" />
        
        <MenuButton
          onClick={() => {
            const url = window.prompt('Введите URL:');
            if (url) {
              insertFormatting('[', `](${url})`);
            }
          }}
          title="Ссылка"
        >
          <span className="text-sm">🔗 Ссылка</span>
        </MenuButton>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
        >
          {isPreview ? 'Редактор' : 'Предпросмотр'}
        </button>
      </div>

      {/* Editor/Preview Content */}
      {isPreview ? (
        <div 
          className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>')
              .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-3 mb-2">$1</h3>')
              .replace(/^\- (.*$)/gim, '<li>$1</li>')
              .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
              .replace(/\n/g, '<br />')
          }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none resize-none"
          style={{ minHeight }}
        />
      )}

      {/* Help text */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 border-t border-gray-300 dark:border-neutral-600">
        <p className="text-xs text-gray-500 dark:text-neutral-500">
          Используйте Markdown для форматирования: **жирный**, *курсив*, ## заголовок, - список, [ссылка](url)
        </p>
      </div>
    </div>
  );
};