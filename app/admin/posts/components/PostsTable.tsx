'use client';

import { useState } from 'react';
import { togglePostPublishStatus } from '@/app/admin/posts/actions';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  } | null;
  communities?: {
    name: string;
    slug: string;
  } | null;
  experts?: {
    name: string;
    slug: string;
  } | null;
}

interface PostsTableProps {
  posts: Post[];
}

export default function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filteredPosts = posts.filter(p => {
    if (filter === 'published') return p.is_published;
    if (filter === 'unpublished') return !p.is_published;
    return true;
  });

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    setLoading(postId);
    try {
      const result = await togglePostPublishStatus(postId, !currentStatus);
      
      if (result.success) {
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, is_published: !currentStatus }
              : p
          )
        );
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      alert('Произошла ошибка при изменении статуса');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Список постов
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Все ({posts.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'published'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Опубликованные ({posts.filter(p => p.is_published).length})
            </button>
            <button
              onClick={() => setFilter('unpublished')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unpublished'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Не опубликованные ({posts.filter(p => !p.is_published).length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Пост
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Источник
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Нет постов для отображения
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {post.excerpt || post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {post.profiles?.full_name || 'Без имени'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {post.profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.communities ? (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded">
                        {post.communities.name}
                      </span>
                    ) : post.experts ? (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded">
                        {post.experts.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.is_published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {post.is_published ? '✓ Опубликовано' : '⏳ Не опубликовано'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(post.id, post.is_published)}
                      disabled={loading === post.id}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        post.is_published
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === post.id ? 'Загрузка...' : post.is_published ? 'Снять с публикации' : 'Опубликовать'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}