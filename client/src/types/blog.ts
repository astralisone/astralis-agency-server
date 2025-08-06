// API Blog Post Types (matching server response)
export interface APIAuthor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface APICategory {
  id: string;
  name: string;
  slug: string;
}

export interface APITag {
  id: string;
  name: string;
  slug: string;
}

export interface APIBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  featured?: boolean;
  author: APIAuthor;
  category: APICategory;
  tags: APITag[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface APIBlogListResponse {
  items: APIBlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Utility function to calculate reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Utility function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}