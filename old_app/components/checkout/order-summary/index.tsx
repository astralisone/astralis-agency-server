import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrderItem } from "./order-item"
import type { CartItem } from "@/lib/store"

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <OrderItem
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
            />
          ))}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}