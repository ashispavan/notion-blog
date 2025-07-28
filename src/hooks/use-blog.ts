'use client';

import { useQuery } from '@tanstack/react-query';
import { BlogPost, BlogListResponse } from '@/types/blog';

// Query keys
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  post: (slug: string) => [...blogKeys.all, 'post', slug] as const,
} as const;

// Hook to fetch all blog posts
export function useBlogPosts() {
  return useQuery({
    queryKey: blogKeys.posts(),
    queryFn: async (): Promise<BlogListResponse> => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
  });
}

// Hook to fetch a single blog post by slug
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: async (): Promise<BlogPost> => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found');
        }
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
    enabled: !!slug,
  });
}
