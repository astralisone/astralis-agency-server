export interface MarketplaceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'COMING_SOON';
  category: {
    name: string;
    slug: string;
  };
  seller: {
    name: string;
    avatar: string | null;
  };
  specifications: Record<string, any> | null;
  features: string[];
  tags: Array<{
    name: string;
    slug: string;
  }>;
  stock: number;
  discountPrice: number | null;
  featured: boolean;
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
    name: string;
    avatar: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: Array<{
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
  name: string;
  slug: string;
  description: string | null;
  _count: {
    marketplaceItems?: number;
    posts?: number;
  };
}

export interface Tag {
  name: string;
  slug: string;
  _count: {
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