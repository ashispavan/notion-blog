export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  publishedDate: string;
  lastEditedDate: string;
  tags: string[];
  author?: string;
  coverImage?: string;
  published: boolean;
}

export interface NotionPageProperty {
  id: string;
  type: string;
  title?: Array<{ plain_text: string }>;
  checkbox?: boolean;
  date?: { start: string } | null;
  multi_select?: Array<{ name: string }>;
  select?: { name: string } | null;
  rich_text?: Array<{ plain_text: string }>;
  [key: string]: unknown;
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionPageProperty>;
  url: string;
  cover?: {
    type: string;
    file?: {
      url: string;
    };
    external?: {
      url: string;
    };
  };
}

export interface BlogListResponse {
  posts: BlogPost[];
  hasMore: boolean;
  nextCursor?: string;
}
