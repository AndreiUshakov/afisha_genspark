import Header from './Header';

interface ConditionalHeaderProps {
  pathname: string;
}

export default function ConditionalHeader({ pathname }: ConditionalHeaderProps) {
  // Не показываем header на страницах dashboard и admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Header />;
}