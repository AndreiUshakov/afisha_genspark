'use client';

import React, { memo } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import VolumeControl from './VolumeControl';

/**
 * Компонент радио-плеера "Иркутское радио"
 * 
 * Desktop: Полный плеер с иконкой, названием, кнопкой и громкостью
 * Mobile: Только кнопка play/pause
 */
const RadioPlayer: React.FC = memo(() => {
  const {
    isPlaying,
    isLoading,
    error,
    volume,
    isMuted,
    play,
    pause,
    setVolume,
    toggleMute,
  } = useAudio();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Иконка кнопки в зависимости от состояния
  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }

    if (error) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }

    if (isPlaying) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      );
    }

    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  };

  const buttonTitle = error 
    ? `Ошибка: ${error}` 
    : isLoading 
      ? 'Загрузка...' 
      : isPlaying 
        ? 'Остановить радио' 
        : 'Включить радио';

  return (
    <div className="flex items-center gap-3 py-1">
      {/* Иконка радио - только на desktop */}
      {/* <div className="hidden md:block text-2xl" aria-hidden="true">
        📻
      </div> */}

      {/* Название радио - только на desktop */}
      <div className="hidden md:block">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
          Иркутское радио
        </span>
      </div>

      {/* Кнопка Play/Pause - всегда видима */}
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className={`
          relative flex items-center justify-center
          w-9 h-9 rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${error 
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
            : isPlaying 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }
          ${isLoading ? 'cursor-wait' : 'cursor-pointer '}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={buttonTitle}
        title={buttonTitle}
      >
        {getButtonIcon()}
        
        {/* Индикатор воспроизведения */}
       {/*  {isPlaying && !isLoading && !error && (
          <span className="absolute top-3 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )} */}
      </button>

      {/* Управление громкостью - только на desktop */}
      <div className="hidden md:block">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />
      </div>

      {/* Сообщение об ошибке - только на desktop */}
      {error && (
        <div className="hidden md:block text-xs text-red-600 dark:text-red-400 max-w-[150px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
});

RadioPlayer.displayName = 'RadioPlayer';

export default RadioPlayer;