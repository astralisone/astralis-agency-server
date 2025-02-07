import { blogPosts } from "@/lib/blog-posts"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { notFound } from "next/navigation"

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find(post => post.id === parseInt(params.id))

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} />
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id.toString(),
  }))
}