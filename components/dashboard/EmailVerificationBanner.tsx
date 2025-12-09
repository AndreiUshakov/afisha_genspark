'use client'

import { useState } from 'react'

interface EmailVerificationBannerProps {
  email: string
  onResend?: () => Promise<void>
}

export default function EmailVerificationBanner({ email, onResend }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')
  const [isDismissed, setIsDismissed] = useState(false)

  const handleResend = async () => {
    if (!onResend) return
    
    setIsResending(true)
    setMessage('')
    
    try {
      await onResend()
      setMessage('Письмо с подтверждением отправлено! Проверьте вашу почту.')
    } catch (error) {
      setMessage('Ошибка при отправке письма. Попробуйте позже.')
    } finally {
      setIsResending(false)
    }
  }

  if (isDismissed) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/20 dark:border-yellow-600">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Подтвердите ваш email
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              Мы отправили письмо с подтверждением на <strong>{email}</strong>.
              Пожалуйста, проверьте вашу почту и перейдите по ссылке для подтверждения.
            </p>
            <p className="mt-2">
              <strong>Важно:</strong> Без подтверждения email вы не сможете создавать сообщества и профили экспертов.
            </p>
          </div>
          {message && (
            <div className={`mt-2 text-sm ${message.includes('Ошибка') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {message}
            </div>
          )}
          <div className="mt-4 flex gap-3">
            {onResend && (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Отправка...' : 'Отправить письмо повторно'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-sm font-medium text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100"
            >
              Скрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}