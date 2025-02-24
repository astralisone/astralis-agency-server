"use client"

import { useState } from "react"
import { BlogHeader } from "./blog-header"
import { BlogFilters } from "./blog-filters"
import { BlogGrid } from "./blog-grid"
import type { BlogPost } from "@/lib/blog/types"

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState(posts)

  return (
    <div className="container mx-auto px-4 py-12">
      <BlogHeader />
      <BlogFilters posts={posts} onFilterChange={setFilteredPosts} />
      <BlogGrid posts={filteredPosts} />
    </div>
  )
}