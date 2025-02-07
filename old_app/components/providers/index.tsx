"use client"

import { ThemeProvider } from './theme-provider'
import { PayPalProvider } from './payment/paypal-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="astralis-theme">
      <PayPalProvider>
        {children}
      </PayPalProvider>
    </ThemeProvider>
  )
}