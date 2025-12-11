import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/lib/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // TODO: Получать реальную роль пользователя из базы данных
  const userRole = 'user'; // 'user' | 'community' | 'expert'

  return (
    <div className="dashboard-wrapper">
      <DashboardLayout
        userRole={userRole}
        user={user ? {
          email: user.email!,
          avatar_url: user.user_metadata?.avatar_url,
          full_name: user.user_metadata?.full_name
        } : undefined}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}
