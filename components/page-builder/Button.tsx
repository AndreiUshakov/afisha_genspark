'use client';

import { useNode } from '@craftjs/core';
import React from 'react';

export interface ButtonProps {
  text?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  margin?: number;
}

export const Button = ({
  text = 'Кнопка',
  buttonStyle = 'primary',
  size = 'medium',
  margin = 10
}: ButtonProps) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  const getButtonClasses = () => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200';
    
    const sizeClasses = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg'
    };

    const styleClasses = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg',
      secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    };

    return `${baseClasses} ${sizeClasses[size]} ${styleClasses[buttonStyle]}`;
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{ margin: `${margin}px 0` }}
    >
      <button className={getButtonClasses()}>
        {text}
      </button>
    </div>
  );
};

Button.craft = {
  displayName: 'Кнопка',
  props: {
    text: 'Кнопка',
    buttonStyle: 'primary',
    size: 'medium',
    margin: 10
  }
};
