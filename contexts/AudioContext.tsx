'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AudioContextType, VolumeStorage, RADIO_CONSTANTS } from '@/types/radio';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Загрузить сохраненную громкость из localStorage
 */
const loadVolume = (): number => {
  if (typeof window === 'undefined') return RADIO_CONSTANTS.DEFAULT_VOLUME;
  
  try {
    const saved = localStorage.getItem(RADIO_CONSTANTS.VOLUME_STORAGE_KEY);
    if (saved) {
      const data: VolumeStorage = JSON.parse(saved);
      // Валидация: громкость должна быть в диапазоне 0-1
      return Math.max(0, Math.min(1, data.volume));
    }
  } catch (error) {
    console.error('Failed to load volume from localStorage:', error);
  }
  
  return RADIO_CONSTANTS.DEFAULT_VOLUME;
};

/**
 * Сохранить громкость в localStorage
 */
const saveVolume = (volume: number, muted: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const data: VolumeStorage = { volume, muted };
    localStorage.setItem(RADIO_CONSTANTS.VOLUME_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save volume to localStorage:', error);
  }
};

/**
 * Debounce функция для отложенного выполнения
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(RADIO_CONSTANTS.DEFAULT_VOLUME);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef<number>(RADIO_CONSTANTS.DEFAULT_VOLUME);

  // Debounced функция для сохранения громкости
  const debouncedSaveVolume = useRef(
    debounce((vol: number, muted: boolean) => {
      saveVolume(vol, muted);
    }, RADIO_CONSTANTS.SAVE_DEBOUNCE_MS)
  ).current;

  // Инициализация audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Создаем audio element только один раз
    if (!audioRef.current) {
      const audio = new Audio(RADIO_CONSTANTS.STREAM_URL);
      audio.preload = 'metadata';
      audioRef.current = audio;

      // Загружаем сохраненную громкость
      const savedVolume = loadVolume();
      audio.volume = savedVolume;
      setVolumeState(savedVolume);
      previousVolumeRef.current = savedVolume;

      // Обработчики событий
      const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        setError(null);
      };

      const handlePause = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };

      const handleWaiting = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handleError = (e: Event) => {
        console.error('Radio stream error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        
        const target = e.target as HTMLAudioElement;
        const errorCode = target.error?.code;
        
        switch (errorCode) {
          case MediaError.MEDIA_ERR_NETWORK:
            setError('Проблема с подключением к радио');
            break;
          case MediaError.MEDIA_ERR_DECODE:
            setError('Ошибка декодирования потока');
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setError('Формат не поддерживается');
            break;
          default:
            setError('Ошибка воспроизведения');
        }

        // Автоматически очищаем ошибку через 5 секунд
        setTimeout(() => setError(null), 5000);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      // Cleanup
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      await audioRef.current.play();
    } catch (err) {
      console.error('Failed to play:', err);
      setIsLoading(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Нажмите кнопку для воспроизведения');
        } else if (err.name === 'NotSupportedError') {
          setError('Формат не поддерживается');
        } else {
          setError('Не удалось начать воспроизведение');
        }
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;

    // Валидация: громкость должна быть в диапазоне 0-1
    const validVolume = Math.max(0, Math.min(1, newVolume));
    
    audioRef.current.volume = validVolume;
    setVolumeState(validVolume);
    previousVolumeRef.current = validVolume;
    
    // Если устанавливаем громкость > 0, снимаем mute
    if (validVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    
    // Сохраняем с debounce
    debouncedSaveVolume(validVolume, isMuted);
  }, [isMuted, debouncedSaveVolume]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmute: восстанавливаем предыдущую громкость
      const volumeToRestore = previousVolumeRef.current || RADIO_CONSTANTS.DEFAULT_VOLUME;
      audioRef.current.volume = volumeToRestore;
      setVolumeState(volumeToRestore);
      setIsMuted(false);
      saveVolume(volumeToRestore, false);
    } else {
      // Mute: сохраняем текущую громкость и устанавливаем 0
      previousVolumeRef.current = volume;
      audioRef.current.volume = 0;
      setVolumeState(0);
      setIsMuted(true);
      saveVolume(volume, true);
    }
  }, [isMuted, volume]);

  const value: AudioContextType = {
    isPlaying,
    volume,
    isLoading,
    error,
    play,
    pause,
    setVolume,
    toggleMute,
    isMuted,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

/**
 * Хук для использования AudioContext
 */
export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
}