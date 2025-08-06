import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APIBlogPost, formatDate, calculateReadingTime } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';

interface RelatedPostsProps {
  posts: APIBlogPost[];
  currentPostId: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, currentPostId }) => {
  // Filter out current post and limit to 3 related posts
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId && post.status === 'PUBLISHED')
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader className="p-0">
                    {post.featuredImage && (
                      <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge className="mb-2">{post.category.name}</Badge>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {post.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-muted-foreground">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {calculateReadingTime(post.content)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};