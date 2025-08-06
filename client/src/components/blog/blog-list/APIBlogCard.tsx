"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { APIBlogPost, formatDate, calculateReadingTime } from "@/types/blog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, Eye, Heart, MessageCircle } from "lucide-react"

interface APIBlogCardProps {
  post: APIBlogPost
  index: number
}

export function APIBlogCard({ post, index }: APIBlogCardProps) {
  const imageUrl = post.featuredImage || `https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/blog/${post.slug}`}>
        <Card className="h-full hover:shadow-lg transition-shadow group">
          <CardHeader className="p-0">
            <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
              <img
                src={imageUrl}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              {post.featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Badge className="mb-2">{post.category.name}</Badge>
            <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-muted-foreground">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {calculateReadingTime(post.content)}
              </div>
            </div>

            {/* Post stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.viewCount.toLocaleString()}
                </div>
              )}
              {post._count && (
                <>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post._count.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post._count.comments}
                  </div>
                </>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}