'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleCommunityPublishStatus } from '@/app/admin/communities/actions';

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    email: string;
    full_name: string | null;
  } | null;
}

interface CommunitiesTableProps {
  communities: Community[];
}

export default function CommunitiesTable({ communities: initialCommunities }: CommunitiesTableProps) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filteredCommunities = communities.filter(c => {
    if (filter === 'published') return c.is_published;
    if (filter === 'unpublished') return !c.is_published;
    return true;
  });

  const handleTogglePublish = async (communityId: string, currentStatus: boolean) => {
    setLoading(communityId);
    try {
      const result = await toggleCommunityPublishStatus(communityId, !currentStatus);
      
      if (result.success) {
        setCommunities(prev => 
          prev.map(c => 
            c.id === communityId 
              ? { ...c, is_published: !currentStatus }
              : c
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
      {/* Фильтры */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Список сообществ
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
              Все ({communities.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'published'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Опубликованные ({communities.filter(c => c.is_published).length})
            </button>
            <button
              onClick={() => setFilter('unpublished')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unpublished'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Не опубликованные ({communities.filter(c => !c.is_published).length})
            </button>
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Сообщество
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Владелец
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Категория
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
            {filteredCommunities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Нет сообществ для отображения
                </td>
              </tr>
            ) : (
              filteredCommunities.map((community) => (
                <tr key={community.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {community.avatar_url ? (
                        <img
                          src={community.avatar_url}
                          alt={community.name}
                          className="size-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <svg className="size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/communities/${community.slug}`}
                          target="_blank"
                          className="font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400"
                        >
                          {community.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {community.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {community.profiles?.full_name || 'Без имени'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {community.profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {community.categories && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded">
                        {community.categories.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(community.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      community.is_published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {community.is_published ? '✓ Опубликовано' : '⏳ Не опубликовано'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(community.id, community.is_published)}
                      disabled={loading === community.id}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        community.is_published
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === community.id ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Загрузка...
                        </span>
                      ) : community.is_published ? (
                        'Снять с публикации'
                      ) : (
                        'Опубликовать'
                      )}
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