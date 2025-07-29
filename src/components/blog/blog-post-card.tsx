'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import { useRouter } from 'next/navigation';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    // Prefetch the blog post page on hover
    router.prefetch(`/blog/${post.slug}`);
  };

  return (
    <article 
      className="flex gap-6 py-8 border-b border-gray-100 last:border-b-0"
      onMouseEnter={handleMouseEnter}
    >
      {/* Content - Left side */}
      <div className="flex-1">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.publishedDate}>
            {format(new Date(post.publishedDate), 'MMM dd')}
          </time>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-tight hover:text-gray-600 transition-colors">
          <Link href={`/blog/${post.slug}`} prefetch={true}>
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail - Right side */}
      {post.coverImage && (
        <div className="w-20 h-20 flex-shrink-0">
          <div className="w-full h-full overflow-hidden rounded relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          </div>
        </div>
      )}
    </article>
  );
}
