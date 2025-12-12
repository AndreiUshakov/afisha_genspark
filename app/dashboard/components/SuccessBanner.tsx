'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SuccessBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = searchParams.get('verified') === 'true'
    const communityCreated = searchParams.get('success') === 'community_created'
    
    if (verified || communityCreated) {
      setShow(true)
      
      // Удаляем параметр из URL через 100ms
      setTimeout(() => {
        const url = new URL(window.location.href)
        url.searchParams.delete('verified')
        url.searchParams.delete('success')
        router.replace(url.pathname + url.search, { scroll: false })
      }, 100)
      
      // Скрываем баннер через 5 секунд
      setTimeout(() => {
        setShow(false)
      }, 5000)
    }
  }, [searchParams, router])

  const isVerified = searchParams.get('verified') === 'true'
  const isCommunityCreated = searchParams.get('success') === 'community_created'

  if (!show) return null

  return (
    <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 dark:bg-green-900/20 dark:border-green-600 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            {isVerified && 'Email успешно подтвержден! 🎉'}
            {isCommunityCreated && 'Сообщество успешно создано! 🎉'}
          </h3>
          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
            <p>
              {isVerified && 'Теперь вы можете создавать сообщества и профили экспертов. Добро пожаловать!'}
              {isCommunityCreated && 'Теперь вы можете управлять своим сообществом, создавать события и публиковать посты.'}
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 dark:bg-green-900/20 dark:hover:bg-green-900/40"
          >
            <span className="sr-only">Закрыть</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}