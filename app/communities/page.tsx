import { getCommunities, getMembersCount, getEventsCount } from '@/lib/supabase/communities';
import { createClient } from '@/lib/supabase/server';
import CommunityCard from '@/components/communities/CommunityCard';

export default async function CommunitiesPage() {
  const communities = await getCommunities();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Получаем информацию о членстве для каждого сообщества
  const communitiesWithMembership = await Promise.all(
    communities.map(async (community) => {
      const membersCount = await getMembersCount(community.id);
      const eventsCount = getEventsCount(community.id);
      
      let isMember = false;
      let isOwner = false;

      if (user) {
        isOwner = community.owner_id === user.id;
        
        if (isOwner) {
          isMember = true;
        } else {
          const { data: membership } = await supabase
            .from('community_members')
            .select('id')
            .eq('community_id', community.id)
            .eq('user_id', user.id)
            .single();
          
          isMember = !!membership;
        }
      }

      return {
        community,
        membersCount,
        eventsCount,
        isMember,
        isOwner,
        isAuthenticated: !!user
      };
    })
  );

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h1 className="text-3xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Сообщества Иркутска
        </h1>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Найдите единомышленников и присоединяйтесь к активным сообществам города
        </p>
      </div>

      {/* Поиск */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
            <svg className="shrink-0 size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            className="py-3 ps-11 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Поиск сообществ..."
          />
        </div>
      </div>

      {/* Список сообществ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communitiesWithMembership.map(({ community, membersCount, eventsCount, isMember, isOwner, isAuthenticated }) => (
          <CommunityCard
            key={community.id}
            community={community}
            membersCount={membersCount}
            eventsCount={eventsCount}
            isMember={isMember}
            isOwner={isOwner}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
}
