import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { BlogPost, Category, Tag, PaginatedResponse } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  sortBy?: 'publishedAt' | 'title' | 'viewCount';
  order?: 'asc' | 'desc';
}

export function BlogPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<BlogFilters>({
    category: '',
    tag: '',
    sortBy: 'publishedAt',
    order: 'desc',
  });

  console.log('🚀 BlogPage render - Current filters:', filters);

  // Build query string from filters
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: '9',
    status: 'PUBLISHED',
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    ),
  }).toString();

  // Fetch blog posts
  const {
    data: blogData,
    error: blogError,
    isLoading: blogLoading,
  } = useApi<PaginatedResponse<BlogPost>>(`/blog?${queryString}`);

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useApi<Category[]>('/blog/categories');

  // Fetch tags
  const {
    data: tagsData,
    error: tagsError,
    isLoading: tagsLoading,
  } = useApi<Tag[]>('/blog/tags');

  // Handle filter changes
  const handleFilterChange = (key: keyof BlogFilters, value: any) => {
    console.log(`🔄 Filter Change - ${key}:`, { 
      incoming: value, 
      type: typeof value, 
      isEmpty: value === '', 
      isUndefined: value === undefined,
      isNull: value === null 
    });
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log('📊 New filters state:', newFilters);
      return newFilters;
    });
    setPage(1); // Reset page when filters change
  };

  return (
    <div className="container py-8">
      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-1">
        <Input
          placeholder="Search posts..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Posts Grid */}
      {blogLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : blogError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load blog posts
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData?.items.map((post) => (
              <Card key={post.id} className="w-full">
                <CardHeader>
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      {post.author.avatar && (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt || post.content}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.slug} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>👁️</span>
                      <span>{post.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span>{post._count.likes} likes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {blogData && blogData.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={!blogData.pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!blogData.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 