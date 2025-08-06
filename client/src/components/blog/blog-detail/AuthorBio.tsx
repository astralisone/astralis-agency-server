import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail } from 'lucide-react';
import { APIAuthor } from '@/types/blog';

interface AuthorBioProps {
  author: APIAuthor;
  publishedDate: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ author, publishedDate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 pt-8 border-t"
    >
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="text-lg font-semibold">
                {author.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{author.name}</h3>
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Author
                </Badge>
              </div>
              
              {author.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Mail className="h-4 w-4" />
                  {author.email}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  Published on {new Date(publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>
              
              <div className="text-sm leading-relaxed">
                <p>
                  {author.name} is a passionate writer and expert contributor to the Astralis Agency blog. 
                  With extensive experience in technology and business, they share insights that help readers 
                  stay ahead of industry trends and best practices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};