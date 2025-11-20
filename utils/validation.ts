import { Step1FormData } from '@/types/community';

/**
 * Валидация данных Шага 1
 */
export function validateStep1(data: Step1FormData): {
  isValid: boolean;
  errors: Partial<Record<keyof Step1FormData, string>>;
} {
  const errors: Partial<Record<keyof Step1FormData, string>> = {};

  // Название
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Название должно содержать минимум 3 символа';
  }

  // Slug
  if (!data.slug) {
    errors.slug = 'URL-адрес обязателен';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = 'URL может содержать только латинские буквы, цифры и дефисы';
  }

  // Категория
  if (!data.category) {
    errors.category = 'Выберите категорию';
  }

  // Описание
  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Описание должно содержать минимум 20 символов';
  } else if (data.description.length > 200) {
    errors.description = 'Описание не должно превышать 200 символов';
  }

  // Email
  if (!data.contact_email) {
    errors.contact_email = 'Email обязателен';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.contact_email = 'Некорректный формат email';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}