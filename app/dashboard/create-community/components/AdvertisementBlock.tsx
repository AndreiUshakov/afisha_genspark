'use client';

import React from 'react';

type AdType = 'landing' | 'radio';

interface AdvertisementBlockProps {
  type: AdType;
  className?: string;
}

export const AdvertisementBlock: React.FC<AdvertisementBlockProps> = ({
  type,
  className = ''
}) => {
  if (type === 'landing') {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white ${className}`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Хочешь красивый лендинг для своего проекта?
            </h3>
            <p className="text-sm opacity-90">
              Обращайся к нам! Создадим уникальный дизайн.
            </p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
            Узнать подробнее →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl flex-shrink-0">📻</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            Продвижение сообщества на Иркутском радио!
          </h3>
          <p className="text-sm opacity-90">
            Расскажи о своих событиях тысячам слушателей.
          </p>
        </div>
        <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
          Заказать эфир →
        </button>
      </div>
    </div>
  );
};