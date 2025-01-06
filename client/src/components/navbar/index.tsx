"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { CartSheet } from "@/components/cart/cart-sheet"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/marketplace",
    label: "Marketplace",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/contact",
    label: "Contact",
  },
]

export function Navbar() {
  const location = useLocation()

  return (
    <header className="py-6 px-4 border-b border-muted/20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            ASTRALIS
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.href === location.pathname ? "text-primary" : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartSheet />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card">
              <SheetTitle>Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2",
                      route.href === location.pathname ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}