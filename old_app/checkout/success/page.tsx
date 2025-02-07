"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OrderDetails {
  id: string
  status: string
  create_time: string
  payer: {
    name: {
      given_name: string
      surname: string
    }
    email_address: string
    address: {
      address_line_1: string
      address_line_2?: string
      admin_area_2: string
      admin_area_1: string
      postal_code: string
      country_code: string
    }
  }
  purchase_units: Array<{
    amount: {
      value: string
      currency_code: string
    }
    items: Array<{
      name: string
      quantity: string
      unit_amount: {
        value: string
        currency_code: string
      }
    }>
  }>
}

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clearCart = useCart((state) => state.clearCart)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  
  useEffect(() => {
    const orderId = searchParams.get("order_id")
    if (!orderId) {
      setError("Invalid order ID")
      setIsLoading(false)
      return
    }

    // In a real application, you would fetch the order details from your backend
    // For this example, we'll simulate a successful order
    const simulateOrderFetch = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        clearCart()
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify order")
        setIsLoading(false)
      }
    }

    simulateOrderFetch()
  }, [clearCart, searchParams])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="mx-auto max-w-md text-center px-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            className="mt-6"
            onClick={() => router.push("/marketplace")}
          >
            Return to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Thank You for Your Purchase!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been successfully processed
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p className="text-sm text-muted-foreground">
                Order ID: {searchParams.get("order_id")}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Separator />

            <div className="flex justify-between">
              <p className="font-semibold">Status</p>
              <p className="text-green-500 font-semibold">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => window.print()} className="gap-2">
          <Download className="w-4 h-4" />
          Download Receipt
        </Button>
        <Button variant="outline" onClick={() => router.push("/marketplace")} className="gap-2">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}