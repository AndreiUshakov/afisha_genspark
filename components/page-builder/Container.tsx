'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface ContainerProps {
  background?: string;
  padding?: number;
  children?: React.ReactNode;
}

export const Container = ({ background = '#ffffff', padding = 20, children }: ContainerProps) => {
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
        minHeight: '100px'
      }}
      className="w-full"
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Контейнер',
  props: {
    background: '#ffffff',
    padding: 20
  },
  related: {
    toolbar: () => (
      <div className="p-4">
        <label className="block text-sm font-medium mb-2">
          Фон контейнера
        </label>
      </div>
    )
  }
};
