import Image from 'next/image';
import { getBlogPostBySlug } from '@/lib/notion';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { format } from 'date-fns';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
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
      publishedTime: post.publishedDate,
      modifiedTime: post.lastEditedDate,
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
  } catch (error) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-6 relative">
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

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedDate}>
                {format(new Date(post.publishedDate), 'MMMM dd, yyyy')}
              </time>
            </div>

            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
