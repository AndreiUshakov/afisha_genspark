'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleCommunityPublishStatus, restoreCommunity, hardDeleteCommunity } from '@/app/admin/communities/actions';

// Типы статусов сообщества (дублируем здесь для клиентского компонента)
export type CommunityStatus = 'draft' | 'pending_moderation' | 'published';

export const CommunityStatusLabels: Record<CommunityStatus, string> = {
  draft: 'Черновик',
  pending_moderation: 'На модерации',
  published: 'Опубликовано',
};

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: CommunityStatus;
  is_published: boolean;
  is_verified: boolean;
  deleted_at: string | null;
  created_at: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    email: string;
    full_name: string | null;
    phone: string | null;
  } | null;
}

interface CommunitiesTableProps {
  communities: Community[];
}

export default function CommunitiesTable({ communities: initialCommunities }: CommunitiesTableProps) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [filter, setFilter] = useState<'all' | 'active' | 'deleted' | 'published' | 'pending_moderation' | 'draft'>('active');
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredCommunities = communities.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'active') return !c.deleted_at;
    if (filter === 'deleted') return !!c.deleted_at;
    if (filter === 'published') return c.status === 'published' && !c.deleted_at;
    if (filter === 'pending_moderation') return c.status === 'pending_moderation' && !c.deleted_at;
    if (filter === 'draft') return c.status === 'draft' && !c.deleted_at;
    return true;
  });

  const activeCommunities = communities.filter(c => !c.deleted_at);
  const deletedCommunities = communities.filter(c => !!c.deleted_at);

  const handleTogglePublish = async (communityId: string, currentStatus: CommunityStatus) => {
    setLoading(communityId);
    try {
      const isCurrentlyPublished = currentStatus === 'published';
      const shouldPublish = !isCurrentlyPublished;
      const result = await toggleCommunityPublishStatus(communityId, shouldPublish);
      
      if (result.success) {
        setCommunities(prev =>
          prev.map(c =>
            c.id === communityId
              ? {
                  ...c,
                  status: shouldPublish ? 'published' : 'draft',
                  is_published: shouldPublish
                }
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

  const handleRestore = async (communityId: string) => {
    if (!confirm('Вы уверены, что хотите восстановить это сообщество?')) {
      return;
    }

    setLoading(communityId);
    try {
      const result = await restoreCommunity(communityId);
      
      if (result.success) {
        setCommunities(prev =>
          prev.map(c =>
            c.id === communityId
              ? { ...c, deleted_at: null }
              : c
          )
        );
        alert('Сообщество успешно восстановлено');
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      alert('Произошла ошибка при восстановлении');
    } finally {
      setLoading(null);
    }
  };

  const handleHardDelete = async (communityId: string) => {
    if (confirmDelete !== communityId) {
      setConfirmDelete(communityId);
      return;
    }

    setLoading(communityId);
    try {
      const result = await hardDeleteCommunity(communityId);
      
      if (result.success) {
        setCommunities(prev => prev.filter(c => c.id !== communityId));
        setConfirmDelete(null);
        alert('Сообщество навсегда удалено из базы данных');
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      alert('Произошла ошибка при удалении');
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Активные ({activeCommunities.length})
            </button>
            <button
              onClick={() => setFilter('deleted')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'deleted'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Удаленные ({deletedCommunities.length})
            </button>
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
              Опубликованные ({activeCommunities.filter(c => c.status === 'published').length})
            </button>
            <button
              onClick={() => setFilter('pending_moderation')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'pending_moderation'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              На модерации ({activeCommunities.filter(c => c.status === 'pending_moderation').length})
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
                Контакты
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
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Нет сообществ для отображения
                </td>
              </tr>
            ) : (
              filteredCommunities.map((community) => (
                <tr 
                  key={community.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-neutral-700/50 ${
                    community.deleted_at ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {community.avatar_url ? (
                        <img
                          src={community.avatar_url}
                          alt={community.name}
                          className={`size-10 rounded-lg object-cover ${
                            community.deleted_at ? 'opacity-50' : ''
                          }`}
                        />
                      ) : (
                        <div className={`size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center ${
                          community.deleted_at ? 'opacity-50' : ''
                        }`}>
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
                          className={`font-medium hover:text-red-600 dark:hover:text-red-400 ${
                            community.deleted_at 
                              ? 'text-gray-500 dark:text-gray-500 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {community.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {community.slug}
                        </p>
                        {community.deleted_at && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Удалено: {new Date(community.deleted_at).toLocaleDateString('ru-RU')}
                          </p>
                        )}
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
                      {community.profiles?.phone && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {community.profiles.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      {community.contact_phone && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                          </svg>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {community.contact_phone}
                          </span>
                        </div>
                      )}
                      {community.contact_email && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {community.contact_email}
                          </span>
                        </div>
                      )}
                      {!community.contact_phone && !community.contact_email && (
                        <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                          Нет контактов
                        </span>
                      )}
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
                    {community.deleted_at ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Удалено
                      </span>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        community.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : community.status === 'pending_moderation'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {CommunityStatusLabels[community.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {community.deleted_at ? (
                        <>
                          <button
                            onClick={() => handleRestore(community.id)}
                            disabled={loading === community.id}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Восстановить
                          </button>
                          <button
                            onClick={() => handleHardDelete(community.id)}
                            disabled={loading === community.id}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              confirmDelete === community.id
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                            }`}
                          >
                            {confirmDelete === community.id ? '⚠️ Подтвердить удаление' : 'Удалить навсегда'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleTogglePublish(community.id, community.status)}
                          disabled={loading === community.id}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            community.status === 'published'
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
                          ) : community.status === 'published' ? (
                            'Снять с публикации'
                          ) : (
                            'Опубликовать'
                          )}
                        </button>
                      )}
                    </div>
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