"use client"

import { Button } from "@/components/ui/button"
import { useCart, CartItem } from "@/lib/store"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  product: CartItem
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}