import { motion } from "framer-motion";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our collection of premium templates, plugins, and services
          designed to help you build better websites.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}