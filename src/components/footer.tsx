import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-start">
          {/* Left side - Brand and description */}
          <div className="max-w-md">
            <h3 className="text-base font-semibold tracking-wider text-gray-900 mb-4">
              OMEGA
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              A simple, elegant solution to turn your Notion<br />
              into a beautiful blog with Next.js.
            </p>
          </div>

          {/* Right side - Navigation */}
          <div className="flex space-x-16 text-base">
            <div>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/#demo" className="hover:text-gray-900">Demo</Link></li>
                <li><Link href="https://github.com/ashispavan/notion-blog" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Documentation</Link></li>
                <li><Link href="https://github.com/ashispavan/notion-blog" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">Get Omega</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            © Copyright 2023. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}