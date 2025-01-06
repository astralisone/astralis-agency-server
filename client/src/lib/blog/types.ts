export interface Author {
  name: string
  role: string
  avatar: string
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  image: string
  author: Author
}