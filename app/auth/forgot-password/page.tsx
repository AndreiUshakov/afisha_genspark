'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { requestPasswordReset } from './actions'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await requestPasswordReset(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
      }
    })
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Забыли пароль?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Вспомнили пароль?
                {' '}
                <Link href="/auth/login" className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500">
                  Войти
                </Link>
              </p>
            </div>

            <div className="mt-5">
              {success ? (
                <div className="space-y-4">
                  <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/10 dark:text-green-400" role="alert">
                    <div className="flex items-start">
                      <svg className="shrink-0 size-4 mt-0.5 me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <div>
                        <span className="font-medium">Письмо отправлено!</span>
                        <p className="mt-1">
                          Проверьте вашу почту и перейдите по ссылке для сброса пароля. Если письмо не пришло, проверьте папку "Спам".
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/auth/login"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                  >
                    Вернуться к входу
                  </Link>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/10 dark:text-red-400" role="alert">
                      <span className="font-medium">Ошибка!</span> {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid gap-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                        Email адрес
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          required
                          disabled={isPending}
                          placeholder="mail@example.com"
                          autoFocus
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                        Мы отправим вам письмо со ссылкой для сброса пароля
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Отправка...
                        </>
                      ) : (
                        'Отправить ссылку для сброса'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}