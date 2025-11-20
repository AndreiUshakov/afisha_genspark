# Спецификация новых CraftJS блоков

## 📦 Новые блоки для page-builder

### 1. CarouselBlock - Карусель изображений

**Файл:** `components/page-builder/blocks/CarouselBlock.tsx`

```typescript
'use client';

import { useNode } from '@craftjs/core';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface CarouselBlockProps {
  albumId?: string;
  autoplay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  height?: string;
  borderRadius?: number;
  images?: Array<{
    url: string;
    caption?: string;
  }>;
}

export const CarouselBlock = ({
  albumId,
  autoplay = true,
  interval = 3000,
  showIndicators = true,
  showArrows = true,
  height = '400px',
  borderRadius = 12,
  images = [
    { url: 'https://picsum.photos/800/400?random=1', caption: 'Фото 1' },
    { url: 'https://picsum.photos/800/400?random=2', caption: 'Фото 2' },
    { url: 'https://picsum.photos/800/400?random=3', caption: 'Фото 3' }
  ]
}: CarouselBlockProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className="my-4"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={showArrows}
        pagination={showIndicators ? { clickable: true } : false}
        autoplay={autoplay ? { delay: interval } : false}
        loop={true}
        style={{ 
          height,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden'
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image.url}
                alt={image.caption || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <p className="text-center">{image.caption}</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

CarouselBlock.craft = {
  displayName: 'Карусель изображений',
  props: {
    autoplay: true,
    interval: 3000,
    showIndicators: true,
    showArrows: true,
    height: '400px',
    borderRadius: 12,
    images: [
      { url: 'https://picsum.photos/800/400?random=1', caption: 'Фото 1' },
      { url: 'https://picsum.photos/800/400?random=2', caption: 'Фото 2' },
      { url: 'https://picsum.photos/800/400?random=3', caption: 'Фото 3' }
    ]
  },
  related: {
    toolbar: CarouselSettings
  }
};

// Компонент настроек для панели
function CarouselSettings() {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Высота карусели
        </label>
        <input
          type="text"
          value={props.height}
          onChange={(e) => setProp((props: CarouselBlockProps) => props.height = e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="400px"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.autoplay}
            onChange={(e) => setProp((props: CarouselBlockProps) => props.autoplay = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Автопрокрутка</span>
        </label>
      </div>

      {props.autoplay && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Интервал (мс)
          </label>
          <input
            type="number"
            value={props.interval}
            onChange={(e) => setProp((props: CarouselBlockProps) => props.interval = parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
            min="1000"
            step="500"
          />
        </div>
      )}

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.showArrows}
            onChange={(e) => setProp((props: CarouselBlockProps) => props.showArrows = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Показать стрелки</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.showIndicators}
            onChange={(e) => setProp((props: CarouselBlockProps) => props.showIndicators = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Показать индикаторы</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Скругление углов (px)
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={props.borderRadius}
          onChange={(e) => setProp((props: CarouselBlockProps) => props.borderRadius = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.borderRadius}px</span>
      </div>
    </div>
  );
}
```

---

### 2. VideoBlock - Встраивание видео

**Файл:** `components/page-builder/blocks/VideoBlock.tsx`

