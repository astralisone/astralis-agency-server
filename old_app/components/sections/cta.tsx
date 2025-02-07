"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 mix-blend-multiply" />
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Team collaboration"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your digital presence?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-200">
              Let's collaborate to create something extraordinary.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button size="lg" variant="secondary" className="gap-2">
                Get started today <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}