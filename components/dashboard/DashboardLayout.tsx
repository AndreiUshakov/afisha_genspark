'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/auth/logout/actions';

interface MenuItem {
  href: string;
  label: string;
  icon: ReactNode;
  roles?: string[]; // Роли, которые могут видеть этот пункт
}

interface Community {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  status: 'draft' | 'pending_moderation' | 'published';
}

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: ('user' | 'community' | 'expert' | 'admin')[]; // Массив ролей пользователя
  user?: {
    email: string;
    avatar_url?: string;
    full_name?: string;
  };
  communities?: Community[];
}

export default function DashboardLayout({ children, userRole = ['user'], user, communities = [] }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Базовые пункты меню для всех пользователей
  const baseMenuItems: MenuItem[] = [
    {
      href: '/dashboard',
      label: 'Главная',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      href: '/dashboard/profile',
      label: 'Мой профиль',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      href: '/dashboard/favorites',
      label: 'Избранное',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      )
    }
    /* {
      href: '/dashboard/settings',
      label: 'Настройки',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    } */
  ];

  // Навигационные ссылки из основного сайта
  const navigationMenuItems: MenuItem[] = [
    {
      href: '/events',
      label: 'Мероприятия',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      )
    },
    {
      href: '/communities',
      label: 'Сообщества',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      href: '/experts',
      label: 'Эксперты',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    },
    {
      href: '/blog',
      label: 'Блог',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M2 15h10"/>
          <path d="m5 12-3 3 3 3"/>
        </svg>
      )
    }
  ];

  // Функция для генерации пунктов меню сообществ
  const getCommunityMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];
    
    // Если есть сообщества, создаем для каждого свой раздел
    if (communities.length > 0) {
      communities.forEach((community) => {
        // Все сообщества доступны владельцу независимо от статуса
        const statusLabel =
          community.status === 'draft' ? ' (черновик)' :
          community.status === 'pending_moderation' ? ' (на модерации)' : '';
        
        items.push({
          href: `/dashboard/community/${community.slug}`,
          label: community.name + statusLabel,
          icon: community.avatar_url ? (
            <img src={community.avatar_url} alt={community.name} className="size-4 rounded-full object-cover" />
          ) : (
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          ),
          roles: ['community']
        });
      });
    }
    
    return items;
  };

  const communityMenuItems = getCommunityMenuItems();

  // Пункты меню для эксперта
  const expertMenuItems: MenuItem[] = [
    {
      href: '/dashboard/expert',
      label: 'Профиль эксперта',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      roles: ['expert']
    },
    {
      href: '/dashboard/expert/services',
      label: 'Мои услуги',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7h-9"/>
          <path d="M14 17H5"/>
          <circle cx="17" cy="17" r="3"/>
          <circle cx="7" cy="7" r="3"/>
        </svg>
      ),
      roles: ['expert']
    },
    {
      href: '/dashboard/expert/media',
      label: 'Медиагалерея',
      icon: (
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      roles: ['expert']
    }
  ];

  // Собираем все пункты меню в зависимости от роли
  const getMenuItems = () => {
    let items = [...baseMenuItems];
    
    // Добавляем разделитель перед разделами сайта
    /* items.push({
      href: '#',
      label: '─────',
      icon: null
    }); */
    
    // Добавляем навигацию по основному сайту
    //items = [...items, ...navigationMenuItems];
    
    
    /* if (userRole === 'community' || userRole === 'expert') {
      items.push({
        href: '#',
        label: '─────',
        icon: null
      });
    }

    if (userRole === 'community') {
      items = [...items, ...communityMenuItems];
    }

    if (userRole === 'expert') {
      items = [...items, ...expertMenuItems];
    } */

    // Добавляем сообщества, если они есть
    if (communityMenuItems.length > 0) {
      items.push({
        href: '#',
        label: '─────',
        icon: null
      });
      
      items = [...items, ...communityMenuItems];
    }

    //check user role 'expert'
    if (userRole.includes('expert') ){
      items.push({
        href: '#',
        label: '─────',
        icon: null
      });

      items = [...items, ...expertMenuItems];        
    }
    return items;
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Мобильное меню backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Компактная боковая панель (только иконки) - всегда видна на мобильных */}
      <aside className="fixed top-0 left-0 z-30 h-full w-16 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Кнопка гамбургера */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-neutral-700">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6"/>
                <line x1="3" x2="21" y1="12" y2="12"/>
                <line x1="3" x2="21" y1="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          {/* Компактные иконки меню */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {menuItems.slice(0, 4).map((item, index) => {
                if (item.label === '─────') return null;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* Кнопка уведомлений */}
          <div className="p-2 border-t border-gray-200 dark:border-neutral-700">
            <button className="w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center justify-center">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Полная боковая панель */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Лого и кнопки */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-neutral-700">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Город Живёт!
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {/* Кнопка уведомлений */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </button>
              {/* Кнопка закрытия для мобильных */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Меню навигации */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                // Разделитель
                if (item.label === '─────') {
                  return (
                    <li key={index} className="py-2">
                      <div className="border-t border-gray-200 dark:border-neutral-700" />
                    </li>
                  );
                }

                const active = isActive(item.href);

                return (
                  <li key={item.href + index}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Кнопки создания для обычных пользователей */}
          {(userRole.includes('user') ) && (
            <div className="p-4 border-t border-gray-200 dark:border-neutral-700 space-y-2">
              <Link
                href="/dashboard/create-community"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Создать сообщество
              </Link>
              <Link
                href="/dashboard/become-expert"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Стать экспертом
              </Link>
            </div>
          )}

          {/* Кнопка админ-панели для администраторов */}
          {userRole.includes('admin') && (
            <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Админ-панель
              </Link>
            </div>
          )}

          {/* Информация о пользователе */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{initials}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {user?.full_name || user?.email?.split('@')[0] || 'Пользователь'}
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {userRole.includes('admin') ? 'Администратор' :
                   userRole.includes('expert') && userRole.includes('community') ? 'Эксперт • Сообщество' :
                   userRole.includes('expert') ? 'Эксперт' :
                   userRole.includes('community') ? 'Сообщество' :
                   'Пользователь'}
                </p>
              </div>
              {/* Кнопка выхода */}
              <form action={signOut}>
                <button
                  type="submit"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
                  title="Выйти"
                >
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" x2="9" y1="12" y2="12"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <div className="pl-16 lg:pl-64 min-h-screen">
        {/* Контент страницы */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
