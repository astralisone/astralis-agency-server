"use client"

import { motion } from "framer-motion"

export function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-16 flow-root sm:mt-24"
    >
      <div className="relative -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
          alt="App screenshot"
          className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
        />
      </div>
    </motion.div>
  )
}