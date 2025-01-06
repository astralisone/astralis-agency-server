"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/lib/hooks"
import { CartItem } from "./cart-item"
import { CartFooter } from "./cart-footer"
import { CartEmpty } from "./cart-empty"

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { items, total, removeItem, updateQuantity } = useCart()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setIsOpen(false)
      navigate("/checkout")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-4 pr-6">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </ScrollArea>
            <CartFooter
              total={total}
              isLoading={isLoading}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}