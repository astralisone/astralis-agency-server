"use client"

import React from "react"
import { motion } from "framer-motion"
import { useBlogPosts } from "@/hooks/useBlog"
import { APIBlogCard } from "@/components/blog/blog-list/APIBlogCard"
import { BlogDetailSkeleton } from "@/components/blog/blog-detail/BlogDetailSkeleton"
import { useMount } from "@/lib/hooks"
import { toast } from "@/components/ui/use-toast"

export function BlogPage() {
  const mounted = useMount()
  const { data, error, isLoading } = useBlogPosts({
    limit: 12,
    status: 'PUBLISHED'
  })

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development, design, and technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted aspect-[16/9] rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Unable to Load Blog Posts</h1>
          <p className="text-muted-foreground mb-8">
            {error.message || "There was an error loading the blog posts. Please try again later."}
          </p>
        </motion.div>
      </div>
    )
  }

  const posts = data?.items || []

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Insights, tutorials, and thoughts on web development, design, and technology.
        </p>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-16"
        >
          <h2 className="text-2xl font-semibold mb-4">No Blog Posts Found</h2>
          <p className="text-muted-foreground">
            Check back soon for new content!
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post, index) => (
            <APIBlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Showing page {data.pagination.page} of {data.pagination.totalPages} 
            ({data.pagination.total} total posts)
          </p>
          {/* TODO: Add pagination controls */}
        </motion.div>
      )}
    </div>
  )
}