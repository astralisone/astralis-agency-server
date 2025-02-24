"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { BlogPost } from "@/lib/blog-posts"

interface PostHeaderProps {
  post: BlogPost
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Badge className="mb-4">{post.category}</Badge>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {post.author.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>{post.date}</span>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime}
          </div>
        </div>
      </div>
    </motion.div>
  )
}