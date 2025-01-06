"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const paypalInitialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
  currency: "USD",
  intent: "capture",
}

interface PayPalProviderProps {
  children: React.ReactNode
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalInitialOptions}>
      {children}
    </PayPalScriptProvider>
  )
}