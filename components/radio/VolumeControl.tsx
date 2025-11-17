'use client';

import React, { memo } from 'react';

interface VolumeControlProps {
  /** Текущий уровень громкости (0-1) */
  volume: number;
  /** Состояние mute */
  isMuted: boolean;
  /** Callback при изменении громкости */
  onVolumeChange: (volume: number) => void;
  /** Callback при клике на иконку (mute/unmute) */
  onToggleMute: () => void;
}

/**
 * Компонент управления громкостью радио
 */
const VolumeControl: React.FC<VolumeControlProps> = memo(({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  // Определяем иконку в зависимости от уровня громкости
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      );
    } else if (volume < 0.5) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <div className="flex items-center gap-2">
      {/* Иконка громкости с возможностью mute/unmute */}
      <button
        onClick={onToggleMute}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
        aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
        title={isMuted ? 'Включить звук' : 'Выключить звук'}
      >
        {getVolumeIcon()}
      </button>

      {/* Слайдер громкости */}
      <div className="relative w-20 group">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleSliderChange}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volumePercent}%, #e5e7eb ${volumePercent}%, #e5e7eb 100%)`
          }}
          aria-label="Громкость"
          title={`Громкость: ${volumePercent}%`}
        />
        
        {/* Tooltip с процентами при наведении */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {volumePercent}%
        </div>
      </div>

      <style jsx>{`
        /* Кастомные стили для слайдера */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        input[type="range"]:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
});

VolumeControl.displayName = 'VolumeControl';

export default VolumeControl;