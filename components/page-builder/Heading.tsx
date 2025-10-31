'use client';

import { useNode } from '@craftjs/core';
import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';

export interface HeadingProps {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  margin?: number;
}

export const Heading = ({
  text = 'Заголовок',
  level = 2,
  color = '#000000',
  textAlign = 'left',
  margin = 10
}: HeadingProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp }
  } = useNode();

  const [editable, setEditable] = useState(false);

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const fontSizes = {
    1: '2.5rem',
    2: '2rem',
    3: '1.75rem',
    4: '1.5rem',
    5: '1.25rem',
    6: '1rem'
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      onClick={() => setEditable(true)}
      style={{ margin: `${margin}px 0` }}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) => {
          setProp((props: HeadingProps) => (props.text = e.target.value), 500);
        }}
        tagName={Tag}
        style={{
          fontSize: fontSizes[level],
          fontWeight: 'bold',
          color,
          textAlign,
          outline: 'none',
          cursor: editable ? 'text' : 'pointer'
        }}
      />
    </div>
  );
};

Heading.craft = {
  displayName: 'Заголовок',
  props: {
    text: 'Заголовок',
    level: 2,
    color: '#000000',
    textAlign: 'left',
    margin: 10
  }
};
