'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinCommunity, leaveCommunity } from '@/app/communities/[slug]/actions';

interface CommunityCardProps {
  community: {
    id: string;
    slug: string;
    name: string;
    description: string;
    avatar_url: string | null;
    cover_url: string | null;
    is_verified: boolean;
  };
  membersCount: number;
  eventsCount: number;
  isMember: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
}

export default function CommunityCard({
  community,
  membersCount,
  eventsCount,
  isMember: initialIsMember,
  isOwner,
  isAuthenticated
}: CommunityCardProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleActionClick = async () => {
    // Если не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Если владелец, переходим в настройки
    if (isOwner) {
      router.push(`/dashboard/community/${community.slug}/settings`);
      return;
    }

    setIsLoading(true);
    
    try {
      if (isMember) {
        // Покинуть сообщество
        const result = await leaveCommunity(community.id);
        
        if (result.success) {
          setIsMember(false);
          router.refresh();
        } else {
          alert(result.error || 'Не удалось покинуть сообщество');
        }
      } else {
        // Вступить в сообщество
        const result = await joinCommunity(community.id);
        
        if (result.success) {
          setIsMember(true);
          router.refresh();
        } else {
          alert(result.error || 'Не удалось вступить в сообщество');
        }
      }
    } catch (error) {
      console.error('Error toggling membership:', error);
      alert('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Загрузка...';
    if (isOwner) return 'Управление';
    if (isMember) return 'Покинуть';
    if (isAuthenticated) return 'Вступить';
    return 'Войти';
  };

  const getButtonClass = () => {
    if (isOwner) {
      return 'py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700';
    }
    if (isMember) {
      return 'py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700';
    }
    return 'py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800';
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative h-40 w-full">
        <Image
          src={community.cover_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'}
          alt={community.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Avatar overlay */}
        <div className="absolute bottom-3 left-3 w-14 h-14 rounded-xl overflow-hidden border-2 border-white">
          <Image
            src={community.avatar_url || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'}
            alt={community.name}
            fill
            className="object-cover"
          />
        </div>
        
        {community.is_verified && (
          <div className="absolute top-3 right-3">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-300 mb-2">
          {community.name}
        </h3>
        <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
          {community.description}
        </p>

        <div className="flex items-center gap-x-4 text-sm text-gray-500 dark:text-neutral-500 mb-4">
          <div className="flex items-center gap-x-1">
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{membersCount >= 1000 ? `${(membersCount / 1000).toFixed(1)}K` : membersCount}</span>
          </div>
          {eventsCount > 0 && (
            <div className="flex items-center gap-x-1">
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              <span>{eventsCount} {eventsCount === 1 ? 'событие' : eventsCount < 5 ? 'события' : 'событий'}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/communities/${community.slug}`}
            className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Подробнее
          </Link>
          <button
            type="button"
            onClick={handleActionClick}
            disabled={isLoading}
            className={`${getButtonClass()} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}