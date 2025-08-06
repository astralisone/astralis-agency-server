import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { APIBlogPost } from '@/types/blog';

interface BreadcrumbNavigationProps {
  post: APIBlogPost;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ post }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      <Link to="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to="/blog" className="hover:text-foreground transition-colors">
        Blog
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to={`/blog?category=${post.category.slug}`} className="hover:text-foreground transition-colors">
        {post.category.name}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground line-clamp-1">{post.title}</span>
    </nav>
  );
};