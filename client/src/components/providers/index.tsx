"use client";

import { ThemeProvider } from "./theme-provider";
import { PayPalProvider } from "./payment/paypal-provider";
import { AuthProvider } from "./auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nicol-theme">
      <AuthProvider>
        <PayPalProvider>{children}</PayPalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
