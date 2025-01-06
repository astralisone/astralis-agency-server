"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/blog/types"

interface BlogFiltersProps {
  posts: BlogPost[]
  onFilterChange: (filteredPosts: BlogPost[]) => void
}

export function BlogFilters({ posts, onFilterChange }: BlogFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(posts.map(post => post.category)))

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterPosts(term, activeCategory)
  }

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category === activeCategory ? null : category)
    filterPosts(searchTerm, category === activeCategory ? null : category)
  }

  const filterPosts = (term: string, category: string | null) => {
    let filtered = [...posts]

    if (term) {
      const searchLower = term.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      )
    }

    if (category) {
      filtered = filtered.filter(post => post.category === category)
    }

    onFilterChange(filtered)
  }

  return (
    <div className="space-y-4 mb-8">
      <Input
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}