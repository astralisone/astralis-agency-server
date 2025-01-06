import { CartItem } from "./store"

export interface CheckoutResponse {
  url: string
  sessionId?: string
  error?: string
}

export async function createCheckoutSession(items: CartItem[]): Promise<CheckoutResponse> {
  if (!items.length) {
    throw new Error("Cart is empty")
  }

  try {
    const response = await fetch("/api/checkout", {
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
        }))
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Payment initialization failed (${response.status})`)
    }

    if (!data.url) {
      throw new Error("Invalid checkout session response")
    }

    return {
      url: data.url,
      sessionId: data.sessionId
    }
  } catch (error) {
    return {
      url: "",
      error: error instanceof Error ? error.message : "Failed to create checkout session"
    }
  }
}