"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog-posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Insights, updates, and expert perspectives on design, development, and digital marketing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Badge className="mb-2">{post.category}</Badge>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}