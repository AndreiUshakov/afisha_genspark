'use client';

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт для избежания SSR проблем
const JoditEditorComponent = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 dark:border-neutral-600 rounded-lg p-4 bg-white dark:bg-neutral-900">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded mb-4"></div>
        <div className="h-64 bg-gray-100 dark:bg-neutral-800 rounded"></div>
      </div>
    </div>
  )
});

interface JoditEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readonly?: boolean;
}

export const JoditEditor: React.FC<JoditEditorProps> = ({
  content,
  onChange,
  placeholder = 'Начните писать...',
  readonly = false
}) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly,
      placeholder,
      height: 500,
      language: 'ru',
      toolbarButtonSize: 'middle' as const,
      theme: 'default',
      saveModeInCookie: false,
      spellcheck: true,
      editorCssClass: 'jodit-wysiwyg-custom',
      useSplitMode: false,
      colors: {
        greyscale: ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
        palette: ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
        full: [
          '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
          '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
          '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
          '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
          '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
          '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
        ]
      },
      buttons: [
        'source', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'video', 'table', 'link', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'eraser', 'copyformat', '|',
        'symbol', 'fullsize', 'print', 'about'
      ],
      buttonsMD: [
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', '|',
        'font', 'fontsize', '|',
        'image', 'link', '|',
        'align', 'undo', 'redo'
      ],
      buttonsSM: [
        'bold', 'italic', '|',
        'ul', 'ol', '|',
        'fontsize', '|',
        'image', 'link'
      ],
      buttonsXS: [
        'bold', 'italic', '|',
        'ul', 'ol', '|',
        'image'
      ],
      statusbar: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html' as const,
      enter: 'p' as const,
      style: {
        background: 'transparent',
        color: 'inherit'
      },
      controls: {
        font: {
          list: {
            'Arial': 'Arial',
            'Georgia': 'Georgia',
            'Impact': 'Impact',
            'Tahoma': 'Tahoma',
            'Times New Roman': 'Times New Roman',
            'Verdana': 'Verdana',
            'Roboto': 'Roboto',
            'Open Sans': 'Open Sans'
          }
        }
      },
      uploader: {
        insertImageAsBase64URI: true
      },
      removeButtons: ['about'],
      showPlaceholder: true,
      beautifyHTML: true,
      useNativeTooltip: false,
      allowResizeX: false,
      allowResizeY: true,
      minHeight: 300,
      maxHeight: 800
    }),
    [readonly, placeholder]
  );

  return (
    <div className="jodit-editor-wrapper">
      <JoditEditorComponent
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
    </div>
  );
};