interface OrderItemProps {
  name: string
  quantity: number
  price: number
}

export function OrderItem({ name, quantity, price }: OrderItemProps) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          Quantity: {quantity}
        </p>
      </div>
      <p className="font-medium">
        ${(price * quantity).toFixed(2)}
      </p>
    </div>
  )
}