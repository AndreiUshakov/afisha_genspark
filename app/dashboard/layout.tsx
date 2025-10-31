import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  // TODO: Получать реальную роль пользователя из сессии/контекста
  const userRole = 'user'; // 'user' | 'community' | 'expert'

  return (
    <div className="dashboard-wrapper">
      <DashboardLayout userRole={userRole}>{children}</DashboardLayout>
    </div>
  );
}
