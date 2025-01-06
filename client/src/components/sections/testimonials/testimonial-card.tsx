"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  avatar: string
  index: number
}

export function TestimonialCard({ name, role, content, avatar, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-muted-foreground mb-6">{content}</p>
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}