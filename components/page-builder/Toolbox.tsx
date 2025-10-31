'use client';

import { useEditor, Element } from '@craftjs/core';
import React from 'react';
import { Container } from './Container';
import { Text } from './Text';
import { Button } from './Button';
import { ImageBlock } from './Image';
import { Heading } from './Heading';
import { Card } from './Card';

export const Toolbox = () => {
  const { connectors } = useEditor();

  const blocks = [
    {
      name: 'Контейнер',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      element: <Element is={Container} canvas />
    },
    {
      name: 'Заголовок',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      element: <Heading text="Заголовок" />
    },
    {
      name: 'Текст',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      element: <Text text="Введите ваш текст здесь" />
    },
    {
      name: 'Кнопка',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      element: <Button text="Нажмите" />
    },
    {
      name: 'Изображение',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      element: <ImageBlock />
    },
    {
      name: 'Карточка',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      element: (
        <Element is={Card} canvas>
          <Text text="Содержимое карточки" />
        </Element>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Блоки
      </h3>
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <button
            key={index}
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                connectors.create(ref, block.element);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-move"
          >
            {block.icon}
            <span>{block.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase mb-3">
          Инструкция
        </h4>
        <p className="text-xs text-gray-600 dark:text-neutral-400">
          Перетащите блоки на страницу для создания контента. Кликните на блок для редактирования.
        </p>
      </div>
    </div>
  );
};
