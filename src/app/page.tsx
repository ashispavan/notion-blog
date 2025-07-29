'use client';

import Link from 'next/link';
import { useBlogPosts } from '@/hooks/use-blog';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { Footer } from '@/components/footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data, isLoading, error } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      {/* Centered Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header with navigation */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-base font-semibold tracking-wider text-gray-900 hover:text-gray-700">
              OMEGA
            </Link>
            <nav className="flex space-x-6 text-base text-gray-600">
              <a href="#demo" className="hover:text-gray-900 cursor-pointer">Demo</a>
              <Link href="https://github.com/ashispavan/notion-blog" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Get Omega</Link>
            </nav>
          </div>

          {/* Product Hero - Centered */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              <span className="block">TURN YOUR <span className="text-blue-600">NOTION</span></span>
              <span className="block">INTO A BEAUTIFUL <span className="text-gray-600">BLOG</span></span>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Omega is a simple, elegant solution that transforms your Notion database 
              into a fast, SEO-optimized blog built with Next.js. No coding required.
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <Link 
                href="#demo" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                See Live Demo
              </Link>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Lightning Fast</h3>
                <p className="text-gray-600">Built with Next.js for optimal performance and SEO</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📝 Notion Integration</h3>
                <p className="text-gray-600">Write in Notion, publish automatically to your blog</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🎨 Beautiful Design</h3>
                <p className="text-gray-600">Clean, minimalist design that focuses on your content</p>
              </div>
            </div>
          </div>

          {/* Demo Section */}
          <div id="demo" className="border-t border-gray-100 pt-12">
            <div className="flex items-center justify-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900">See Omega in Action</h3>
            </div>
            <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto">
              This blog is built with Omega. Every post you see below is pulled directly from a Notion database.
            </p>
          </div>
        </header>

        {/* Blog Posts */}
        <section className="max-w-2xl mx-auto">
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
            <div className="space-y-0">
              {data?.posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
