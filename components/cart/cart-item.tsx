"use client"

import { CartItem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              onUpdateQuantity(item.id, item.quantity + 1)
            }
          >
            +
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}