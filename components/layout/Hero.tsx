import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-neutral-200">
            Календарь событий <span className="text-blue-600">Иркутска</span>
          </h1>

          <p className="mt-3 text-gray-600 dark:text-neutral-400 text-lg">
            Найдите интересные мероприятия для всей семьи
          </p>

          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form>
              <div className="relative z-10 flex gap-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                <div className="w-full">
                  <label htmlFor="hero-input" className="sr-only">Поиск мероприятий</label>
                  <input 
                    type="text" 
                    id="hero-input" 
                    name="hero-input" 
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                    placeholder="Поиск мероприятий, сообществ..."
                  />
                </div>
                <div>
                  <button 
                    type="button"
                    className="size-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg className="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg className="w-40 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
            <Link href="/events?filter=family" className="group p-4 md:p-7 bg-white border border-gray-200 rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700">
              <div className="flex justify-center items-center size-12 bg-blue-600 rounded-lg mx-auto">
                <svg className="shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="mt-5">
                <h3 className="group-hover:text-blue-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">
                  Семейные события
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Все лучшие детские и семейные мероприятия в одном месте
                </p>
              </div>
            </Link>

            <Link href="/events?filter=culture" className="group p-4 md:p-7 bg-white border border-gray-200 rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700">
              <div className="flex justify-center items-center size-12 bg-purple-600 rounded-lg mx-auto">
                <svg className="shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="mt-5">
                <h3 className="group-hover:text-purple-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">
                  Культура и искусство
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Театр, выставки, классика - будьте в центре культурной жизни
                </p>
              </div>
            </Link>

            <Link href="/events?filter=education" className="group p-4 md:p-7 bg-white border border-gray-200 rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700">
              <div className="flex justify-center items-center size-12 bg-green-600 rounded-lg mx-auto">
                <svg className="shrink-0 size-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="mt-5">
                <h3 className="group-hover:text-green-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400">
                  Наука и образование
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Не пропускай научные события и найди единомышленников
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
