import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/supabase/admin';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Проверяем, является ли пользователь администратором
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/dashboard');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AdminDashboardLayout
      user={user ? {
        email: user.email!,
        avatar_url: user.user_metadata?.avatar_url,
        full_name: user.user_metadata?.full_name
      } : undefined}
    >
      {children}
    </AdminDashboardLayout>
  );
}