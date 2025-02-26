import { Routes, Route } from "react-router-dom";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { HomePage } from "@/pages/Home";
import { MarketplacePage } from "@/pages/Marketplace";
import { BlogPage } from "@/pages/Blog";
import { ContactPage } from "@/pages/Contact";
import { CheckoutPage } from "@/pages/checkout";
import { BlogPostPage } from "@/pages/blog/[id]";

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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            
            {/* Marketplace Admin Routes */}
            <Route path="/admin/marketplace" element={<MarketplaceAdminPage />} />
            <Route path="/admin/marketplace/new" element={<NewMarketplaceItemPage />} />
            <Route path="/admin/marketplace/:id/edit" element={<EditMarketplaceItemPage />} />
            
            {/* Blog Admin Routes */}
            <Route path="/admin/blog" element={<BlogAdminPage />} />
            <Route path="/admin/blog/new" element={<NewBlogPostPage />} />
            <Route path="/admin/blog/:id/edit" element={<EditBlogPostPage />} />
            <Route path="/admin/blog/categories" element={<BlogCategoriesPage />} />
            <Route path="/admin/blog/tags" element={<BlogTagsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Providers>
  );
}

export default App;
