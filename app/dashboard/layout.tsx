import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/lib/supabase/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Получаем список сообществ пользователя
  const { data: communities } = user
    ? await supabase
        .from('communities')
        .select('id, name, slug, avatar_url, is_published')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
    : { data: null };

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
        communities={communities || []}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}
