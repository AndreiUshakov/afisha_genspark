import Hero from '@/components/layout/Hero';
import PopularEvents from '@/components/events/PopularEvents';
import WeekendEvents from '@/components/events/WeekendEvents';
import CommunitiesPreview from '@/components/communities/CommunitiesPreview';
import CategoriesSection from '@/components/layout/CategoriesSection';

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Популярные события */}
      <section className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <PopularEvents />
      </section>

      {/* Категории мероприятий */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <CategoriesSection />
        </div>
      </section>

      {/* Как провести выходные */}
      <section className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <WeekendEvents />
      </section>

      {/* Сообщества */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <CommunitiesPreview />
        </div>
      </section>
    </>
  );
}
