import React from 'react';
import HeroRadio from '@/components/radio/HeroRadio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Иркутское радио | Слушать онлайн',
  description: 'Иркутское радио - слушайте прямой эфир онлайн. Социально значимый контент, информация о городе, оповещение населения.',
};

export default function RadioPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero секция с кнопкой Play */}
      <HeroRadio />

      {/* Основной контент */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Описание радио */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-neutral-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              О радио
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                АНО «Институт Развития Общества» с октября 2022 года является собственником сети проводного радиовещания на территории города Иркутска и СМИ «Иркутское радио».
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Значимую часть производимого информационного контента составляют передачи социальной направленности, задачей которых является пробудить в человеке желание развиваться и улучшать мир вокруг себя.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                В настоящий момент мы активно сотрудничаем с крупными компаниями города Иркутска, Администрацией и Думой города, а также муниципальными унитарными предприятиями.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Аудитория слушателей проводного радио города Иркутска – до 10 000 социально-активных человек. Кроме того, проводное радио стабильно удерживает первые места в рейтинге доверия к радиостанции.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Одна из значимых функций систем проводного радиовещания – возможность оповещения населения при возникновении чрезвычайных ситуаций. Радиоканал города Иркутска входит в единую систему оповещения населения в случае возникновения ЧС.
              </p>
            </div>
          </div>

          {/* Карточка с приложением для Android */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-8 sm:p-10 border border-green-100 dark:border-green-800">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Иконка Android */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.341c-.538 0-.978.438-.978.976s.44.978.978.978.978-.44.978-.978-.44-.976-.978-.976zm-11.046 0c-.538 0-.978.438-.978.976s.44.978.978.978.978-.44.978-.978-.44-.976-.978-.976zm11.405-6.403l1.997-3.46a.414.414 0 00-.151-.567.414.414 0 00-.567.151l-2.023 3.503c-1.622-.738-3.45-1.146-5.368-1.146-1.918 0-3.746.408-5.368 1.146L4.379 5.062a.414.414 0 00-.567-.151.414.414 0 00-.151.567l1.997 3.46C2.193 11.006 0 14.753 0 19h24c0-4.247-2.193-7.994-5.658-10.062h-.46zM7 17H5v-2h2v2zm10 0h-2v-2h2v2z"/>
                  </svg>
                </div>
              </div>

              {/* Текст и кнопка */}
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Приложение для Android
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Слушайте Иркутское радио в удобном мобильном приложении
                </p>
                <a
                  href="https://iro.su/files/uploads/app-release.apk"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Скачать APK
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Размер файла: ~5 МБ
                </p>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Карточка 1 */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700 text-center">
              <div className="text-4xl mb-3">🎙️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Прямой эфир
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Круглосуточное вещание
              </p>
            </div>

            {/* Карточка 2 */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700 text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                10 000+ слушателей
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Социально-активная аудитория
              </p>
            </div>

            {/* Карточка 3 */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Система оповещения
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Информирование при ЧС
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}