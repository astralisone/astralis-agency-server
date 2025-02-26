import { useApi } from "@/hooks/useApi";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, FileText, Users, TrendingUp } from "lucide-react";

interface DashboardStats {
  marketplaceItems: number;
  blogPosts: number;
  users: number;
  totalViews: number;
}

export function AdminDashboardPage() {
  // In a real app, we would fetch actual stats from the API
  const { data, error, isLoading } = useApi<{ data: DashboardStats }>('/admin/stats');

  // Fallback data for development
  const stats = data?.data || {
    marketplaceItems: 12,
    blogPosts: 24,
    users: 150,
    totalViews: 10250
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          title="Marketplace Items" 
          value={stats.marketplaceItems.toString()} 
          description="Total products" 
          icon={ShoppingBag}
          isLoading={isLoading}
        />
        <StatsCard 
          title="Blog Posts" 
          value={stats.blogPosts.toString()} 
          description="Published articles" 
          icon={FileText}
          isLoading={isLoading}
        />
        <StatsCard 
          title="Users" 
          value={stats.users.toString()} 
          description="Registered accounts" 
          icon={Users}
          isLoading={isLoading}
        />
        <StatsCard 
          title="Total Views" 
          value={stats.totalViews.toLocaleString()} 
          description="Page impressions" 
          icon={TrendingUp}
          isLoading={isLoading}
        />
      </div>

      {/* Tabs for different data views */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="popular">Popular Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <p>Recent activity will be displayed here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>Most viewed products and articles</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <p>Popular items will be displayed here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Traffic and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <p>Analytics data will be displayed here</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  isLoading?: boolean;
}

function StatsCard({ title, value, description, icon: Icon, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
} 