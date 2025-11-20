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
import { AdvertisementBlock } from './AdvertisementBlock';

interface Step2VisualDesignProps {
  coverImage: File | null;
  logoImage: File | null;
  onCoverImageChange: (file: File | null) => void;
  onLogoImageChange: (file: File | null) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export const Step2VisualDesign: React.FC<Step2VisualDesignProps> = ({
  coverImage,
  logoImage,
  onCoverImageChange,
  onLogoImageChange,
  enabled,
  onEnabledChange
}) => {
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      callback(file);
    }
  };

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
      enabled={enabled}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Toolbox */}
        <div className="w-64 flex-shrink-0 overflow-y-auto bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
          <Toolbox />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Визуальные элементы */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Визуальные элементы
              </h2>
              
              <div className="space-y-5">
                {/* Обложка */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Обложка сообщества (1200x400px)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, onCoverImageChange)}
                      className="hidden"
                    />
                    <label htmlFor="coverImage" className="cursor-pointer">
                      {coverImage ? (
                        <div className="space-y-2">
                          <div className="w-full h-32 bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(coverImage)}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            {coverImage.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onCoverImageChange(null);
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Удалить
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Загрузить обложку
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Логотип */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Логотип сообщества (400x400px)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      id="logoImage"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, onLogoImageChange)}
                      className="hidden"
                    />
                    <label htmlFor="logoImage" className="cursor-pointer">
                      {logoImage ? (
                        <div className="space-y-2">
                          <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <img
                              src={URL.createObjectURL(logoImage)}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            {logoImage.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onLogoImageChange(null);
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Удалить
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Загрузить логотип
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Builder Canvas */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Дизайн страницы сообщества
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                    Перетаскивайте блоки слева для создания уникального дизайна
                  </p>
                </div>
                <button
                  onClick={() => onEnabledChange(!enabled)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    enabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                  }`}
                >
                  {enabled ? 'Режим редактирования' : 'Режим просмотра'}
                </button>
              </div>
              
              <div className="p-6">
                <Frame>
                  <Element
                    is={Container}
                    canvas
                    background="#f9fafb"
                    padding={40}
                  >
                    <Heading text="Добро пожаловать в наше сообщество!" level={1} />
                    <Text text="Начните добавлять блоки, чтобы создать уникальную страницу сообщества" />
                  </Element>
                </Frame>
              </div>
            </div>

            {/* Рекламные блоки */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Продвижение
              </h2>
              <AdvertisementBlock type="landing" />
              <AdvertisementBlock type="radio" />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 flex-shrink-0 overflow-y-auto bg-white dark:bg-neutral-800 border-l border-gray-200 dark:border-neutral-700">
          <SettingsPanel />
        </div>
      </div>
    </Editor>
  );
};