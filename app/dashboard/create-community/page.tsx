'use client';

import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import React, { useState } from 'react';
import { Container } from '@/components/page-builder/Container';
import { Text } from '@/components/page-builder/Text';
import { Button } from '@/components/page-builder/Button';
import { ImageBlock } from '@/components/page-builder/Image';
import { Heading } from '@/components/page-builder/Heading';
import { Card } from '@/components/page-builder/Card';
import { Toolbox } from '@/components/page-builder/Toolbox';
import { SettingsPanel } from '@/components/page-builder/SettingsPanel';

// Save button component that uses useEditor hook
const SaveButton = ({ formData }: { formData: any }) => {
  const { query } = useEditor();
  
  const handleSave = () => {
    const pageContent = query.serialize();
    console.log('Saving community:', {
      ...formData,
      pageContent: JSON.parse(pageContent)
    });
    // Here you would send to API
    alert('Сообщество создано! (это демо)');
  };

  return (
    <button
      onClick={handleSave}
      className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
    >
      Создать сообщество
    </button>
  );
};

export default function CreateCommunityPage() {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    coverImage: null as File | null,
    logo: null as File | null,
    shortDescription: '',
    socialLinks: {
      vk: '',
      telegram: '',
      instagram: '',
      website: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
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
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Создание сообщества
              </h1>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                Шаг 2 из 2: Дизайн страницы сообщества
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEnabled(!enabled)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  enabled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                }`}
              >
                {enabled ? 'Режим редактирования' : 'Режим просмотра'}
              </button>
              <a
                href="/dashboard/community"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Отменить
              </a>
              <SaveButton formData={formData} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Toolbox */}
          <div className="w-64 flex-shrink-0 overflow-y-auto">
            <Toolbox />
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Basic Info Card */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Основная информация
                </h2>
                
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Название сообщества *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Например: Клуб любителей театра"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      URL-адрес *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-sm">
                        afisha-irkutsk.ru/community/
                      </span>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                        placeholder="teatr-club"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                      Только латинские буквы, цифры и дефисы
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Категория *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Выберите категорию</option>
                      <option value="culture">Культура и искусство</option>
                      <option value="sport">Спорт и здоровье</option>
                      <option value="education">Образование</option>
                      <option value="hobby">Хобби и увлечения</option>
                      <option value="business">Бизнес и карьера</option>
                      <option value="social">Социальные проекты</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Краткое описание *
                    </label>
                    <textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Короткое описание вашего сообщества (до 200 символов)"
                    />
                    <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                      {formData.shortDescription.length}/200 символов
                    </p>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Обложка сообщества
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                      <input
                        type="file"
                        id="coverImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'coverImage')}
                        className="hidden"
                      />
                      <label htmlFor="coverImage" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                          {formData.coverImage ? formData.coverImage.name : 'Загрузить обложку (1200x400px)'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Логотип сообщества
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'logo')}
                        className="hidden"
                      />
                      <label htmlFor="logo" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                          {formData.logo ? formData.logo.name : 'Загрузить логотип (400x400px)'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                      Социальные сети
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-gray-600 dark:text-neutral-400">VK</span>
                        <input
                          type="url"
                          value={formData.socialLinks.vk}
                          onChange={(e) => handleSocialLinkChange('vk', e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="https://vk.com/your-community"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-gray-600 dark:text-neutral-400">TG</span>
                        <input
                          type="url"
                          value={formData.socialLinks.telegram}
                          onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="https://t.me/your-channel"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-gray-600 dark:text-neutral-400">IG</span>
                        <input
                          type="url"
                          value={formData.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="https://instagram.com/your-account"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-gray-600 dark:text-neutral-400">Web</span>
                        <input
                          type="url"
                          value={formData.socialLinks.website}
                          onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="https://your-website.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Builder Canvas */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Дизайн страницы сообщества
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                    Перетаскивайте блоки слева для создания уникального дизайна
                  </p>
                </div>
                
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
          </div>

          {/* Right Sidebar - Settings */}
          <div className="w-80 flex-shrink-0 overflow-y-auto">
            <SettingsPanel />
          </div>
        </div>
      </div>
    </Editor>
  );
}
