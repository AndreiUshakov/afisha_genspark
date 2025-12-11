import Link from 'next/link'

export default function CommunityNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8">
        <svg
          className="size-24 text-gray-400 dark:text-neutral-500 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Сообщество не найдено
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 max-w-md mx-auto">
          Запрашиваемое сообщество не существует или вы не являетесь его владельцем
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Вернуться на главную
        </Link>
        <Link
          href="/dashboard/create-community"
          className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          Создать сообщество
        </Link>
      </div>
    </div>
  )
}