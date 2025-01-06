"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/lib/store"
import { PayPalCheckoutButton } from "@/components/checkout/PayPalCheckoutButton"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMount } from "@/lib/hooks"

export default function CheckoutPage() {
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
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <PayPalCheckoutButton amount={total} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:sticky lg:top-6">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}