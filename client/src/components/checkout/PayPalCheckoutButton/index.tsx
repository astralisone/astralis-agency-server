import { usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { PayPalButton } from "./paypal-button"
import { PayPalLoading } from "./loading"
import { usePayPalCheckout } from "./use-paypal-checkout"

interface PayPalCheckoutButtonProps {
  amount: number
}

export function PayPalCheckoutButton({ amount }: PayPalCheckoutButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer()
  const { isProcessing } = usePayPalCheckout()

  if (isPending || isProcessing) {
    return <PayPalLoading />
  }

  return <PayPalButton amount={amount} />
}