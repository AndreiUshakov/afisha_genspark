/**
 * Типы для интернет-радио плеера
 */

/**
 * Интерфейс контекста управления аудио
 */
export interface AudioContextType {
  /** Состояние воспроизведения */
  isPlaying: boolean;
  /** Уровень громкости (0-1) */
  volume: number;
  /** Состояние загрузки потока */
  isLoading: boolean;
  /** Текст ошибки, если есть */
  error: string | null;
  /** Начать воспроизведение */
  play: () => Promise<void>;
  /** Остановить воспроизведение */
  pause: () => void;
  /** Установить уровень громкости */
  setVolume: (volume: number) => void;
  /** Переключить mute/unmute */
  toggleMute: () => void;
  /** Состояние mute */
  isMuted: boolean;
}

/**
 * Данные, сохраняемые в localStorage
 */
export interface VolumeStorage {
  /** Уровень громкости */
  volume: number;
  /** Состояние mute */
  muted?: boolean;
}

/**
 * Константы для радио
 */
export const RADIO_CONSTANTS = {
  /** URL потока радио  'https://96mp3.lradio.ru/lradio.stereo.96.mp3', */
  STREAM_URL: 'https://iro.su/radio/stream.mp3',
  /** Ключ для localStorage */
  VOLUME_STORAGE_KEY: 'irkutsk-radio-volume',
  /** Громкость по умолчанию */
  DEFAULT_VOLUME: 0.5,
  /** Задержка для debounce сохранения */
  SAVE_DEBOUNCE_MS: 300,
} as const;