```typescript
'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface VideoBlockProps {
  url?: string;
  autoplay?: boolean;
  controls?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  borderRadius?: number;
}

export const VideoBlock = ({
  url = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  autoplay = false,
  controls = true,
  aspectRatio = '16:9',
  borderRadius = 12
}: VideoBlockProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-video';
    }
  };

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`;
    }
    
    return url;
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className="my-4"
    >
      <div 
        className={`${getAspectRatioClass()} w-full overflow-hidden`}
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <iframe
          src={getEmbedUrl(url)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

VideoBlock.craft = {
  displayName: 'Видео',
  props: {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    autoplay: false,
    controls: true,
    aspectRatio: '16:9',
    borderRadius: 12
  },
  related: {
    toolbar: VideoSettings
  }
};

function VideoSettings() {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          URL видео
        </label>
        <input
          type="url"
          value={props.url}
          onChange={(e) => setProp((props: VideoBlockProps) => props.url = e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="https://youtube.com/..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Поддерживается YouTube и Vimeo
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Соотношение сторон
        </label>
        <select
          value={props.aspectRatio}
          onChange={(e) => setProp((props: VideoBlockProps) => props.aspectRatio = e.target.value as any)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="16:9">16:9 (Широкоэкранное)</option>
          <option value="4:3">4:3 (Стандартное)</option>
          <option value="1:1">1:1 (Квадрат)</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.autoplay}
            onChange={(e) => setProp((props: VideoBlockProps) => props.autoplay = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Автовоспроизведение</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.controls}
            onChange={(e) => setProp((props: VideoBlockProps) => props.controls = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Показать элементы управления</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Скругление углов (px)
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={props.borderRadius}
          onChange={(e) => setProp((props: VideoBlockProps) => props.borderRadius = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.borderRadius}px</span>
      </div>
    </div>
  );
}
```

---

### 3. StatsBlock - Блок статистики

**Файл:** `components/page-builder/blocks/StatsBlock.tsx`

```typescript
'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

interface Stat {
  icon: string;
  value: string;
  label: string;
  color: string;
}

export interface StatsBlockProps {
  stats?: Stat[];
  columns?: 2 | 3 | 4;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

export const StatsBlock = ({
  stats = [
    { icon: '👥', value: '1,234', label: 'Участников', color: '#10b981' },
    { icon: '📅', value: '156', label: 'Мероприятий', color: '#3b82f6' },
    { icon: '⭐', value: '5', label: 'Лет работы', color: '#f59e0b' },
    { icon: '🏆', value: '42', label: 'Достижений', color: '#8b5cf6' }
  ],
  columns = 4,
  backgroundColor = '#f9fafb',
  borderRadius = 12,
  padding = 32
}: StatsBlockProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className="my-4"
      style={{
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`
      }}
    >
      <div className={`grid ${getGridCols()} gap-6`}>
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div 
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StatsBlock.craft = {
  displayName: 'Статистика',
  props: {
    stats: [
      { icon: '👥', value: '1,234', label: 'Участников', color: '#10b981' },
      { icon: '📅', value: '156', label: 'Мероприятий', color: '#3b82f6' },
      { icon: '⭐', value: '5', label: 'Лет работы', color: '#f59e0b' },
      { icon: '🏆', value: '42', label: 'Достижений', color: '#8b5cf6' }
    ],
    columns: 4,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 32
  },
  related: {
    toolbar: StatsSettings
  }
};

function StatsSettings() {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Количество колонок
        </label>
        <select
          value={props.columns}
          onChange={(e) => setProp((props: StatsBlockProps) => props.columns = parseInt(e.target.value) as any)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="2">2 колонки</option>
          <option value="3">3 колонки</option>
          <option value="4">4 колонки</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Цвет фона
        </label>
        <input
          type="color"
          value={props.backgroundColor}
          onChange={(e) => setProp((props: StatsBlockProps) => props.backgroundColor = e.target.value)}
          className="w-full h-10 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Отступы (px)
        </label>
        <input
          type="range"
          min="0"
          max="80"
          value={props.padding}
          onChange={(e) => setProp((props: StatsBlockProps) => props.padding = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.padding}px</span>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium mb-3">
          Редактировать статистику
        </label>
        {props.stats.map((stat: Stat, index: number) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <input
                type="text"
                value={stat.icon}
                onChange={(e) => {
                  const newStats = [...props.stats];
                  newStats[index].icon = e.target.value;
                  setProp((props: StatsBlockProps) => props.stats = newStats);
                }}
                className="px-2 py-1 border rounded"
                placeholder="Иконка"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...props.stats];
                  newStats[index].value = e.target.value;
                  setProp((props: StatsBlockProps) => props.stats = newStats);
                }}
                className="px-2 py-1 border rounded"
                placeholder="Значение"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...props.stats];
                  newStats[index].label = e.target.value;
                  setProp((props: StatsBlockProps) => props.stats = newStats);
                }}
                className="px-2 py-1 border rounded col-span-2"
                placeholder="Подпись"
              />
              <input
                type="color"
                value={stat.color}
                onChange={(e) => {
                  const newStats = [...props.stats];
                  newStats[index].color = e.target.value;
                  setProp((props: StatsBlockProps) => props.stats = newStats);
                }}
                className="h-8 rounded col-span-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. TeamBlock - Блок команды

**Файл:** `components/page-builder/blocks/TeamBlock.tsx`

```typescript
'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio?: string;
}

export interface TeamBlockProps {
  members?: TeamMember[];
  columns?: 2 | 3 | 4;
  showBio?: boolean;
  borderRadius?: number;
}

export const TeamBlock = ({
  members = [
    {
      name: 'Анна Иванова',
      role: 'Основатель',
      photo: 'https://i.pravatar.cc/300?img=1',
      bio: 'Опыт работы 10+ лет'
    },
    {
      name: 'Петр Сидоров',
      role: 'Координатор',
      photo: 'https://i.pravatar.cc/300?img=2',
      bio: 'Организатор мероприятий'
    },
    {
      name: 'Мария Петрова',
      role: 'PR-менеджер',
      photo: 'https://i.pravatar.cc/300?img=3',
      bio: 'Специалист по коммуникациям'
    }
  ],
  columns = 3,
  showBio = true,
  borderRadius = 12
}: TeamBlockProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className="my-4"
    >
      <div className={`grid ${getGridCols()} gap-6`}>
        {members.map((member, index) => (
          <div 
            key={index} 
            className="text-center bg-white dark:bg-neutral-800 p-6 shadow-sm border border-gray-200 dark:border-neutral-700"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <img
              src={member.photo}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {member.name}
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">
              {member.role}
            </p>
            {showBio && member.bio && (
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {member.bio}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TeamBlock.craft = {
  displayName: 'Команда',
  props: {
    members: [
      {
        name: 'Анна Иванова',
        role: 'Основатель',
        photo: 'https://i.pravatar.cc/300?img=1',
        bio: 'Опыт работы 10+ лет'
      },
      {
        name: 'Петр Сидоров',
        role: 'Координатор',
        photo: 'https://i.pravatar.cc/300?img=2',
        bio: 'Организатор мероприятий'
      },
      {
        name: 'Мария Петрова',
        role: 'PR-менеджер',
        photo: 'https://i.pravatar.cc/300?img=3',
        bio: 'Специалист по коммуникациям'
      }
    ],
    columns: 3,
    showBio: true,
    borderRadius: 12
  },
  related: {
    toolbar: TeamSettings
  }
};

function TeamSettings() {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Количество колонок
        </label>
        <select
          value={props.columns}
          onChange={(e) => setProp((props: TeamBlockProps) => props.columns = parseInt(e.target.value) as any)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="2">2 колонки</option>
          <option value="3">3 колонки</option>
          <option value="4">4 колонки</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.showBio}
            onChange={(e) => setProp((props: TeamBlockProps) => props.showBio = e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Показать биографию</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Скругление углов (px)
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={props.borderRadius}
          onChange={(e) => setProp((props: TeamBlockProps) => props.borderRadius = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.borderRadius}px</span>
      </div>
    </div>
  );
}
```

---

### 5. DividerBlock - Разделитель

**Файл:** `components/page-builder/blocks/DividerBlock.tsx`

```typescript
'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface DividerBlockProps {
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
  color?: string;
  thickness?: number;
  marginTop?: number;
  marginBottom?: number;
  width?: string;
}

export const DividerBlock = ({
  style = 'solid',
  color = '#e5e7eb',
  thickness = 1,
  marginTop = 24,
  marginBottom = 24,
  width = '100%'
}: DividerBlockProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`
      }}
      className="flex justify-center"
    >
      <hr
        style={{
          borderStyle: style,
          borderColor: color,
          borderWidth: `${thickness}px 0 0 0`,
          width,
          margin: 0
        }}
      />
    </div>
  );
};

DividerBlock.craft = {
  displayName: 'Разделитель',
  props: {
    style: 'solid',
    color: '#e5e7eb',
    thickness: 1,
    marginTop: 24,
    marginBottom: 24,
    width: '100%'
  },
  related: {
    toolbar: DividerSettings
  }
};

function DividerSettings() {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Стиль линии
        </label>
        <select
          value={props.style}
          onChange={(e) => setProp((props: DividerBlockProps) => props.style = e.target.value as any)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="solid">Сплошная</option>
          <option value="dashed">Пунктирная</option>
          <option value="dotted">Точечная</option>
          <option value="double">Двойная</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Цвет
        </label>
        <input
          type="color"
          value={props.color}
          onChange={(e) => setProp((props: DividerBlockProps) => props.color = e.target.value)}
          className="w-full h-10 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Толщина (px)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={props.thickness}
          onChange={(e) => setProp((props: DividerBlockProps) => props.thickness = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.thickness}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Ширина
        </label>
        <select
          value={props.width}
          onChange={(e) => setProp((props: DividerBlockProps) => props.width = e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="100%">100%</option>
          <option value="75%">75%</option>
          <option value="50%">50%</option>
          <option value="25%">25%</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Отступ сверху (px)
        </label>
        <input
          type="range"
          min="0"
          max="80"
          value={props.marginTop}
          onChange={(e) => setProp((props: DividerBlockProps) => props.marginTop = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.marginTop}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Отступ снизу (px)
        </label>
        <input
          type="range"
          min="0"
          max="80"
          value={props.marginBottom}
          onChange={(e) => setProp((props: DividerBlockProps) => props.marginBottom = parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.marginBottom}px</span>
      </div>
    </div>
  );
}
```

---

## 🔧 Обновление Toolbox

**Файл:** `components/page-builder/Toolbox.tsx` (обновленный)

```typescript
'use client';

import { useEditor, Element } from '@craftjs/core';
import React from 'react';
import { Container } from './Container';
import { Text } from './Text';
import { Button } from './Button';
import { ImageBlock } from './Image';
import { Heading } from './Heading';
import { Card } from './Card';
import { CarouselBlock } from './blocks/CarouselBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { TeamBlock } from './blocks/TeamBlock';
import { DividerBlock } from './blocks/DividerBlock';

export const Toolbox = () => {
  const { connectors } = useEditor();

  const blocks = [
    {
      name: 'Контейнер',
      icon: '📦',
      element: <Element is={Container} canvas />
    },
    {
      name: 'Заголовок',
      icon: '📝',
      element: <Heading text="Заголовок" />
    },
    {
      name: 'Текст',
      icon: '📄',
      element: <Text text="Введите ваш текст здесь" />
    },
    {
      name: 'Кнопка',
      icon: '🔘',
      element: <Button text="Нажмите" />
    },
    {
      name: 'Изображение',
      icon: '🖼️',
      element: <ImageBlock />
    },
    {
      name: 'Карточка',
      icon: '🃏',
      element: (
        <Element is={Card} canvas>
          <Text text="Содержимое карточки" />
        </Element>
      )
    },
    {
      name: 'Карусель',
      icon: '🎠',
      element: <CarouselBlock />,
      category: 'Медиа'
    },
    {
      name: 'Видео',
      icon: '🎬',
      element: <VideoBlock />,
      category: 'Медиа'
    },
    {
      name: 'Статистика',
      icon: '📊',
      element: <StatsBlock />,
      category: 'Контент'
    },
    {
      name: 'Команда',
      icon: '👥',
      element: <TeamBlock />,
      category: 'Контент'
    },
    {
      name: 'Разделитель',
      icon: '➖',
      element: <DividerBlock />,
      category: 'Оформление'
    }
  ];

  const categories = ['Все', 'Медиа', 'Контент', 'Оформление'];
  const [activeCategory, setActiveCategory] = React.useState('Все');

  const filteredBlocks = activeCategory === 'Все' 
    ? blocks 
    : blocks.filter(b => b.category === activeCategory || !b.category);

  return (
    <div className="bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Блоки
      </h3>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredBlocks.map((block, index) => (
          <button
            key={index}
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                connectors.create(ref, block.element);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-move"
          >
            <span className="text-xl">{block.icon}</span>
            <span>{block.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase mb-3">
          Инструкция
        </h4>
        <p className="text-xs text-gray-600 dark:text-neutral-400">
          Перетащите блоки на страницу для создания контента. Кликните на блок для редактирования.
        </p>
      </div>
    </div>
  );
};
```

---

**Дата создания:** 2025-11-20  
**Версия:** 1.0