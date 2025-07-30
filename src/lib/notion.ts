import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost, NotionPage, NotionPageProperty, BlogListResponse } from '@/types/blog';
import { cache } from 'react';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// Helper function to extract plain text from Notion rich text
function getPlainText(richText: Array<{ plain_text: string }>): string {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map((text) => text.plain_text).join('');
}

// Helper function to extract text from title property
function getTitleText(titleProperty: NotionPageProperty): string {
  if (!titleProperty || titleProperty.type !== 'title' || !titleProperty.title) return '';
  return getPlainText(titleProperty.title);
}

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to extract tags
function getTags(multiSelectProperty: NotionPageProperty): string[] {
  if (!multiSelectProperty || multiSelectProperty.type !== 'multi_select' || !multiSelectProperty.multi_select) return [];
  return multiSelectProperty.multi_select.map((tag) => tag.name);
}

// Helper function to get checkbox value
function getCheckboxValue(checkboxProperty: NotionPageProperty): boolean {
  if (!checkboxProperty || checkboxProperty.type !== 'checkbox' || checkboxProperty.checkbox === undefined) return false;
  return checkboxProperty.checkbox;
}

// Helper function to get date value
function getDateValue(dateProperty: NotionPageProperty): string {
  if (!dateProperty || dateProperty.type !== 'date' || !dateProperty.date) {
    return new Date().toISOString();
  }
  return dateProperty.date.start;
}

// Helper function to get select value (for author)
function getSelectValue(selectProperty: NotionPageProperty): string {
  if (!selectProperty || selectProperty.type !== 'select' || !selectProperty.select) return '';
  return selectProperty.select.name;
}

// Helper function to get cover image URL
function getCoverImage(page: NotionPage): string | undefined {
  if (!page.cover) return undefined;
  
  if (page.cover.type === 'file') {
    return page.cover.file?.url;
  } else if (page.cover.type === 'external') {
    return page.cover.external?.url;
  }
  
  return undefined;
}

// Convert Notion page to BlogPost
async function notionPageToBlogPost(page: NotionPage, includeContent = false): Promise<BlogPost> {
  const title = getTitleText(page.properties.Title || page.properties.Name);
  const slug = createSlug(title);
  
  let content = '';
  if (includeContent) {
    try {
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      content = n2m.toMarkdownString(mdBlocks).parent;
    } catch (error) {
      console.error('Error converting page to markdown:', error);
      content = '';
    }
  }

  return {
    id: page.id,
    title,
    slug,
    content,
    excerpt: content ? content.substring(0, 200) + '...' : '',
    publishedDate: getDateValue(page.properties.Date || page.properties.Published),
    lastEditedDate: page.last_edited_time,
    tags: getTags(page.properties.Tags),
    author: getSelectValue(page.properties.Author),
    coverImage: getCoverImage(page),
    published: getCheckboxValue(page.properties.Published) ?? true,
  };
}

// Cache for all published posts (used by both list and individual fetches)
const getAllPublishedPosts = cache(async (): Promise<NotionPage[]> => {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });
  
  return response.results as NotionPage[];
});

// Fetch all blog posts (cached)
export const getBlogPosts = cache(async (): Promise<BlogListResponse> => {
  try {
    // For simplicity, we'll get all posts from cache and implement pagination later if needed
    const pages = await getAllPublishedPosts();
    
    const posts = await Promise.all(
      pages.map((page) => notionPageToBlogPost(page as NotionPage, false))
    );

    return {
      posts,
      hasMore: false, // Simplified for now since we're getting all posts
      nextCursor: undefined,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
});

// Fetch a single blog post by slug (cached)
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const pages = await getAllPublishedPosts();
    
    for (const page of pages) {
      const post = await notionPageToBlogPost(page as NotionPage, true);
      if (post.slug === slug) {
        return post;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw new Error('Failed to fetch blog post');
  }
});

// Fetch a single blog post by ID (cached)
export const getBlogPostById = cache(async (id: string): Promise<BlogPost | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    return await notionPageToBlogPost(page as NotionPage, true);
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
});
