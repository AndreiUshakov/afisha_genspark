'use client';

import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '@/components/page-builder/Container';
import { Text } from '@/components/page-builder/Text';
import { Button } from '@/components/page-builder/Button';
import { ImageBlock } from '@/components/page-builder/Image';
import { Heading } from '@/components/page-builder/Heading';
import { Card } from '@/components/page-builder/Card';
import { Toolbox } from '@/components/page-builder/Toolbox';
import { SettingsPanel } from '@/components/page-builder/SettingsPanel';

interface PageBuilderProps {
  enabled: boolean;
  isEditing: boolean;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({ enabled, isEditing }) => {
  return (
    <Editor
      resolver={{
        Container,
        Text,
        Button,
        ImageBlock,
        Heading,
        Card
      }}
      enabled={isEditing && enabled}
    >
      {isEditing ? (
        <div className="flex">
          {/* Панель инструментов */}
          {enabled && (
            <div className="w-64 flex-shrink-0 overflow-y-auto bg-gray-50 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700">
              <Toolbox />
            </div>
          )}

          {/* Холст */}
          <div className="flex-1 overflow-y-auto p-6">
            <Frame>
              <Element
                is={Container}
                canvas
                background="#ffffff"
                padding={40}
              >
                <Heading text="Добро пожаловать!" level={1} />
                <Text text="Перетащите блоки слева, чтобы создать уникальную страницу сообщества" />
              </Element>
            </Frame>
          </div>

          {/* Панель настроек */}
          {enabled && (
            <div className="w-80 flex-shrink-0 overflow-y-auto bg-gray-50 dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-700">
              <SettingsPanel />
            </div>
          )}
        </div>
      ) : (
        <div className="p-6">
          <Frame>
            <Element
              is={Container}
              canvas
              background="#ffffff"
              padding={40}
            >
              <Heading text="Добро пожаловать!" level={1} />
              <Text text="Это превью вашей страницы сообщества" />
            </Element>
          </Frame>
        </div>
      )}
    </Editor>
  );
};