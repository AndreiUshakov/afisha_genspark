'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedPosts } from '@/data/mockPosts';

export default function FeaturedPosts() {
  const featuredPosts = getFeaturedPosts(6);

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
          Продвигаемые посты
        </h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">
          Интересные материалы от сообществ и экспертов
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700"
          >
            <div className="relative h-52 w-full overflow-hidden rounded-t-xl">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                {post.author_avatar && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.author_avatar}
                      alt={post.author_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm text-gray-600 dark:text-neutral-400 truncate">
                  {post.author_name}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white line-clamp-2 mb-2">
                {post.title}
              </h3>
              
             {/*  <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2 flex-1">
                {post.excerpt}
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}