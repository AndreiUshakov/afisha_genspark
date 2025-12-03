// Этот файл выполняется один раз при запуске сервера Next.js
// Используется для глобальных полифиллов и инициализации

export async function register() {
  // Полифиллы для браузерных API на сервере (требуется для jodit-react)
  if (typeof self === 'undefined') {
    (global as any).self = global;
  }
  
  if (typeof window === 'undefined') {
    (global as any).window = {
      location: {
        protocol: 'http:',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/',
        search: '',
        hash: '',
        href: 'http://localhost:3000/'
      }
    };
  }
}