"use client";

import type { BlogPost } from "@/lib/blog-posts";

interface PostContentProps {
  post: BlogPost;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {post.content.split("\n\n").map((paragraph, index) => (
        <p key={index} className="text-lg leading-relaxed mb-6">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}
