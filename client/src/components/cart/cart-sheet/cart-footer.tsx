"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface CartFooterProps {
  total: number;
  isLoading: boolean;
  onCheckout: () => void;
}

export function CartFooter({ total, isLoading, onCheckout }: CartFooterProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={onCheckout}
        disabled={isLoading || total === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Checkout"
        )}
      </Button>
    </div>
  );
}
