import { headers } from 'next/headers';
import Header from './Header';

export default async function ConditionalHeader() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Не показываем header на страницах dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return <Header />;
}