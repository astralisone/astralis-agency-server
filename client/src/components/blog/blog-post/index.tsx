"use client"

import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/blog-posts"
import { PostHeader } from "./post-header"
import { PostImage } from "./post-image"
import { PostContent } from "./post-content"

interface BlogPostContentProps {
  post: BlogPost
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PostHeader post={post} />
        <PostImage src={post.image} alt={post.title} />
        <PostContent post={post} />
      </motion.div>
    </article>
  )
}