import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePayPalCheckout } from "./use-paypal-checkout";

interface PayPalButtonProps {
  amount: number;
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const { handleApprove, handleError } = usePayPalCheckout();

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "rect",
        label: "pay",
      }}
      createOrder={(_, actions) => {
        try {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2),
                  currency_code: "USD",
                },
              },
            ],
          });
        } catch (error) {
          console.error("Error creating PayPal order:", error);
          throw error;
        }
      }}
      onApprove={handleApprove}
      onError={handleError}
    />
  );
}
