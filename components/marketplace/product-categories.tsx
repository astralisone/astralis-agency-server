"use client"

import { Button } from "@/components/ui/button"

const categories = [
  "All Products",
  "Branded Merchandise",
  "Digital Design Assets",
  "Educational Products",
  "Design Services",
  "Art & Photography"
]

export function ProductCategories() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}