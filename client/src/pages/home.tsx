import { useApi } from '@/hooks/useApi';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { BlogPost, MarketplaceItem } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  TrendingUp, 
  Zap,
  Shield,
  Rocket,
  Globe,
  Code,
  Palette
} from 'lucide-react';

interface FeaturedMarketplaceResponse {
  items: MarketplaceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface LatestBlogPostsResponse {
  items: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function HomePage() {
  // Fetch featured marketplace items
  const {
    data: marketplaceData,
    error: marketplaceError,
    isLoading: marketplaceLoading,
  } = useApi<FeaturedMarketplaceResponse>('/marketplace/products/search?featured=true&limit=3');

  // Fetch latest blog posts
  const {
    data: blogData,
    error: blogError,
    isLoading: blogLoading,
  } = useApi<LatestBlogPostsResponse>('/blog?limit=3&sortBy=publishedAt&order=desc');

  // Fetch featured testimonials
  const {
    testimonials,
    isLoading: testimonialsLoading,
    error: testimonialsError,
  } = useTestimonials({ featured: true });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Welcome to Astralis Agency
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Digital Solutions That{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your Business
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              From cutting-edge web development to strategic digital marketing, we craft 
              exceptional experiences that drive growth and exceed expectations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-base">
                <Link to="/marketplace">
                  Explore Our Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/contact">
                  Get Free Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Our Core Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>
                  Custom websites and web applications built with modern technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    React & Next.js Applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    E-commerce Solutions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    API Development
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-white">
                  <Palette className="h-6 w-6" />
                </div>
                <CardTitle>UI/UX Design</CardTitle>
                <CardDescription>
                  Beautiful, user-centered designs that convert visitors into customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    User Experience Research
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Interface Design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prototyping & Testing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500 text-white">
                  <Rocket className="h-6 w-6" />
                </div>
                <CardTitle>Digital Marketing</CardTitle>
                <CardDescription>
                  Strategic marketing campaigns that drive traffic and boost conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SEO Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Social Media Marketing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Content Strategy
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container space-y-24">
        {/* Featured Marketplace Items */}
        <section>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Services</h2>
            <p className="text-lg text-muted-foreground">
              Discover our most popular services that help businesses thrive in the digital landscape
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/marketplace">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Latest Articles</h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest trends, insights, and best practices in digital technology
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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

        {/* About/Why Choose Us */}
        <section className="py-16 bg-muted/30 rounded-3xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Why Choose Astralis Agency?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              We combine technical expertise with creative innovation to deliver exceptional results that exceed expectations
            </p>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Reliable & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Built with security best practices and reliable infrastructure
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Serving clients worldwide with 24/7 support and maintenance
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Award Winning</h3>
                <p className="text-sm text-muted-foreground">
                  Recognized for excellence in design and development
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Growth Focused</h3>
                <p className="text-sm text-muted-foreground">
                  Strategies designed to drive measurable business growth
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats/Numbers */}
        <section>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Numbers that showcase our commitment to excellence and client success
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">500+</div>
              <p className="text-sm font-medium">Projects Completed</p>
              <p className="text-xs text-muted-foreground">Successful deliveries worldwide</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">250+</div>
              <p className="text-sm font-medium">Happy Clients</p>
              <p className="text-xs text-muted-foreground">Across 30+ countries</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">99.9%</div>
              <p className="text-sm font-medium">Uptime Guarantee</p>
              <p className="text-xs text-muted-foreground">Reliable infrastructure</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
              <p className="text-sm font-medium">Support Available</p>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : testimonialsError ? (
            <div className="text-center text-muted-foreground">
              <p>Unable to load testimonials at this time</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-sm italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={testimonial.author.avatar || testimonial.avatar} 
                        alt={testimonial.author.name} 
                      />
                      <AvatarFallback>
                        {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No testimonials available at this time</p>
            </div>
          )}
        </section>

        {/* Call-to-Action */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-center text-primary-foreground md:p-16">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Let's discuss your project and create something extraordinary together. 
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/marketplace">
                  View Our Services
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5"></div>
        </section>
      </div>
    </div>
  );
}