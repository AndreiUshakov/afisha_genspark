'use client';

import React, { useState } from 'react';
import { Step1FormData } from '@/types/community';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { validateStep1 } from '@/utils/validation';

export default function CreateCommunityPage() {
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

  const handleCreateCommunity = () => {
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

    // В реальном приложении здесь будет API запрос
    console.log('Creating community:', formData);
    alert('Сообщество создано! Теперь вы можете настроить его внешний вид на странице "Настройка сообщества".');
    // Redirect to community management page
    // router.push('/dashboard/community');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
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
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Создать сообщество
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
