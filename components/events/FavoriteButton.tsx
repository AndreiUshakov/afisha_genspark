'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavorite } from '@/app/actions/favorites';

interface FavoriteButtonProps {
  eventId: string;
  initialFavorited?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function FavoriteButton({ 
  eventId, 
  initialFavorited = false,
  variant = 'default',
  className = ''
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleFavorite(eventId);

      if (result.requiresAuth) {
        // Перенаправляем на страницу входа
        router.push('/auth/login');
        return;
      }

      if (result.success) {
        // Переключаем состояние
        setIsFavorited(!isFavorited);
      } else if (result.error) {
        // Показываем ошибку
        alert(result.error);
      }
    });
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`p-2 rounded-lg transition-all ${
          isFavorited
            ? 'text-red-600 hover:text-red-700'
            : 'text-gray-400 hover:text-red-600'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-label={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
        title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <svg
          className="w-5 h-5"
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`p-3 rounded-lg border transition-all ${
        isFavorited
          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg
        className="w-6 h-6"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}