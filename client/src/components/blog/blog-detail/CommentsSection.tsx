import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { APIBlogPost } from '@/types/blog';

interface CommentsSectionProps {
  post: APIBlogPost;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ post }) => {
  const commentCount = post._count?.comments || 0;
  const likeCount = post._count?.likes || 0;

  return (
    <section className="mt-12 pt-8 border-t">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Comments ({commentCount})
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              {likeCount}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join the Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Comments Coming Soon</p>
              <p className="text-sm">
                We're working on implementing a comprehensive commenting system. 
                In the meantime, feel free to share your thoughts on social media!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};