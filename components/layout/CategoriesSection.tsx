import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: 'Семейные',
      description: 'Мероприятия для всей семьи',
      icon: '👨‍👩‍👧‍👦',
      count: 42,
      slug: 'family'
    },
    {
      id: 2,
      name: 'Культура',
      description: 'Театр, выставки, искусство',
      icon: '🎭',
      count: 38,
      slug: 'culture'
    },
    {
      id: 3,
      name: 'Образование',
      description: 'Лекции, курсы, мастер-классы',
      icon: '📚',
      count: 25,
      slug: 'education'
    },
    {
      id: 4,
      name: 'Спорт',
      description: 'Активный отдых и здоровье',
      icon: '⚽',
      count: 31,
      slug: 'sport'
    },
    {
      id: 5,
      name: 'Музыка',
      description: 'Концерты и фестивали',
      icon: '🎵',
      count: 19,
      slug: 'music'
    },
    {
      id: 6,
      name: 'Детям',
      description: 'Развлечения для детей',
      icon: '🎨',
      count: 54,
      slug: 'children'
    },
  ];

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Популярные категории
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Выберите интересующую вас категорию
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/events?category=${category.slug}`}
            className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800"
          >
            <div className="p-4 md:p-5">
              <div className="flex justify-between items-center gap-x-3">
                <div className="grow">
                  <div className="flex items-center gap-x-3">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-x-2 py-2 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {category.count}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
