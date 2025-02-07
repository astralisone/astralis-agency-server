import { ProductGrid } from "@/components/marketplace/product-grid"

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Digital Marketplace</h1>
        <p className="text-muted-foreground">
          Explore our curated collection of digital products, design assets, and professional services.
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}