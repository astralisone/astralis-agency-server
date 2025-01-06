"use client"

import { ThemeProvider } from '@/components/theme-provider'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const paypalOptions = {
  "client-id": "test",
  currency: "USD",
  intent: "capture",
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PayPalScriptProvider options={paypalOptions}>
        {children}
      </PayPalScriptProvider>
    </ThemeProvider>
  )
}