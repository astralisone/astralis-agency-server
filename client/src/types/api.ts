export interface MarketplaceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'COMING_SOON';
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string | null;
  };
  specifications: Record<string, any> | null;
  features: string[];
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  stock: number;
  discountPrice: string | null;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count: {
    comments: number;
    likes: number;
  };
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postsCount?: number;
  _count?: {
    marketplaceItems?: number;
    posts?: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postsCount?: number;
  _count?: {
    marketplaceItems?: number;
    posts?: number;
  };
}

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
} 