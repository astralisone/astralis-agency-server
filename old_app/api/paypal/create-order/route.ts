import { NextResponse } from "next/server"
import { headers } from "next/headers"

if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PayPal credentials")
}

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
    const { items } = await req.json()

    if (!items?.length) {
      return NextResponse.json(
        { message: "No items provided" },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: items
                .reduce((total: number, item: any) => total + item.price * item.quantity, 0)
                .toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: items
                    .reduce((total: number, item: any) => total + item.price * item.quantity, 0)
                    .toFixed(2),
                },
              },
            },
            items: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: "USD",
                value: item.price.toFixed(2),
              },
            })),
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create PayPal order")
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("PayPal order creation error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    )
  }
}