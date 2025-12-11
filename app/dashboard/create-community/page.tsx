import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreateCommunityForm from '@/app/dashboard/create-community/components/CreateCommunityForm';
import { getCategories } from './actions';

export default async function CreateCommunityPage() {
  // Получаем пользователя на сервере
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }

  const isEmailVerified = user.email_confirmed_at !== null;
  const userEmail = user.email || '';

  // Получаем категории из базы данных
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <CreateCommunityForm
      isEmailVerified={isEmailVerified}
      userEmail={userEmail}
      categories={categories}
    />
  );
}
