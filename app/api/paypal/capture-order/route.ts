import { NextResponse } from "next/server"
import { headers } from "next/headers"

const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com"

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const origin = headersList.get("origin") || "http://localhost:3000"
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to capture PayPal order")
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("PayPal capture error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to capture order" },
      { status: 500 }
    )
  }
}