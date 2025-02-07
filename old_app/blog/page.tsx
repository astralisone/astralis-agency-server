import { BlogList } from "@/components/blog/blog-list"
import { blogPosts } from "@/lib/blog-posts"

export default function BlogPage() {
  return <BlogList posts={blogPosts} />
}