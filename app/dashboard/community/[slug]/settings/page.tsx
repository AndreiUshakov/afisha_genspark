import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface SettingsPageProps {
  params: {
    slug: string
  }
}

export default async function CommunitySettingsPage({ params }: SettingsPageProps) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Проверяем, что сообщество принадлежит пользователю
  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', params.slug)
    .eq('owner_id', user.id)
    .single()
  
  if (!community) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Настройки сообщества "{community.name}"
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Управляйте настройками и внешним видом вашего сообщества
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основные настройки */}
        <Link
          href={`/dashboard/community/${params.slug}/settings/basic`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Основная информация
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Название, описание, категория, логотип
              </p>
            </div>
          </div>
        </Link>

        {/* Дизайн страницы */}
        <Link
          href={`/dashboard/community/${params.slug}/settings/design`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Дизайн и внешний вид
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Обложка, цветовая схема, баннеры
              </p>
            </div>
          </div>
        </Link>

        {/* Контент страницы */}
        <Link
          href={`/dashboard/community/${params.slug}/settings/content`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Контент страницы
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Конструктор блоков, текст, медиа
              </p>
            </div>
          </div>
        </Link>

        {/* Социальные сети */}
        <Link
          href={`/dashboard/community/${params.slug}/settings/social`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 rounded-lg dark:bg-orange-900/20">
              <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Социальные сети
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Ссылки на соцсети и мессенджеры
              </p>
            </div>
          </div>
        </Link>

        {/* Медиа галерея */}
        <Link
          href={`/dashboard/community/${params.slug}/media`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-pink-50 rounded-lg dark:bg-pink-900/20">
              <svg className="size-6 text-pink-600 dark:text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Медиа галерея
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Фото и видео вашего сообщества
              </p>
            </div>
          </div>
        </Link>

        {/* Публикация */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg dark:bg-emerald-900/20">
              <svg className="size-6 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Статус публикации
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
                {community.is_published 
                  ? 'Сообщество опубликовано и видно всем'
                  : 'Сообщество в режиме черновика'
                }
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                community.is_published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {community.is_published ? 'Опубликовано' : 'Черновик'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Опасная зона */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 dark:bg-red-900/10 dark:border-red-900/50">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-4">
          ⚠️ Опасная зона
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-400">
                Удалить сообщество
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400/80">
                После удаления все данные будут безвозвратно потеряны
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}