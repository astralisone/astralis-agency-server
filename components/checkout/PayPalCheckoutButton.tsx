"use client"

import { useState } from "react"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface PayPalCheckoutButtonProps {
  amount: number
}

export function PayPalCheckoutButton({ amount }: PayPalCheckoutButtonProps) {
  const router = useRouter()
  const clearCart = useCart((state) => state.clearCart)
  const { toast } = useToast()
  const [{ isPending }] = usePayPalScriptReducer()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    try {
      const order = await actions.order.capture()
      if (order.status === "COMPLETED") {
        clearCart()
        toast({
          title: "Payment successful!",
          description: "Your order has been processed successfully.",
        })
        router.push("/checkout/success")
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      console.error("PayPal capture error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPending || isProcessing) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <PayPalButtons
      style={{ 
        layout: "vertical",
        shape: "rect",
        label: "pay"
      }}
      createOrder={(_, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: "USD"
            }
          }]
        })
      }}
      onApprove={handleApprove}
      onError={(err) => {
        toast({
          title: "Payment failed",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive",
        })
        console.error("PayPal error:", err)
      }}
    />
  )
}