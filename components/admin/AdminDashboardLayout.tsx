'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/auth/logout/actions';

interface MenuItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface AdminDashboardLayoutProps {
  children: ReactNode;
  user?: {
    email: string;
    avatar_url?: string;
    full_name?: string;
  };
}

export default function AdminDashboardLayout({ children, user }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Основные пункты меню админ-панели
  const menuItems: MenuItem[] = [
    {
      href: '/admin',
      label: 'Главная',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      href: '/admin/moderation',
      label: 'Модерация',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h6"/>
          <path d="M9 16h6"/>
          <path d="m14 2-3 3.5L8 2"/>
          <path d="M3 10v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10"/>
          <path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4"/>
        </svg>
      )
    },
    {
      href: '/admin/communities',
      label: 'Сообщества',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      href: '/admin/events',
      label: 'Мероприятия',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      )
    },
    {
      href: '/admin/posts',
      label: 'Посты блога',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M2 15h10"/>
          <path d="m5 12-3 3 3 3"/>
        </svg>
      )
    },
    {
      href: '/admin/experts',
      label: 'Эксперты',
      icon: (
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      )
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0].toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Мобильное меню backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Компактная боковая панель - всегда видна на мобильных */}
      <aside className="fixed top-0 left-0 z-30 h-full w-16 bg-gradient-to-b from-red-600 to-red-700 border-r border-red-800 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Кнопка гамбургера */}
          <div className="flex items-center justify-center h-16 border-b border-red-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-red-800/50 text-white"
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
              {menuItems.slice(0, 4).map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-white text-red-600'
                        : 'text-red-100 hover:bg-red-800/50'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Полная боковая панель */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-red-600 to-red-700 border-r border-red-800 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Лого и кнопки */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-red-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <svg className="size-6 text-red-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-white block">Админ-панель</span>
                <span className="text-xs text-red-100">Афиша Иркутска</span>
              </div>
            </Link>
            {/* Кнопка закрытия для мобильных */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-800/50 text-white"
            >
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Меню навигации */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-white text-red-600 shadow-lg'
                          : 'text-red-100 hover:bg-red-800/50 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-red-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Быстрая ссылка на основной сайт */}
          <div className="p-4 border-t border-red-800">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-100 bg-red-800/50 rounded-lg hover:bg-red-800 transition-colors"
            >
              <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Вернуться на сайт
            </Link>
          </div>

          {/* Информация о пользователе */}
          <div className="p-4 border-t border-red-800 bg-red-800/30">
            <div className="flex items-center gap-3">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'Admin'}
                  className="size-10 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="size-10 rounded-full bg-white flex items-center justify-center border-2 border-white">
                  <span className="text-sm font-bold text-red-600">{initials}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.full_name || user?.email?.split('@')[0] || 'Администратор'}
                </p>
                <p className="text-xs text-red-100 truncate">Администратор</p>
              </div>
              {/* Кнопка выхода */}
              <form action={signOut}>
                <button
                  type="submit"
                  className="p-2 rounded-lg text-red-100 hover:bg-red-800/50 transition-colors"
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
      <div className="pl-16 lg:pl-72 min-h-screen">
        {/* Контент страницы */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}