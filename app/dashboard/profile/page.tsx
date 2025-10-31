export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Мой профиль</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl p-8 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center gap-6 mb-8">
          <div className="size-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">ИП</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Иван Петров</h2>
            <p className="text-gray-600 dark:text-neutral-400">ivan.petrov@example.com</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Имя
              </label>
              <input
                type="text"
                defaultValue="Иван"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Фамилия
              </label>
              <input
                type="text"
                defaultValue="Петров"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="ivan.petrov@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              defaultValue="+7 (999) 123-45-67"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              О себе
            </label>
            <textarea
              rows={4}
              defaultValue="Люблю посещать культурные мероприятия и выставки."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Сохранить изменения
            </button>
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
