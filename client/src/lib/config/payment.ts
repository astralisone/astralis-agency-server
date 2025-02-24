// Default test client ID from PayPal documentation
const TEST_CLIENT_ID = "sb"

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || TEST_CLIENT_ID,
  currency: "USD",
  intent: "capture"
} as const

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
} as const