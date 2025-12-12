import Link from 'next/link'

// Типы из lib/supabase/communities (избегаем импорта серверного модуля)
type CommunityStatus = 'draft' | 'pending_moderation' | 'published';

const CommunityStatusLabels: Record<CommunityStatus, string> = {
  draft: 'Черновик',
  pending_moderation: 'На модерации',
  published: 'Опубликовано',
};

interface Community {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  avatar_url: string | null;
  cover_url: string | null;
  category_id: string;
  location: string;
  social_links: {
    vk?: string;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  target_audience: string[];
  wishes: string[];
  age_category: string | null;
  page_content: any;
  photo_albums: any[];
  status: CommunityStatus;
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface UserCommunitiesProps {
  communities: Community[]
}

export default function UserCommunities({ communities }: UserCommunitiesProps) {
  if (communities.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Мои сообщества
        </h2>
        <span className="text-sm text-gray-600 dark:text-neutral-400">
          {communities.length} {communities.length === 1 ? 'сообщество' : 'сообществ'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <Link
            key={community.id}
            href={`/dashboard/community/${community.slug}`}
            className="group border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all dark:border-neutral-700 dark:hover:border-blue-500"
          >
            <div className="flex items-start gap-3">
              {/* Аватар сообщества */}
              <div className="flex-shrink-0">
                {community.avatar_url ? (
                  <img
                    src={community.avatar_url}
                    alt={community.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {community.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Информация о сообществе */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {community.name}
                </h3>
                
                {/* Статус публикации */}
                <div className="mt-1">
                  {community.status === 'published' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {CommunityStatusLabels[community.status]}
                    </span>
                  ) : community.status === 'pending_moderation' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {CommunityStatusLabels[community.status]}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      {CommunityStatusLabels[community.status]}
                    </span>
                  )}
                </div>

                {/* Категория */}
                {community.categories && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500 truncate">
                    {community.categories.name}
                  </p>
                )}
              </div>

              {/* Стрелка */}
              <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}