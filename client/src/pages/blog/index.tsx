"use client"

import { BlogList } from "@/components/blog/blog-list"
import { blogPosts } from "@/lib/blog/data"
import { useMount } from "@/lib/hooks"

export default function BlogPage() {
  const mounted = useMount()

  if (!mounted) {
    return null
  }

  return <BlogList posts={blogPosts} />
}