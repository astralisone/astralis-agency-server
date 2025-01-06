"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useCart } from "@/lib/store"

export function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const clearCart = useCart((state) => state.clearCart)
  const total = useCart((state) => state.total)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      })

      if (paymentError) {
        throw paymentError
      }

      clearCart()
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement 
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              name: "",
              email: "",
              phone: "",
            },
          },
        }}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(total)}`
        )}
      </Button>
    </form>
  )
}