'use client';

import React, { useState } from 'react';
import { JoditEditor } from '@/components/editor/JoditEditor';

export default function CommunitySettingsPage() {
  // Состояние для основной информации
  const [communityName, setCommunityName] = useState('Моё сообщество');
  const [shortDescription, setShortDescription] = useState('Краткое описание сообщества');
  
  // Состояние для изображений
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('/placeholder-cover.jpg');
  const [logoPreview, setLogoPreview] = useState<string>('/placeholder-logo.jpg');
  
  // Состояние для режима редактирования
  const [editMode, setEditMode] = useState<'view' | 'edit'>('view');
  
  // Состояние для содержимого страницы
  const [pageContent, setPageContent] = useState('');

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'logo'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cover') {
          setCoverImage(file);
          setCoverPreview(reader.result as string);
        } else {
          setLogoImage(file);
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Здесь будет логика сохранения
    console.log('Сохранение настроек сообщества...', {
      communityName,
      shortDescription,
      pageContent,
      coverImage,
      logoImage
    });
    setEditMode('view');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Настройка сообщества
          </h1>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Настройте внешний вид и содержимое страницы вашего сообщества
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setEditMode(editMode === 'view' ? 'edit' : 'view')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode === 'edit'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
            }`}
          >
            {editMode === 'edit' ? '👁️ Режим просмотра' : '✏️ Режим редактирования'}
          </button>
          {editMode === 'edit' && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              💾 Сохранить изменения
            </button>
          )}
        </div>
      </div>

      {/* Превью страницы сообщества - как на публичной странице */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Hero Section */}
        <section className="relative w-full h-[400px]">
          {/* Cover Image */}
          <div className="absolute inset-0">
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
            {editMode === 'edit' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label className="cursor-pointer px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg">
                  📷 Изменить обложку
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'cover')}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-end pb-8">
            <div className="flex gap-6 items-end">
              {/* Community Avatar */}
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
                {editMode === 'edit' && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-3xl">📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Community Info */}
              <div className="flex-1 text-white pb-2">
                {editMode === 'edit' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      className="text-5xl font-bold text-white bg-white/10 backdrop-blur-sm border-b-2 border-white/50 focus:outline-none focus:border-white w-full px-2 py-1 rounded"
                      placeholder="Название сообщества"
                    />
                    <textarea
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="text-xl text-gray-200 bg-white/10 backdrop-blur-sm border-b border-white/30 focus:outline-none focus:border-white/50 w-full px-2 py-1 rounded resize-none"
                      placeholder="Краткое описание"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-5xl font-bold">{communityName}</h1>
                      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xl text-gray-200 mb-4 max-w-3xl">{shortDescription}</p>
                  </>
                )}
                
                {/* Quick Stats */}
                <div className="flex gap-6 text-base">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>1,234 подписчика</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Иркутск</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>15 событий</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Содержимое страницы сообщества */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🎨 Содержимое страницы сообщества
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Создайте уникальное содержимое для страницы вашего сообщества
        </p>
        <JoditEditor
          content={pageContent}
          onChange={setPageContent}
          placeholder="Добавьте дополнительную информацию, фотографии, видео и другой контент..."
          readonly={editMode === 'view'}
        />
      </div>

      {/* Рекламные блоки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Блок 1 - Лендинг */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Нужен красивый лендинг?
              </h3>
              <p className="text-purple-100 mb-4">
                Создадим профессиональную посадочную страницу для вашего сообщества с уникальным дизайном и высокой конверсией
              </p>
              <a
                href="mailto:info@afisha-irk.ru"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Напишите нам!
              </a>
            </div>
          </div>
        </div>

        {/* Блок 2 - Радио */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Продвижение на радио
              </h3>
              <p className="text-blue-100 mb-4">
                Расскажите о вашем сообществе тысячам слушателей Иркутского радио. Эффективное продвижение в эфире!
              </p>
              <a
                href="mailto:radio@afisha-irk.ru"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Узнать подробнее
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Подсказка */}
      {editMode === 'edit' && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Режим редактирования активен
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Вы можете редактировать все элементы страницы. Не забудьте сохранить изменения!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}