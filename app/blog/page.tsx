export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: '10 лучших мест для семейного отдыха в Иркутске',
      excerpt: 'Куда сходить с детьми в выходные? Подборка лучших мест для семейного досуга.',
      author: 'Редакция',
      date: '25 октября 2025',
      category: 'Семейный досуг',
      readTime: '5 мин',
    },
    {
      id: 2,
      title: 'Культурная афиша ноября: что посмотреть в театрах',
      excerpt: 'Обзор самых интересных театральных постановок ноября.',
      author: 'Анна Петрова',
      date: '22 октября 2025',
      category: 'Культура',
      readTime: '7 мин',
    },
    {
      id: 3,
      title: 'Как выбрать мастер-класс для ребёнка',
      excerpt: 'Советы родителям: на что обратить внимание при выборе развивающих занятий.',
      author: 'Мария Козлова',
      date: '20 октября 2025',
      category: 'Образование',
      readTime: '4 мин',
    },
    {
      id: 4,
      title: 'Беговой сезон 2025: марафоны и забеги Иркутска',
      excerpt: 'Календарь спортивных мероприятий для любителей бега.',
      author: 'Иван Смирнов',
      date: '18 октября 2025',
      category: 'Спорт',
      readTime: '6 мин',
    },
    {
      id: 5,
      title: 'Астрономия для начинающих: как наблюдать звёзды',
      excerpt: 'Простые советы для тех, кто хочет начать изучать звёздное небо.',
      author: 'Дмитрий Соколов',
      date: '15 октября 2025',
      category: 'Наука',
      readTime: '8 мин',
    },
    {
      id: 6,
      title: 'Фотография в городе: как снимать архитектуру',
      excerpt: 'Советы профессионального фотографа для городских фотопрогулок.',
      author: 'Александр Новиков',
      date: '12 октября 2025',
      category: 'Искусство',
      readTime: '5 мин',
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Блог
        </h1>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Полезные статьи о мероприятиях, культуре и досуге в Иркутске
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700"
          >
            <div className="h-52 flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl">
              <svg className="size-20 text-white/80" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-neutral-500">
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white mb-2">
                {post.title}
              </h2>

              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                {post.excerpt}
              </p>

              <div className="mt-auto flex items-center gap-x-2 text-sm text-gray-500 dark:text-neutral-500">
                <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{post.author}</span>
                <span>•</span>
                <time>{post.date}</time>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Пагинация */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-x-1" aria-label="Pagination">
          <button type="button" className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Назад</span>
          </button>
          <div className="flex items-center gap-x-1">
            <button type="button" className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-blue-600 text-white py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-blue-700" aria-current="page">1</button>
            <button type="button" className="min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">2</button>
            <button type="button" className="min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">3</button>
          </div>
          <button type="button" className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
            <span>Далее</span>
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
