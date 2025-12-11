'use client';

import React, { useState, useEffect } from 'react';
import { Step1FormData } from '@/types/community';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { validateStep1 } from '@/utils/validation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { createCommunity } from './actions';
import { FILTER_OPTIONS } from '@/types/community';

export default function CreateCommunityPage() {
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Step1FormData>({
    name: '',
    slug: '',
    category: '',
    description: '',
    full_description: '',
    target_audience: [],
    wishes: [],
    age_categories: [],
    location: '',
    contact_email: '',
    contact_phone: '',
    social_links: {
      vk: '',
      telegram: '',
      website: '',
      facebook: ''
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step1FormData, string>>>({});

  useEffect(() => {
    async function checkEmailVerification() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUserEmail(user.email || '');
      setIsEmailVerified(user.email_confirmed_at !== null);
    }

    checkEmailVerification();
  }, [router]);

  const handleFormChange = (data: Partial<Step1FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear errors for changed fields
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(data).forEach(key => {
        delete newErrors[key as keyof Step1FormData];
      });
      setErrors(newErrors);
    }
  };

  const handleCreateCommunity = async () => {
    // Проверка подтверждения email
    if (!isEmailVerified) {
      alert('Для создания сообщества необходимо подтвердить ваш email. Проверьте вашу почту и перейдите по ссылке подтверждения.');
      return;
    }

    // Validate form
    const { isValid, errors: validationErrors } = validateStep1(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorElement = document.querySelector('[class*="border-red"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsCreating(true);

    try {
      // Находим ID категории по slug
      const category = FILTER_OPTIONS.CATEGORIES.find(cat => cat.id === formData.category);
      
      const result = await createCommunity({
        name: formData.name,
        slug: formData.slug,
        category_id: formData.category,
        description: formData.description,
        location: formData.location,
        social_links: formData.social_links,
        target_audience: formData.target_audience,
        wishes: formData.wishes,
        age_category: formData.age_categories.length > 0 ? formData.age_categories[0] : undefined,
      });

      if (result.success) {
        alert('✅ Сообщество успешно создано! Теперь вы можете управлять им в разделе "Мое сообщество".');
        router.push('/dashboard/community');
      } else {
        alert('❌ Ошибка: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating community:', error);
      alert('❌ Произошла ошибка при создании сообщества. Попробуйте еще раз.');
    } finally {
      setIsCreating(false);
    }
  };

  // Показываем загрузку пока проверяем статус
  if (isEmailVerified === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-neutral-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Email Verification Warning */}
      {!isEmailVerified && (
        <div className="bg-yellow-50 border-b-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
          <div className="max-w-4xl mx-auto flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Требуется подтверждение email
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Для создания сообщества необходимо подтвердить ваш email <strong>{userEmail}</strong>.
                  Проверьте вашу почту и перейдите по ссылке подтверждения.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Создание сообщества
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
              Заполните основную информацию о вашем сообществе
            </p>
          </div>
          <a
            href="/dashboard/community"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Отменить
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Step1BasicInfo
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
          />

          {/* Create Button */}
          <div className="mt-8 flex justify-between items-center bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              * Обязательные поля
            </div>
            <button
              onClick={handleCreateCommunity}
              disabled={!isEmailVerified || isCreating}
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg ${
                isEmailVerified && !isCreating
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-neutral-500 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </span>
              ) : isEmailVerified ? (
                'Создать сообщество'
              ) : (
                '🔒 Подтвердите email для создания'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
