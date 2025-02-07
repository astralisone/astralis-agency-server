import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
  typescript: true,
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { message: "Stripe is not properly configured" },
      { status: 500 }
    )
  }

  try {
    const headersList = headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    const { items, amount } = await req.json()

    if (!items?.length || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: `order_${Date.now()}`,
        items: JSON.stringify(items)
      }
    })

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      }
    )
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Payment initialization failed"
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  const headersList = headers()
  const origin = headersList.get("origin") || "http://localhost:3000"

  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  )
}