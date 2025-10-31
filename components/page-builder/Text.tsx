'use client';

import { useNode } from '@craftjs/core';
import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';

export interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  margin?: number;
}

export const Text = ({
  text = 'Текст',
  fontSize = 16,
  fontWeight = 400,
  color = '#000000',
  textAlign = 'left',
  margin = 10
}: TextProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp }
  } = useNode();

  const [editable, setEditable] = useState(false);

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
          setProp((props: TextProps) => (props.text = e.target.value), 500);
        }}
        tagName="div"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          textAlign,
          outline: 'none',
          cursor: editable ? 'text' : 'pointer'
        }}
      />
    </div>
  );
};

Text.craft = {
  displayName: 'Текст',
  props: {
    text: 'Текст',
    fontSize: 16,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left',
    margin: 10
  },
  related: {
    toolbar: () => (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Размер шрифта
          </label>
        </div>
      </div>
    )
  }
};
