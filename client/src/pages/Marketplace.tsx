import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { MarketplaceItem, Category, Tag, PaginatedResponse } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface MarketplaceFilters {
  search?: string;
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'AVAILABLE' | 'SOLD_OUT' | 'COMING_SOON';
  sortBy?: 'price' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
}

export function MarketplacePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'createdAt',
    order: 'desc',
  });

  // Build query string from filters
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: '9',
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    ),
  }).toString();

  // Fetch marketplace items
  const {
    data: marketplaceData,
    error: marketplaceError,
    isLoading: marketplaceLoading,
  } = useApi<PaginatedResponse<MarketplaceItem>>(`/marketplace?${queryString}`);

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useApi<Category[]>('/marketplace/categories');

  // Fetch tags
  const {
    data: tagsData,
    error: tagsError,
    isLoading: tagsLoading,
  } = useApi<Tag[]>('/marketplace/tags');

  // Handle filter changes
  const handleFilterChange = (key: keyof MarketplaceFilters, value: any) => {
    // If value is 'all', set it to undefined to remove the filter
    const newValue = value === 'all' ? undefined : value;
    setFilters((prev) => ({ ...prev, [key]: newValue }));
    setPage(1); // Reset page when filters change
  };

  return (
    <div className="container py-8">
      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.length ? (
              categoriesData.map((category) => (
                <SelectItem key={category.slug} value={category.slug || `category-${category.id}`}>
                  {category.name} ({category._count?.marketplaceItems || 0})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.tag}
          onValueChange={(value) => handleFilterChange('tag', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tagsData?.length ? (
              tagsData.map((tag) => (
                <SelectItem key={tag.slug} value={tag.slug || `tag-${tag.id}`}>
                  {tag.name} ({tag._count?.marketplaceItems || 0})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tags" disabled>
                No tags available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value: any) => handleFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
          </SelectContent>
        </Select>

        <div className="lg:col-span-2">
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <Select
          value={filters.sortBy}
          onValueChange={(value: any) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Latest</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.order}
          onValueChange={(value: any) => handleFilterChange('order', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      {marketplaceLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : marketplaceError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load marketplace items
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceData?.items.map((item) => (
              <Card key={item.id} className="w-full">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.category.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={item.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <span className="text-lg font-bold">
                        {formatCurrency(item.discountPrice ?? item.price)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag.slug} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/marketplace/${item.slug}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {marketplaceData && marketplaceData.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={!marketplaceData.pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!marketplaceData.pagination.hasNextPage}
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