import { Routes, Route } from "react-router-dom";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { HomePage } from "@/pages/home";
import { MarketplacePage } from "@/pages/Marketplace.tsx";
import { BlogPage } from "@/pages/Blog.tsx";
import { ContactPage } from "@/pages/Contact.tsx";
import { CheckoutPage } from "@/pages/checkout";
import { BlogPostPage } from "@/pages/blog/[id]";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Admin Pages
import { AdminDashboardPage } from "@/pages/admin";
import { MarketplaceAdminPage } from "@/pages/admin/marketplace";
import { NewMarketplaceItemPage } from "@/pages/admin/marketplace/new";
import { EditMarketplaceItemPage } from "@/pages/admin/marketplace/[id]/edit";
import { BlogAdminPage } from "@/pages/admin/blog";
import { NewBlogPostPage } from "@/pages/admin/blog/new";
import { EditBlogPostPage } from "@/pages/admin/blog/[id]/edit";
import { BlogCategoriesPage } from "@/pages/admin/blog/categories";
import { BlogTagsPage } from "@/pages/admin/blog/tags";

function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-background text-foreground relative">
        <div className="fixed inset-0 dots-pattern pointer-events-none" />
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/index.html" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/blog" element={
              <ErrorBoundary>
                <BlogPage />
              </ErrorBoundary>
            } />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Marketplace Admin Routes - Protected */}
            <Route path="/admin/marketplace" element={
              <ProtectedRoute requireAdmin={true}>
                <MarketplaceAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/marketplace/new" element={
              <ProtectedRoute requireAdmin={true}>
                <NewMarketplaceItemPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/marketplace/:id/edit" element={
              <ProtectedRoute requireAdmin={true}>
                <EditMarketplaceItemPage />
              </ProtectedRoute>
            } />
            
            {/* Blog Admin Routes - Protected */}
            <Route path="/admin/blog" element={
              <ProtectedRoute requireAdmin={true}>
                <BlogAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/new" element={
              <ProtectedRoute requireAdmin={true}>
                <NewBlogPostPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/:id/edit" element={
              <ProtectedRoute requireAdmin={true}>
                <EditBlogPostPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/categories" element={
              <ProtectedRoute requireAdmin={true}>
                <BlogCategoriesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/tags" element={
              <ProtectedRoute requireAdmin={true}>
                <BlogTagsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Providers>
  );
}

export default App;
