'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleExpertActiveStatus } from '@/app/admin/experts/actions';

interface Expert {
  id: string;
  name: string;
  slug: string;
  specialization: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  } | null;
}

interface ExpertsTableProps {
  experts: Expert[];
}

export default function ExpertsTable({ experts: initialExperts }: ExpertsTableProps) {
  const [experts, setExperts] = useState(initialExperts);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filteredExperts = experts.filter(e => {
    if (filter === 'active') return e.is_active;
    if (filter === 'inactive') return !e.is_active;
    return true;
  });

  const handleToggleActive = async (expertId: string, currentStatus: boolean) => {
    setLoading(expertId);
    try {
      const result = await toggleExpertActiveStatus(expertId, !currentStatus);
      
      if (result.success) {
        setExperts(prev => 
          prev.map(e => 
            e.id === expertId 
              ? { ...e, is_active: !currentStatus }
              : e
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
            Список экспертов
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
              Все ({experts.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Активные ({experts.filter(e => e.is_active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Неактивные ({experts.filter(e => !e.is_active).length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Эксперт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Владелец профиля
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Специализация
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Рейтинг
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
            {filteredExperts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Нет экспертов для отображения
                </td>
              </tr>
            ) : (
              filteredExperts.map((expert) => (
                <tr key={expert.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {expert.avatar_url ? (
                        <img
                          src={expert.avatar_url}
                          alt={expert.name}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                          <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/experts/${expert.slug}`}
                          target="_blank"
                          className="font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                        >
                          {expert.name}
                          {expert.is_verified && (
                            <svg className="size-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          )}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {expert.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expert.profiles?.full_name || 'Без имени'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {expert.profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {expert.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <svg className="size-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {expert.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({expert.reviews_count})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      expert.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {expert.is_active ? '✓ Активен' : '⏸ Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleActive(expert.id, expert.is_active)}
                      disabled={loading === expert.id}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        expert.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === expert.id ? 'Загрузка...' : expert.is_active ? 'Деактивировать' : 'Активировать'}
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