"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background pt-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
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
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="gap-2">
                  Get started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg">
                  Learn more
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}