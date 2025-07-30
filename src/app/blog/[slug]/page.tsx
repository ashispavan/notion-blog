import Image from 'next/image';
import { getBlogPostBySlug } from '@/lib/notion';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO and performance
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await getBlogPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    return {
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${post.author}`,
      authors: post.author ? [{ name: post.author }] : undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read ${post.title} by ${post.author}`,
        type: 'article',
        publishedTime: post.publishedDate,
        modifiedTime: post.lastEditedDate,
        authors: post.author ? [post.author] : undefined,
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || `Read ${post.title} by ${post.author}`,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return {
      title: 'Error Loading Post',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation */}
      <header className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-base font-semibold tracking-wider text-gray-900 hover:text-gray-700">
              OMEGA
            </Link>
            <nav className="flex space-x-6 text-base text-gray-600">
              <Link href="/#demo" className="hover:text-gray-900">Demo</Link>
              <Link href="https://github.com/ashispavan/notion-blog" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Get Omega</Link>
            </nav>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.publishedDate}>
              {format(new Date(post.publishedDate), 'MMMM dd, yyyy')}
            </time>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 relative">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
