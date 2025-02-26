import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { 
      href: "/admin", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      active: location.pathname === "/admin"
    },
    { 
      href: "/admin/marketplace", 
      label: "Marketplace", 
      icon: ShoppingBag,
      active: location.pathname.startsWith("/admin/marketplace")
    },
    { 
      href: "/admin/blog", 
      label: "Blog", 
      icon: FileText,
      active: location.pathname.startsWith("/admin/blog")
    },
    { 
      href: "/admin/users", 
      label: "Users", 
      icon: Users,
      active: location.pathname.startsWith("/admin/users")
    },
    { 
      href: "/admin/settings", 
      label: "Settings", 
      icon: Settings,
      active: location.pathname.startsWith("/admin/settings")
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <Separator />
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.active ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <Button variant="outline" className="w-full justify-start text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 