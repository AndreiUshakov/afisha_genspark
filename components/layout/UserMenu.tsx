'use client'

import Link from 'next/link'
import { signOut } from '@/app/auth/logout/actions'

interface UserMenuProps {
  user: {
    email: string
    avatar_url?: string
    full_name?: string
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const initials = user.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="relative flex items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-gray-300 before:-translate-y-1/2 dark:before:bg-neutral-700">
      {/* Аватар и имя пользователя */}
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
      >
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.full_name || 'User'} 
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {initials}
            </span>
          </div>
        )}
        <span className="hidden md:block text-sm text-gray-800 dark:text-neutral-200 font-medium">
          {user.full_name || user.email.split('@')[0]}
        </span>
      </Link>

      {/* Кнопка выхода */}
      <form action={signOut}>
        <button
          type="submit"
          className="p-2 rounded-lg text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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
  )
}