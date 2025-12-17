# Hero Background Configuration

## Описание

Компонент Hero теперь поддерживает фоновые изображения и видео с настраиваемым белым оверлеем. Секция занимает 100% высоты экрана (`min-h-screen`) и контент вертикально центрирован для создания красивого полноэкранного эффекта.

## Настройка

В файле [`components/layout/Hero.tsx`](Hero.tsx) найдите константу `BACKGROUND_CONFIG`:

```typescript
const BACKGROUND_CONFIG = {
  // Фоновое изображение
  image: '/images/hero-background.png',
  
  // Фоновое видео
  video: undefined as string | undefined,
  // video: '/videos/hero-background.mp4',
  
  // Прозрачность белого оверлея (0-1)
  overlayOpacity: 0.5,
};
```

## Использование фонового изображения

1. Поместите изображение в папку `public/images/`
2. Укажите путь к изображению в свойстве `image`:
   ```typescript
   image: '/images/hero-background.png',
   ```
3. Убедитесь, что `video` установлен в `undefined`:
   ```typescript
   video: undefined as string | undefined,
   ```

## Использование фонового видео

1. Поместите видео файл в папку `public/videos/`
2. Закомментируйте свойство `image`:
   ```typescript
   // image: '/images/hero-background.png',
   image: undefined,
   ```
3. Раскомментируйте и настройте свойство `video`:
   ```typescript
   video: '/videos/hero-background.mp4',
   ```

## Настройка прозрачности оверлея

Измените значение `overlayOpacity` (от 0 до 1):

- `0` - полностью прозрачный (фон виден полностью)
- `0.5` - полупрозрачный (по умолчанию)
- `1` - полностью непрозрачный (фон не виден)

```typescript
overlayOpacity: 0.5, // 50% прозрачности
```

## Примеры конфигурации

### Пример 1: Фоновое изображение с 30% оверлеем

```typescript
const BACKGROUND_CONFIG = {
  image: '/images/hero-background.png',
  video: undefined as string | undefined,
  overlayOpacity: 0.3,
};
```

### Пример 2: Фоновое видео с 70% оверлеем

```typescript
const BACKGROUND_CONFIG = {
  image: undefined,
  video: '/videos/hero-background.mp4',
  overlayOpacity: 0.7,
};
```

### Пример 3: Без фона (как было изначально)

```typescript
const BACKGROUND_CONFIG = {
  image: undefined,
  video: undefined as string | undefined,
  overlayOpacity: 0.5,
};
```

## Рекомендации

- **Размер изображения**: рекомендуется использовать изображения шириной 1920px и выше для поддержки больших экранов
- **Формат видео**: MP4 (H.264) для лучшей совместимости с браузерами
- **Размер видео**: оптимизируйте видео для веба, рекомендуемый размер файла до 5-10 МБ
- **Разрешение видео**: 1920x1080 или 1280x720 для баланса качества и производительности
- **Контраст**: используйте оверлей для улучшения читаемости текста поверх фона
- **Полноэкранный режим**: секция Hero занимает 100% высоты экрана (`min-h-screen`) с вертикально центрированным контентом

## Темная тема

Оверлей автоматически адаптируется к темной теме:
- В светлой теме: белый оверлей
- В темной теме: темно-серый оверлей (`bg-neutral-900`)