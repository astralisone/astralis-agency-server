"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Menu, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { CartSheet } from "@/components/cart/cart-sheet"
import { useAuth } from "@/components/providers/auth-provider"

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

const adminRoutes = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/marketplace",
    label: "Marketplace",
  },
  {
    href: "/admin/blog",
    label: "Blog",
  },
]

export function Navbar() {
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

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
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                )}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartSheet />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    {adminRoutes.map((route) => (
                      <DropdownMenuItem key={route.href} asChild>
                        <Link to={route.href}>{route.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
          
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
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2",
                      location.pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Admin
                  </Link>
                )}
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" onClick={logout} className="mt-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Link to="/login" className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}