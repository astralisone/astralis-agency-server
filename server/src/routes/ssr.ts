import express from 'express';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

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
    <link rel="canonical" href="${url}">
  `;
};

router.get('/marketplace/product/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        agency: { select: { id: true, name: true, logo: true } }
      }
    });

    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).send('<h1>Product Not Found</h1>');
    }

    const template = fs.readFileSync(
      path.resolve(__dirname, '../../../build/index.html'),
      'utf-8'
    );

    const metaTags = generateMetaTags({
      title: `${product.name} - Astralis One Marketplace`,
      description: product.description?.substring(0, 160) || `${product.name} available at Astralis One`,
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

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://astralisone.com';
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/marketplace</loc><priority>0.9</priority></url>
  ${products.map(product => 
    `<url><loc>${baseUrl}/marketplace/product/${product.slug}</loc><priority>0.8</priority></url>`
  ).join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
