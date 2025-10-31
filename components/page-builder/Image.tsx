'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
  margin?: number;
}

export const ImageBlock = ({
  src = 'https://picsum.photos/800/400',
  alt = 'Изображение',
  width = '100%',
  height = '400px',
  objectFit = 'cover',
  borderRadius = 8,
  margin = 10
}: ImageProps) => {
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
      style={{ margin: `${margin}px 0` }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height,
          objectFit,
          borderRadius: `${borderRadius}px`,
          display: 'block'
        }}
      />
    </div>
  );
};

ImageBlock.craft = {
  displayName: 'Изображение',
  props: {
    src: 'https://picsum.photos/800/400',
    alt: 'Изображение',
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: 8,
    margin: 10
  }
};
