import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/useApi';
import { APIBlogPost, formatDate, calculateReadingTime } from '@/types/blog';
import { SEOHead } from '@/components/seo/SEOHead';
import { BackNavigation } from '@/components/blog/blog-detail/BackNavigation';
import { BreadcrumbNavigation } from '@/components/blog/blog-detail/BreadcrumbNavigation';
import { AuthorBio } from '@/components/blog/blog-detail/AuthorBio';
import { TableOfContents } from '@/components/blog/blog-detail/TableOfContents';
import { ReadingProgress } from '@/components/blog/blog-detail/ReadingProgress';
import { SocialShare } from '@/components/blog/blog-detail/SocialShare';
import { RelatedPosts } from '@/components/blog/blog-detail/RelatedPosts';
import { CommentsSection } from '@/components/blog/blog-detail/CommentsSection';
import { BlogDetailSkeleton } from '@/components/blog/blog-detail/BlogDetailSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Eye, BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addHeadingIds } from '@/utils/markdown';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [relatedPosts, setRelatedPosts] = useState<APIBlogPost[]>([]);
  
  // Fetch the blog post by slug
  const { data: post, error, isLoading } = useApi<APIBlogPost>(`/blog/${id}`, {
    enabled: !!id,
    onError: (error) => {
      toast({
        title: "Error loading blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Fetch related posts based on category
  const { data: relatedData } = useApi<{ items: APIBlogPost[] }>(
    `/blog?category=${post?.category?.slug}&limit=6&status=PUBLISHED`,
    {
      enabled: !!post?.category?.slug,
      onSuccess: (data) => {
        // Filter out current post and limit to 3 most recent
        const filteredPosts = (data.items || [])
          .filter((relatedPost: APIBlogPost) => relatedPost.id !== post?.id)
          .slice(0, 3);
        setRelatedPosts(filteredPosts);
      }
    }
  );

  // Handle loading state
  if (isLoading) {
    return (
      <>
        <ReadingProgress />
        <BlogDetailSkeleton />
      </>
    );
  }

  // Handle error state
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error?.message || "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <BackNavigation />
        </motion.div>
      </div>
    );
  }

  // Build the current page URL for sharing
  const currentUrl = `${window.location.origin}/blog/${post.slug}`;
  const shareDescription = post.excerpt || post.metaDescription || `Read "${post.title}" on our blog.`;
  
  // Build structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": post.featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": post.author.email ? `mailto:${post.author.email}` : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "Astralis One",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "articleSection": post.category.name,
    "keywords": post.keywords?.join(', ') || post.tags.map(tag => tag.name).join(', '),
    "wordCount": post.content.trim().split(/\s+/).length,
    "url": currentUrl
  };

  return (
    <>
      <SEOHead
        title={post.metaTitle || `${post.title} | Astralis One Blog`}
        description={post.metaDescription || post.excerpt || shareDescription}
        keywords={post.keywords?.join(', ') || `${post.category.name}, ${post.tags.map(tag => tag.name).join(', ')}`}
        image={post.featuredImage || undefined}
        url={currentUrl}
        type="article"
        structuredData={structuredData}
      />
      
      <ReadingProgress />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto lg:max-w-none lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <BackNavigation />
            <BreadcrumbNavigation post={post} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Article Header */}
              <header className="mb-8">
                <Badge className="mb-4">{post.category.name}</Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Author and Meta Info */}
                <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="text-lg">
                        {post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{post.author.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {calculateReadingTime(post.content)}
                        </div>
                        {post.viewCount && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.viewCount.toLocaleString()} views
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <SocialShare
                    url={currentUrl}
                    title={post.title}
                    description={shareDescription}
                  />
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="aspect-[2/1] overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:scroll-mt-24 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-img:rounded-lg prose-img:shadow-md"
              >
                <div dangerouslySetInnerHTML={{ __html: addHeadingIds(post.content) }} />
              </motion.div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Author Bio */}
            <AuthorBio author={post.author} publishedDate={post.publishedAt || post.createdAt} />

            {/* Comments Section */}
            <CommentsSection post={post} />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24">
              {/* Article Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Article Info
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Reading time:</span>
                        <span className="font-medium">{calculateReadingTime(post.content)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span className="font-medium">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      {post.viewCount && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Views:</span>
                          <span className="font-medium">{post.viewCount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge>{post.category.name}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Table of Contents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TableOfContents content={post.content} />
              </motion.div>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-3">Share this article</h3>
                    <SocialShare
                      url={currentUrl}
                      title={post.title}
                      description={shareDescription}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </aside>
        </div>

        {/* Related Posts - Full Width */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
          </div>
        )}
      </div>
    </>
  );
}