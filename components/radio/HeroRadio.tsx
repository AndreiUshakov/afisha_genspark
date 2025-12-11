'use client';

import React from 'react';
import { useAudio } from '@/contexts/AudioContext';

/**
 * Hero секция страницы радио с большой кнопкой Play
 */
const HeroRadio: React.FC = () => {
  const { isPlaying, isLoading, error, play, pause } = useAudio();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          {/* Логотип/Эмодзи радио */}
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="text-8xl sm:text-9xl filter drop-shadow-lg">
                📻
              </div>
              {isPlaying && !isLoading && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white"></span>
                </div>
              )}
            </div>
          </div>

          {/* Название */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Иркутское радио
          </h1>

          {/* Подзаголовок */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Слушайте прямой эфир Иркутского радио онлайн
          </p>

          {/* Большая кнопка Play/Pause */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className={`
                group relative
                w-24 h-24 sm:w-32 sm:h-32
                rounded-full
                flex items-center justify-center
                transition-all duration-300 ease-out
                transform hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-blue-500/50
                ${error 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                  : isPlaying 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl shadow-blue-500/50' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-xl shadow-gray-500/30'
                }
                ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label={isPlaying ? 'Остановить радио' : 'Включить радио'}
            >
              {/* Анимированные круги при воспроизведении */}
              {isPlaying && !isLoading && !error && (
                <>
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400/50 animate-pulse"></span>
                </>
              )}

              {/* Иконка */}
              <div className="relative z-10">
                {isLoading ? (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : error ? (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Статус */}
          <div className="text-center min-h-[2rem]">
            {error ? (
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            ) : isLoading ? (
              <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                Подключение к радио...
              </p>
            ) : isPlaying ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <p className="text-gray-900 dark:text-white font-medium">
                  В эфире
                </p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Нажмите кнопку для начала прослушивания
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroRadio;