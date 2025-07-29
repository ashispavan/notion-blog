import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface AuthorSidebarProps {
  latestPosts?: BlogPost[];
}

export function AuthorSidebar({ latestPosts = [] }: AuthorSidebarProps) {
  return (
    <aside className="w-80 flex-shrink-0 pr-16">
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-sm font-semibold tracking-wider text-gray-900 mb-6">
          SIMPLEXITY
        </h1>
        
        {/* Navigation */}
        <nav className="flex space-x-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Overview</Link>
          <Link href="/guide" className="hover:text-gray-900">Style Guide</Link>
          <Link href="/buy" className="hover:text-gray-900">Buy Simplexity</Link>
        </nav>
      </div>

      {/* Simplified Author Profile */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
          PRODUCT DESIGNER<br />
          CREATING THOUGHTFUL,<br />
          INTUITIVE INTERFACES
        </h2>
        
        <div className="text-sm text-gray-700 leading-relaxed mb-6">
          <p>
            Front-end designer focused on creating intuitive interfaces 
            for web and mobile applications.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-6 text-sm text-gray-600">
          <Link href="#" className="hover:text-gray-900">Twitter</Link>
          <Link href="#" className="hover:text-gray-900">Dribbble</Link>
          <Link href="#" className="hover:text-gray-900">Email</Link>
        </div>
      </div>

      {/* Latest Posts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Latest blog posts</h3>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            See all posts <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          {latestPosts.slice(0, 2).map((post) => (
            <article key={post.id} className="text-sm">
              <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-gray-600">
                  {post.title}
                </Link>
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">
                {post.excerpt?.substring(0, 120) + '...'}
              </p>
              <div className="text-xs text-gray-500">
                {post.author} · {new Date(post.publishedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}