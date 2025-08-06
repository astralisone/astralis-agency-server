import { useApi } from './useApi';
import { APIBlogPost, APIBlogListResponse } from '@/types/blog';

interface UseBlogOptions {
  limit?: number;
  page?: number;
  search?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export function useBlogPosts(options: UseBlogOptions = {}) {
  const {
    limit = 10,
    page = 1,
    search,
    category,
    status = 'PUBLISHED',
    sortBy = 'createdAt',
    order = 'desc'
  } = options;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sortBy,
    order,
    status
  });

  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);

  const endpoint = `/blog?${queryParams.toString()}`;

  return useApi<APIBlogListResponse>(endpoint);
}

export function useBlogPost(slug: string) {
  return useApi<APIBlogPost>(`/blog/${slug}`, {
    enabled: !!slug
  });
}

export function useBlogCategories() {
  return useApi<Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    postsCount: number;
  }>>('/blog/categories');
}

export function useBlogTags() {
  return useApi<Array<{
    id: string;
    name: string;
    slug: string;
    postsCount: number;
  }>>('/blog/tags');
}