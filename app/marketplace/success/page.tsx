import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md text-center px-4">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/marketplace">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}