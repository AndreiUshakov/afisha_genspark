'use client';

import { useState } from 'react';
import { submitCommunityForModeration } from '@/app/dashboard/create-community/actions';
import { useRouter } from 'next/navigation';

interface SubmitToModerationButtonProps {
  communityId: string;
}

export default function SubmitToModerationButton({ communityId }: SubmitToModerationButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!confirm('Отправить сообщество на модерацию? После этого вы не сможете редактировать сообщество до завершения модерации.')) {
      return;
    }

    setLoading(true);
    try {
      const result = await submitCommunityForModeration(communityId);
      
      if (result.success) {
        alert('Сообщество успешно отправлено на модерацию!');
        router.refresh();
      } else {
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке на модерацию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Отправка...
        </span>
      ) : (
        'Отправить на модерацию'
      )}
    </button>
  );
}