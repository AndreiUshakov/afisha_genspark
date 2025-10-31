'use client';

import { useEditor } from '@craftjs/core';
import React from 'react';

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related?.toolbar,
        isDeletable: query.node(currentNodeId).isDeletable()
      };
    }

    return {
      selected
    };
  });

  return (
    <div className="bg-white dark:bg-neutral-800 border-l border-gray-200 dark:border-neutral-700 p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Настройки
      </h3>

      {selected ? (
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h4 className="text-xs font-medium text-gray-500 dark:text-neutral-500 uppercase mb-2">
              Выбранный элемент
            </h4>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {selected.name}
            </p>
          </div>

          {selected.settings && React.createElement(selected.settings)}

          {selected.isDeletable && (
            <button
              onClick={() => {
                actions.delete(selected.id);
              }}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              Удалить элемент
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Выберите элемент для настройки
          </p>
        </div>
      )}
    </div>
  );
};
