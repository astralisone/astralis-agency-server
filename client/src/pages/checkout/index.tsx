"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/lib/store"
import { PayPalCheckoutButton } from "@/components/checkout/PayPalCheckoutButton"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMount } from "@/lib/hooks"

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total } = useCart()
  const mounted = useMount()

  useEffect(() => {
    if (mounted && items.length === 0) {
      navigate("/marketplace")
    }
  }, [items, navigate, mounted])

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Add some items to your cart to continue checkout</p>
          <Button onClick={() => navigate("/marketplace")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Checkout functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}