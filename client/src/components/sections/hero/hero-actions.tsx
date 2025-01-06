"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroActions() {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <Button size="lg" className="gap-2">
        Get started <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="lg">
        Learn more
      </Button>
    </div>
  )
}