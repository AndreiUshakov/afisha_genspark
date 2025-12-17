'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { softDeleteCommunity } from '../actions';

interface DeleteCommunityFormProps {
  communitySlug: string;
  communityName: string;
  hasEvents: boolean;
  hasFutureEvents: boolean;
}

export default function DeleteCommunityForm({
  communitySlug,
  communityName,
  hasEvents,
  hasFutureEvents,
}: DeleteCommunityFormProps) {
  const router = useRouter();
  const [confirmationName, setConfirmationName] = useState('');
  const [deleteOption, setDeleteOption] = useState<'all' | 'future'>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasteDisabled, setIsPasteDisabled] = useState(true);

  const isConfirmationValid = confirmationName.trim() === communityName.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfirmationValid) {
      setError('Имя сообщества введено неверно');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await softDeleteCommunity(
        communitySlug,
        communityName,
        confirmationName,
        deleteOption
      );

      if (result.success) {
        // Перенаправляем на страницу дашборда с сообщением об успехе
        router.push('/dashboard');
      } else {
        setError(result.error || 'Не удалось удалить сообщество');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Error deleting community:', err);
      setError('Произошла непредвиденная ошибка');
      setIsDeleting(false);
    }
  };

  // Предотвращаем вставку текста
  const handlePaste = (e: React.ClipboardEvent) => {
    if (isPasteDisabled) {
      e.preventDefault();
      setError('Вставка текста отключена. Пожалуйста, введите имя сообщества вручную.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-red-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-red-900/50">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Подтверждение удаления
      </h2>

      {/* Опции удаления событий */}
      {hasEvents && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            Что делать с событиями?
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
              <input
                type="radio"
                name="deleteOption"
                value="all"
                checked={deleteOption === 'all'}
                onChange={(e) => setDeleteOption(e.target.value as 'all')}
                className="mt-1 size-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Удалить все события
                </div>
                <div className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                  Мягкое удаление всех событий сообщества (прошедших и будущих)
                </div>
              </div>
            </label>

            {hasFutureEvents && (
              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                <input
                  type="radio"
                  name="deleteOption"
                  value="future"
                  checked={deleteOption === 'future'}
                  onChange={(e) => setDeleteOption(e.target.value as 'future')}
                  className="mt-1 size-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Удалить только будущие события
                  </div>
                  <div className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                    Прошедшие события останутся в базе как архив
                  </div>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Поле подтверждения */}
      <div className="mb-6">
        <label htmlFor="confirmationName" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Для подтверждения введите имя сообщества: <strong>{communityName}</strong>
        </label>
        <input
          type="text"
          id="confirmationName"
          value={confirmationName}
          onChange={(e) => {
            setConfirmationName(e.target.value);
            setError(null);
          }}
          onPaste={handlePaste}
          placeholder="Введите имя сообщества"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          disabled={isDeleting}
          autoComplete="off"
        />
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          ⚠️ Вставка текста отключена для предотвращения случайного удаления
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-900/50">
          <div className="flex items-start gap-3">
            <svg className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isDeleting}
          className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!isConfirmationValid || isDeleting}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Удаление...
            </>
          ) : (
            <>
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Удалить сообщество
            </>
          )}
        </button>
      </div>

      {/* Дополнительное предупреждение */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          <strong>Примечание:</strong> Удаленное сообщество будет скрыто от всех пользователей, но данные останутся в базе. 
          Администраторы сайта смогут восстановить сообщество или удалить его навсегда.
        </p>
      </div>
    </form>
  );
}