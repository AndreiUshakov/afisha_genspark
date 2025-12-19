import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface CreateEventPageProps {
  params: {
    slug: string
  }
  searchParams: {
    step?: string
  }
}

export default async function CreateEventPage({ params, searchParams }: CreateEventPageProps) {
  const supabase = await createClient()
  
  const { slug } = await params
  const { step } = await searchParams || {}

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Проверяем, что сообщество принадлежит пользователю
  const { data: community, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()
  
  if (!community) {
    notFound()
  }

  // Если указан параметр step, редиректим на соответствующую страницу
  if (step) {
    const validSteps = ['basic', 'design', 'content', 'preview']
    if (validSteps.includes(step)) {
      redirect(`/dashboard/community/${slug}/events/create/${step}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <Link
          href={`/dashboard/community/${slug}/events`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Вернуться к мероприятиям
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Создание мероприятия
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          Настройте все параметры вашего мероприятия для сообщества "{community.name}"
        </p>
      </div>

      {/* Информационный баннер */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 dark:bg-blue-900/20 dark:border-blue-600">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
              Пошаговое создание мероприятия
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                Настройте все параметры вашего мероприятия пошагово. После завершения всех настроек вы сможете опубликовать мероприятие.
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Заполните основную информацию о мероприятии</li>
                <li>Настройте оформление и визуальный стиль</li>
                <li>Добавьте контент и описание события</li>
                <li>Проверьте предпросмотр перед публикацией</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Разделы настройки мероприятия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Основные настройки */}
        <Link
          href={`/dashboard/community/${slug}/events/create/basic`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-all hover:scale-105"
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
                Основные настройки
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Название, описание, дата, место проведения, цена
              </p>
            </div>
          </div>
        </Link>

        {/* Оформление */}
        <Link
          href={`/dashboard/community/${slug}/events/create/design`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-all hover:scale-105"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="size-6 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Оформление
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Обложка, фотогалерея, команда спикеров
              </p>
            </div>
          </div>
        </Link>

        {/* Контент */}
        <Link
          href={`/dashboard/community/${slug}/events/create/content`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-all hover:scale-105"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="size-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Контент события
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Детальное описание с помощью блоков
              </p>
            </div>
          </div>
        </Link>

        {/* Предпросмотр и публикация */}
        <Link
          href={`/dashboard/community/${slug}/events/create/preview`}
          className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-lg transition-all hover:scale-105"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 rounded-lg dark:bg-orange-900/20">
              <svg className="size-6 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Предпросмотр и публикация
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Проверьте результат и опубликуйте событие
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Подсказка */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-neutral-800/50 dark:border-neutral-700">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Автоматическое заполнение
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Часть полей будет заполнена автоматически на основе настроек вашего сообщества: организатор, 
              дефолтные фильтры аудитории, медиа из общей галереи сообщества. Вы сможете изменить любые параметры 
              при создании конкретного мероприятия.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}