import React from 'react';
import { renderToString } from 'react-dom/server';
import { Routes, Route } from 'react-router-dom';
// @ts-ignore - StaticRouter might have import issues
import { StaticRouter } from 'react-router-dom/server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to generate meta tags
export const generateMetaTags = (data: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}) => {
  const { title, description, image, url, type = 'website' } = data;
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image || 'https://astralisone.com/og-default.jpg'}">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${image || 'https://astralisone.com/og-default.jpg'}">
    <link rel="canonical" href="${url}">
  `;
};

// Helper function to find build template
export const getBuildTemplate = (): string | null => {
  const possiblePaths = [
    path.resolve(__dirname, '../../../../build/index.html'),
    path.resolve(__dirname, '../../../build/index.html'),
    path.resolve(__dirname, '../../build/index.html'),
    path.join(process.cwd(), 'build/index.html'),
    path.join(process.cwd(), 'client/dist/index.html')
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return fs.readFileSync(testPath, 'utf-8');
    }
  }
  
  return null;
};

// Simple server-side components for SSR
const HomePage = ({ data }: { data?: any }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold mb-6">Astralis - Creative Agency & Digital Products</h1>
    <p className="text-lg mb-8">Transform your digital presence with Astralis. We create stunning websites, innovative mobile apps, and powerful digital marketing strategies.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Web Development</h3>
        <p>Custom websites and web applications built with modern technologies.</p>
      </div>
      <div className="bg-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Digital Marketing</h3>
        <p>Strategic marketing campaigns to grow your online presence.</p>
      </div>
      <div className="bg-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">UI/UX Design</h3>
        <p>Beautiful and intuitive designs that engage your users.</p>
      </div>
    </div>
  </div>
);

const MarketplacePage = ({ data }: { data?: any }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold mb-6">Digital Products Marketplace</h1>
    <p className="text-lg mb-8">Discover {data?.items?.length || 'premium'} digital products, templates, and services.</p>
    {data?.items?.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.slice(0, 6).map((item: any) => (
          <div key={item.id} className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-muted-foreground mb-4">{item.description?.substring(0, 100)}...</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${item.price}</span>
              <span className="text-sm text-muted-foreground">{item.category?.name}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const BlogPage = ({ data }: { data?: any }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold mb-6">Blog - Latest Insights & Tutorials</h1>
    <p className="text-lg mb-8">Read our latest {data?.posts?.length || ''} articles about web development, digital marketing, and business growth.</p>
    {data?.posts?.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.posts.slice(0, 4).map((post: any) => (
          <article key={post.id} className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
            <p className="text-muted-foreground mb-4">{post.excerpt || post.content?.substring(0, 120)}...</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>By {post.author?.name}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);

const BlogPostPage = ({ data }: { data?: any }) => (
  <div className="container mx-auto px-4 py-8">
    {data?.post && (
      <article>
        <h1 className="text-4xl font-bold mb-4">{data.post.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <span>By {data.post.author?.name}</span>
          <span>•</span>
          <span>{new Date(data.post.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{data.post.category?.name}</span>
        </div>
        {data.post.featuredImage && (
          <img 
            src={data.post.featuredImage} 
            alt={data.post.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <div className="prose max-w-none">
          <p>{data.post.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: data.post.content?.substring(0, 500) + '...' }} />
        </div>
      </article>
    )}
  </div>
);

const ContactPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold mb-6">Contact Us - Get In Touch</h1>
    <p className="text-lg mb-8">Ready to start your next project? Contact Astralis today for a free consultation.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">hello@astralis.one</p>
          </div>
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-muted-foreground">123 Digital Ave, Tech City, TC 12345</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full p-2 border border-border rounded-md"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full p-2 border border-border rounded-md"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea 
              id="message" 
              rows={4}
              className="w-full p-2 border border-border rounded-md"
              placeholder="Tell us about your project..."
            />
          </div>
          <button 
            type="submit" 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

const ProductPage = ({ data }: { data?: any }) => (
  <div className="container mx-auto px-4 py-8">
    {data?.item && (
      <div>
        <h1 className="text-4xl font-bold mb-4">{data.item.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {data.item.imageUrl && (
              <img 
                src={data.item.imageUrl} 
                alt={data.item.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-lg mb-4">{data.item.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">${data.item.price}</span>
              <span className="bg-secondary px-3 py-1 rounded-full text-sm">{data.item.category?.name}</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <ul className="space-y-2">
              <li><strong>Category:</strong> {data.item.category?.name}</li>
              <li><strong>Price:</strong> ${data.item.price}</li>
              <li><strong>Status:</strong> {data.item.status}</li>
              {data.item.seller && <li><strong>Seller:</strong> {data.item.seller.name}</li>}
            </ul>
            <button className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 w-full">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground">
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">Astralis</a>
          <div className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="/marketplace" className="hover:text-primary">Marketplace</a>
            <a href="/blog" className="hover:text-primary">Blog</a>
            <a href="/contact" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </div>
    </nav>
    <main>
      {children}
    </main>
    <footer className="border-t bg-muted/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 Astralis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

// Main SSR App component
const SSRApp = ({ location, data }: { location: string; data?: any }) => (
  <StaticRouter location={location}>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route path="/marketplace" element={<MarketplacePage data={data} />} />
        <Route path="/marketplace/:slug" element={<ProductPage data={data} />} />
        <Route path="/marketplace/product/:slug" element={<ProductPage data={data} />} />
        <Route path="/blog" element={<BlogPage data={data} />} />
        <Route path="/blog/:id" element={<BlogPostPage data={data} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Login</h1></div>} />
        <Route path="/register" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Create Account</h1></div>} />
        <Route path="/checkout" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Checkout</h1></div>} />
      </Routes>
    </Layout>
  </StaticRouter>
);

export const renderSSRPage = (location: string, data?: any): string => {
  try {
    const app = React.createElement(SSRApp, { location, data });
    return renderToString(app);
  } catch (error) {
    console.error('SSR Render Error:', error);
    return '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold">Loading...</h1></div>';
  }
};