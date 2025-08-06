import express from 'express';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

const generateMetaTags = (data: {
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

// Simple SSR test endpoint
router.get('/ssr-test', (req, res) => {
  console.log('SSR: Test endpoint hit');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>SSR Test - Working!</title>
      <meta name="description" content="This page is server-side rendered">
    </head>
    <body>
      <h1>SSR is Working!</h1>
      <p>This page was rendered on the server at: ${new Date().toISOString()}</p>
      <p>If you can see this, SSR is functioning correctly.</p>
      <a href="/marketplace/product/digital-marketing-strategy-consultation">Test Product Page</a>
    </body>
    </html>
  `);
});

// SSR for marketplace product pages - SPECIFIC ROUTE
router.get('/marketplace/product/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    console.log(`SSR: Processing product page for slug: ${slug}`);
    
    const item = await prisma.marketplaceItem.findUnique({
      where: { slug },
      include: {
        category: true,
        seller: { select: { id: true, name: true, avatar: true } },
        reviews: {
          where: { status: 'APPROVED' },
          select: { rating: true }
        }
      }
    });

    if (!item || item.status !== 'AVAILABLE' || !item.published) {
      console.log(`SSR: Product not found or unavailable: ${slug}`);
      return next(); // Let the client handle 404
    }

    // Try multiple possible paths for the build file
    const possiblePaths = [
      path.resolve(__dirname, '../../../../build/index.html'),
      path.resolve(__dirname, '../../../build/index.html'),
      path.resolve(__dirname, '../../build/index.html'),
      path.join(process.cwd(), 'build/index.html'),
      path.join(process.cwd(), 'client/dist/index.html')
    ];

    let template = null;
    let buildPath = null;

    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        buildPath = testPath;
        template = fs.readFileSync(testPath, 'utf-8');
        break;
      }
    }

    if (!template) {
      console.error('SSR: Build file not found in any of the expected locations:', possiblePaths);
      return next(); // Fall back to client-side rendering
    }

    console.log(`SSR: Using build file: ${buildPath}`);

    const averageRating = item.reviews.length > 0 
      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
      : 0;

    const metaTags = generateMetaTags({
      title: `${item.title} - Astralis One Marketplace`,
      description: item.description?.substring(0, 160) || `${item.title} available at Astralis One`,
      image: item.imageUrl,
      url: `https://astralisone.com/marketplace/product/${slug}`,
      type: 'product'
    });

    const html = template.replace('<head>', `<head>${metaTags}`);
    
    console.log(`SSR: Successfully rendered product page for: ${item.title}`);
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error:', error);
    next(); // Fall back to client-side rendering
  }
});

// Generate sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    console.log('SSR: Generating sitemap.xml');
    const baseUrl = 'https://astralisone.com';
    
    const [items, posts] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where: { status: 'AVAILABLE', published: true },
        select: { slug: true, updatedAt: true }
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true }
      })
    ]);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/marketplace</loc>
    <priority>0.9</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <priority>0.8</priority>
    <changefreq>daily</changefreq>
  </url>
  ${items.map(item => 
    `<url>
      <loc>${baseUrl}/marketplace/product/${item.slug}</loc>
      <priority>0.8</priority>
      <lastmod>${item.updatedAt.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>`
  ).join('')}
  ${posts.map(post => 
    `<url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <priority>0.7</priority>
      <lastmod>${post.updatedAt.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
    </url>`
  ).join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  console.log('SSR: Serving robots.txt');
  const robots = `User-agent: *
Allow: /

Sitemap: https://astralisone.com/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

export default router;
