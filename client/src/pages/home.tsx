import { useApi } from '@/hooks/useApi';
import { BlogPost, MarketplaceItem } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface FeaturedMarketplaceResponse {
  items: MarketplaceItem[];
}

interface LatestBlogPostsResponse {
  posts: BlogPost[];
}

export function HomePage() {
  // Fetch featured marketplace items
  const {
    data: marketplaceData,
    error: marketplaceError,
    isLoading: marketplaceLoading,
  } = useApi<FeaturedMarketplaceResponse>('/marketplace?featured=true&limit=3');

  // Fetch latest blog posts
  const {
    data: blogData,
    error: blogError,
    isLoading: blogLoading,
  } = useApi<LatestBlogPostsResponse>('/blog?limit=3&sortBy=publishedAt&order=desc');

  return (
    <div className="container py-8 space-y-12">
      {/* Featured Marketplace Items */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Services</h2>
          <Button asChild variant="outline">
            <Link to="/marketplace">View All</Link>
          </Button>
        </div>

        {marketplaceLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : marketplaceError ? (
          <div className="text-center text-red-500">
            Failed to load marketplace items
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant={item.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                    <span className="text-lg font-bold">
                      ${item.discountPrice ?? item.price}
                    </span>
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
        )}
      </section>

      {/* Latest Blog Posts */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <Button asChild variant="outline">
            <Link to="/blog">View All</Link>
          </Button>
        </div>

        {blogLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : blogError ? (
          <div className="text-center text-red-500">
            Failed to load blog posts
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogData?.posts.map((post) => (
              <Card key={post.id} className="w-full">
                <CardHeader>
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    By {post.author.name} • {formatDate(post.publishedAt || post.createdAt)}
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
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}