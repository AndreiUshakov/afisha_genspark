'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id;

  // Mock existing post data (in real app, fetch from API)
  const [formData, setFormData] = useState({
    title: 'Как организовать успешное мероприятие в Иркутске',
    content: `Организация мероприятий - это искусство, требующее внимания к деталям и тщательного планирования.

# Основные шаги

## 1. Планирование
Начните с четкого определения целей и задач вашего мероприятия.

## 2. Выбор площадки
Важно выбрать место, которое соответствует формату и масштабу события.

## 3. Продвижение
Используйте все доступные каналы для информирования потенциальных участников.

**Важно:** Не забывайте о деталях, они создают общее впечатление!`,
    excerpt: 'Делимся опытом проведения мероприятий и полезными советами для начинающих организаторов в нашем городе.',
    category: 'guides',
    tags: 'организация, мероприятия, иркутск, советы',
    image: null as File | null,
    isPublished: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form updated:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      // Handle deletion
      console.log('Delete post:', postId);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Редактировать пост
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            ID поста: {postId}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
        >
          Удалить пост
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Основная информация
          </h2>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Введите заголовок поста..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Краткое описание *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                placeholder="Короткое описание для превью (до 200 символов)..."
              />
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                {formData.excerpt.length}/200 символов
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Содержание *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={16}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none font-mono text-sm"
                placeholder="Напишите содержание вашего поста..."
              />
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="">Выберите категорию</option>
                <option value="news">Новости</option>
                <option value="announcements">Анонсы</option>
                <option value="reviews">Обзоры</option>
                <option value="interviews">Интервью</option>
                <option value="guides">Гайды</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Теги
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="концерт, музыка, иркутск (через запятую)"
              />
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                Разделяйте теги запятыми
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Обложка поста
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {formData.image ? formData.image.name : 'Нажмите, чтобы изменить изображение'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                    PNG, JPG до 10MB
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Предпросмотр
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            {formData.title ? (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {formData.title}
              </h1>
            ) : (
              <p className="text-gray-400 dark:text-neutral-600 italic">
                Заголовок будет отображаться здесь...
              </p>
            )}
            
            {formData.excerpt && (
              <p className="text-lg text-gray-600 dark:text-neutral-400 mb-6 italic border-l-4 border-purple-500 pl-4">
                {formData.excerpt}
              </p>
            )}

            {formData.content ? (
              <div className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">
                {formData.content}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-neutral-600 italic">
                Содержание будет отображаться здесь...
              </p>
            )}

            {formData.tags && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
                {formData.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-sm rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-6">
          <a
            href="/dashboard/community/posts"
            className="px-6 py-3 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            Отменить
          </a>
          <div className="flex gap-3">
            <button
              type="submit"
              onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
              className="px-6 py-3 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white border border-gray-300 dark:border-neutral-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors"
            >
              Сохранить как черновик
            </button>
            <button
              type="submit"
              onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
