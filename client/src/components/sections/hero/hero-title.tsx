"use client"

import { motion } from "framer-motion"

export function HeroTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        Creative solutions for modern brands
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        We craft digital experiences that inspire, engage, and deliver exceptional results. 
        Our team of experts brings your vision to life with cutting-edge technology and design.
      </p>
    </motion.div>
  )
}