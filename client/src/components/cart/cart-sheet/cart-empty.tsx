import { ShoppingCart } from "lucide-react"

export function CartEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium">Your cart is empty</p>
    </div>
  )
}