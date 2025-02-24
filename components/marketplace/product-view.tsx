"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { ProductList } from "@/components/marketplace/product-list"
import { ViewToggle } from "@/components/marketplace/view-toggle"

export function ProductView() {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <>
      <div className="flex items-center justify-end mb-8">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? <ProductGrid /> : <ProductList />}
    </>
  )
}