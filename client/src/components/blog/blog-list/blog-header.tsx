"use client"

import { motion } from "framer-motion"

export function BlogHeader() {
  return (
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
  )
}