import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BlogPostPage() {
  const { id } = useParams()

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Blog Post</CardTitle>
            <CardDescription>Post ID: {id}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Blog post content coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}