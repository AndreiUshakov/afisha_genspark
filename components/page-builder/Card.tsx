'use client';

import { useNode, Element } from '@craftjs/core';
import React from 'react';
import { Text } from './Text';

export interface CardProps {
  background?: string;
  padding?: number;
  borderRadius?: number;
  shadow?: boolean;
  children?: React.ReactNode;
}

export const Card = ({
  background = '#ffffff',
  padding = 20,
  borderRadius = 12,
  shadow = true,
  children
}: CardProps) => {
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
        background,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        boxShadow: shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        minHeight: '100px',
        margin: '10px 0'
      }}
      className="border border-gray-200 dark:border-neutral-700"
    >
      {children}
    </div>
  );
};

Card.craft = {
  displayName: 'Карточка',
  props: {
    background: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadow: true
  },
  related: {
    toolbar: () => (
      <div className="p-4">
        <label className="block text-sm font-medium mb-2">
          Настройки карточки
        </label>
      </div>
    )
  }
};
