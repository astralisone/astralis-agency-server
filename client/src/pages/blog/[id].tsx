import { useParams, Navigate } from "react-router-dom"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { blogPosts } from "@/lib/blog/data"
import { useMount } from "@/lib/hooks"

export default function BlogPostPage() {
  const { id } = useParams()
  const mounted = useMount()
  const post = blogPosts.find(post => post.id === parseInt(id || ""))

  if (!mounted) {
    return null
  }

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return <BlogPostContent post={post} />
}