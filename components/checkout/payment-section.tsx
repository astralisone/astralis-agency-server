"use client"

import { useState } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { CartItem } from "@/lib/store"

interface PaymentSectionProps {
  items: CartItem[]
  total: number
  onSuccess: () => void
}

export function PaymentSection({ items, total, onSuccess }: PaymentSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: total.toFixed(2),
                  currency_code: "USD"
                },
                description: `Order from Nicol - ${items.length} item(s)`,
                items: items.map(item => ({
                  name: item.name,
                  quantity: item.quantity.toString(),
                  unit_amount: {
                    value: item.price.toFixed(2),
                    currency_code: "USD"
                  }
                }))
              }]
            })
          }}
          onApprove={async (data, actions) => {
            setIsLoading(true)
            try {
              const order = await actions.order?.capture()
              if (order) {
                onSuccess()
                router.push("/checkout/success?order_id=" + order.id)
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment failed")
            } finally {
              setIsLoading(false)
            }
          }}
          onError={(err) => {
            setError("Payment failed. Please try again.")
            console.error("PayPal Error:", err)
          }}
        />
      </CardContent>
    </Card>
  )
}