# Notion Blog with Next.js

A modern blog platform that uses Notion as a headless CMS, built with Next.js and TanStack Query.

## Features

- 📝 **Notion as CMS**: Write and manage blog posts directly in Notion
- ⚡ **Fast Performance**: Built with Next.js and optimized for speed
- 🔄 **Smart Caching**: TanStack Query for efficient data fetching and caching
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Rich Content**: Markdown rendering with syntax highlighting
- 🏷️ **Tags & Metadata**: Support for tags, authors, cover images, and more
- 🔍 **SEO-Optimized**: Built-in SEO optimization for blog posts

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with Typography plugin
- **Data Fetching**: TanStack Query v5
- **Notion Integration**: @notionhq/client
- **Content Processing**: notion-to-md for Markdown conversion
- **Markdown Rendering**: react-markdown with syntax highlighting
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

1. A Notion account with a database set up for blog posts
2. Node.js 18+ installed on your machine

### Notion Setup

1. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Click "Create a new integration"
   - Give it a name like "My Blog Integration"
   - Copy the "Internal Integration Token"

2. **Set up your Notion Database**:
   Your database should have these properties (exact names matter):
   - **Title** (Title) - The blog post title
   - **Published** (Checkbox) - Whether the post is published
   - **Date** or **Published** (Date) - Publication date
   - **Tags** (Multi-select) - Tags for the post
   - **Author** (Select) - Author name (optional)
   
3. **Share Database with Integration**:
   - Open your Notion database
   - Click "Share" in the top right
   - Click "Invite" and select your integration
   - Give it "Edit" permissions

4. **Get Database ID**:
   - Copy the URL of your database
   - Extract the database ID (the long string between the last "/" and "?")
   - Example: `https://notion.so/username/DATABASE_ID?v=...`

### Installation & Configuration

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Update `.env.local` with your Notion credentials:
   ```env
   NOTION_TOKEN=your_notion_integration_token_here
   NOTION_DATABASE_ID=your_notion_database_id_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit http://localhost:3000 to see your blog!

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/blog/            # API routes for blog data
│   ├── blog/[slug]/         # Dynamic blog post pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (blog listing)
├── components/              # React components
│   ├── blog/                # Blog-specific components
│   ├── providers/           # Context providers
│   └── markdown-renderer.tsx
├── hooks/                   # Custom React hooks
│   └── use-blog.ts          # Blog data fetching hooks
├── lib/                     # Utility libraries
│   └── notion.ts            # Notion API integration
└── types/                   # TypeScript type definitions
    └── blog.ts
```

## Database Schema

Your Notion database should have these properties:

| Property Name | Type | Required | Description |
|---------------|------|----------|-------------|
| Title | Title | Yes | Blog post title |
| Published | Checkbox | Yes | Whether post is published |
| Date/Published | Date | No | Publication date |
| Tags | Multi-select | No | Post tags |
| Author | Select | No | Author name |

## Customization

### Styling
- Modify Tailwind classes in components
- Update global styles in `src/app/globals.css`
- Change color scheme in components

### Notion Fields
- Update field mappings in `src/lib/notion.ts`
- Add new properties to the `BlogPost` type in `src/types/blog.ts`
- Extend the conversion logic in the `notionPageToBlogPost` function

### Features
- Add search functionality
- Implement pagination
- Add RSS feed generation
- Create tag-based filtering
- Add newsletter signup

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app works on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Troubleshooting

### Common Issues

1. **"Failed to fetch blog posts"**
   - Check your `NOTION_TOKEN` and `NOTION_DATABASE_ID`
   - Ensure the integration has access to your database
   - Verify database property names match the code

2. **Empty blog list**
   - Make sure posts have `Published` checkbox checked
   - Verify the database has the correct structure
   - Check the API route at `/api/blog/posts`

3. **Markdown not rendering**
   - Check if content is being fetched correctly
   - Verify the `notion-to-md` conversion is working
   - Look for errors in the browser console

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
