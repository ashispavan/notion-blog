'use client';

import { useBlogPosts } from '@/hooks/use-blog';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">
            {error.message || 'Failed to load blog posts'}
          </p>
          <p className="text-sm text-gray-500">
            Make sure your Notion integration is properly configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Notion Blog</h1>
          <p className="text-gray-600 mt-2">
            Thoughts, ideas, and stories from my Notion workspace
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {data?.posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No blog posts found
            </h2>
            <p className="text-gray-600">
              Make sure you have published posts in your Notion database.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {data?.posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
