"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface PortfolioCardProps {
  title: string
  category: string
  image: string
  index: number
}

export function PortfolioCard({ title, category, image, index }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group cursor-pointer overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="relative overflow-hidden aspect-video">
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className="mb-2">{category}</Badge>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}