/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}