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

function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-background text-foreground relative">
        <div className="fixed inset-0 dots-pattern pointer-events-none" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/index.html" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Providers>
  );
}

export default App;
