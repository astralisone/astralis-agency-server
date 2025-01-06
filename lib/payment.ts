import { CartItem } from "./store"

export interface PaymentIntent {
  clientSecret: string
  amount: number
  currency: string
}

export async function createPaymentIntent(items: CartItem[]): Promise<PaymentIntent> {
  if (!items.length) {
    throw new Error("Cart is empty")
  }

  const amount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        amount 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Payment initialization failed (${response.status})`)
    }

    if (!data.clientSecret) {
      throw new Error("Invalid payment intent response")
    }

    return {
      clientSecret: data.clientSecret,
      amount: data.amount,
      currency: data.currency
    }
  } catch (error) {
    console.error("Payment initialization error:", error)
    throw error
  }
}