import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/useApi';
import { APIBlogPost, formatDate, calculateReadingTime } from '@/types/blog';
import { SEOHead } from '@/components/seo/SEOHead';
import { BackNavigation } from '@/components/blog/blog-detail/BackNavigation';
import { ReadingProgress } from '@/components/blog/blog-detail/ReadingProgress';
import { SocialShare } from '@/components/blog/blog-detail/SocialShare';
import { RelatedPosts } from '@/components/blog/blog-detail/RelatedPosts';
import { CommentsSection } from '@/components/blog/blog-detail/CommentsSection';
import { BlogDetailSkeleton } from '@/components/blog/blog-detail/BlogDetailSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
    `/blog?category=${post?.category?.slug}&limit=4`,
    {
      enabled: !!post?.category?.slug,
      onSuccess: (data) => {
        setRelatedPosts(data.items || []);
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

  return (
    <>
      <SEOHead
        title={post.metaTitle || `${post.title} | Astralis One Blog`}
        description={post.metaDescription || post.excerpt || shareDescription}
        keywords={post.keywords?.join(', ') || `${post.category.name}, ${post.tags.map(tag => tag.name).join(', ')}`}
        image={post.featuredImage || undefined}
        url={currentUrl}
        type="article"
      />
      
      <ReadingProgress />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <BackNavigation />
        
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
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center py-8 border-y mb-12"
          >
            <h3 className="text-lg font-semibold mb-4">Enjoyed this article?</h3>
            <p className="text-muted-foreground mb-4">Share it with your network!</p>
            <SocialShare
              url={currentUrl}
              title={post.title}
              description={shareDescription}
            />
          </motion.div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
        )}

        {/* Comments Section */}
        <CommentsSection post={post} />
      </article>
    </>
  );
}