'use client';

import { useState } from 'react';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaGrid } from '@/components/media/MediaGrid';

export default function ExpertMediaPage() {
  const [view, setView] = useState<'grid' | 'upload'>('grid');
  const [media, setMedia] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      title: 'Консультация по организации мероприятий',
      uploadedAt: '2024-10-18T09:00:00Z'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      title: 'Командная работа над проектом',
      uploadedAt: '2024-10-12T11:30:00Z'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      title: 'Презентация для клиента',
      uploadedAt: '2024-10-08T15:00:00Z'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      title: 'Рабочее пространство',
      uploadedAt: '2024-09-30T10:00:00Z'
    }
  ]);

  const handleDelete = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleUploadComplete = () => {
    // TODO: Обновить список медиа после загрузки
    setView('grid');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Медиагалерея
            </h1>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              Управление фотографиями вашего профиля эксперта
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              📚 Галерея
            </button>
            <button
              onClick={() => setView('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              ⬆️ Загрузить
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Всего фото</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{media.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Доступно слотов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{200 - media.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Последняя загрузка</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {media.length > 0 
                  ? new Date(media[0].uploadedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                  : 'Нет данных'
                }
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
        {view === 'upload' ? (
          <MediaUploader
            ownerType="expert"
            ownerId="expert-1"
            currentCount={media.length}
            onUploadComplete={handleUploadComplete}
          />
        ) : (
          <MediaGrid
            media={media}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}