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

// SSR for marketplace product pages
router.get('/marketplace/product/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
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
      return res.status(404).send('<h1>Product Not Found</h1>');
    }

    const buildPath = path.resolve(__dirname, '../../../../build/index.html');
    
    if (!fs.existsSync(buildPath)) {
      return res.status(500).send('<h1>Build files not found</h1>');
    }

    const template = fs.readFileSync(buildPath, 'utf-8');

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
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('<h1>Server Error</h1>');
  }
});

// Generate sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
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
  const robots = `User-agent: *
Allow: /

Sitemap: https://astralisone.com/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

export default router;
