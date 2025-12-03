'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { signUp } from './actions'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    
    // Проверка согласия с условиями
    const termsAccepted = formData.get('terms')
    if (!termsAccepted) {
      setError('Необходимо согласиться с условиями использования')
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
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
                Регистрация
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Уже есть аккаунт?
                {' '}
                <Link href="/auth/login" className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500">
                  Войти
                </Link>
              </p>
            </div>

            <div className="mt-5">
              {/* OAuth кнопки */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                    <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                    <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4694 37.8937C17.2798 37.8937 12.0578 33.7812 10.1515 28.1412L9.88298 28.1706L2.61057 33.7812L2.52539 34.0456C6.36992 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                    <path d="M10.1515 28.1413C9.62974 26.6725 9.32253 25.0956 9.32253 23.5C9.32253 21.9044 9.62974 20.3275 10.1515 18.8588V18.5356L2.75819 12.8369L2.52539 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.52539 34.0456L10.1515 28.1413Z" fill="#FBBC05"/>
                    <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36992 5.2875 2.52539 12.9544L10.1515 18.8588C12.0578 13.2188 17.2798 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>

                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <svg className="w-4 h-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.734c-.161.465-.885.885-1.288 1.046-.403.161-.885.242-1.449.242-.564 0-1.207-.081-1.933-.323-.726-.242-1.53-.645-2.336-1.207-.806-.564-1.611-1.288-2.336-2.094-.726-.806-1.288-1.611-1.691-2.336-.403-.726-.645-1.369-.645-1.933 0-.564.081-1.046.242-1.449.161-.403.581-1.127 1.046-1.288.242-.081.484-.161.726-.161.161 0 .323.04.484.121.161.081.323.242.484.484l1.207 2.094c.161.242.242.484.242.726 0 .161-.04.323-.121.484-.081.161-.242.323-.403.484l-.564.564c-.081.081-.121.161-.121.242 0 .081.04.161.081.242.161.323.484.726.887 1.207.403.484.806.887 1.207 1.207.484.403.887.726 1.207.887.081.04.161.081.242.081.081 0 .161-.04.242-.121l.564-.564c.161-.161.323-.323.484-.403.161-.081.323-.121.484-.121.242 0 .484.081.726.242l2.094 1.207c.242.161.403.323.484.484.081.161.121.323.121.484 0 .242-.081.484-.161.726z" fill="#FF0000"/>
                  </svg>
                  <span className="hidden sm:inline">Яндекс</span>
                </button>

                <button
                  type="button"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <svg className="w-4 h-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z" fill="#0077FF"/>
                  </svg>
                  <span className="hidden sm:inline">VK</span>
                </button>
              </div>

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                Или
              </div>

              {/* Сообщение об ошибке */}
              {error && (
                <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/10 dark:text-red-400" role="alert">
                  <span className="font-medium">Ошибка!</span> {error}
                </div>
              )}

              {/* Форма регистрации */}
              <form onSubmit={handleSubmit} className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                    Email
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
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      disabled={isPending}
                      placeholder="Минимум 8 символов"
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      disabled={isPending}
                      placeholder="Повторите пароль"
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="ms-3">
                    <label htmlFor="terms" className="text-sm dark:text-white">
                      Я согласен с{' '}
                      <a href="#" className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500">
                        условиями использования
                      </a>
                    </label>
                  </div>
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
                      Регистрация...
                    </>
                  ) : (
                    'Зарегистрироваться'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
