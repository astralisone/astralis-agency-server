import express from 'express';
import { PrismaClient } from '@prisma/client';
import { renderSimpleSSRPage, generateMetaTags, getBuildTemplate } from '../../utils/simple-ssr-renderer.js';

const router = express.Router();
const prisma = new PrismaClient();

// Home page SSR
router.get('/', async (req, res, next) => {
  try {
    console.log('SSR: Processing home page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    const metaTags = generateMetaTags({
      title: 'Astralis - Creative Agency & Digital Products',
      description: 'Transform your digital presence with Astralis. We create stunning websites, innovative mobile apps, and powerful digital marketing strategies.',
      url: 'https://astralisone.com/',
      type: 'website'
    });

    // Render React components to string
    const reactHtml = renderSimpleSSRPage('/', null);
    
    // Inject meta tags and rendered content
    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log('SSR: Successfully rendered home page with React content');
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on home page:', error);
    next();
  }
});

// Marketplace listing page SSR
router.get('/marketplace', async (req, res, next) => {
  try {
    console.log('SSR: Processing marketplace page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    // Fetch marketplace data for SSR
    const items = await prisma.marketplaceItem.findMany({
      where: { 
        status: 'AVAILABLE',
        published: true 
      },
      include: {
        category: true,
        tags: true
      },
      orderBy: { createdAt: 'desc' },
      take: 12
    });

    const metaTags = generateMetaTags({
      title: 'Digital Products Marketplace - Astralis',
      description: `Discover ${items.length} premium digital products, templates, and services. Find the perfect solution for your business needs.`,
      url: 'https://astralisone.com/marketplace',
      type: 'website'
    });

    // Render React components to string with data
    const reactHtml = renderSimpleSSRPage('/marketplace', { items });

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log(`SSR: Successfully rendered marketplace page with ${items.length} items and React content`);
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on marketplace page:', error);
    next();
  }
});

// Blog listing page SSR
router.get('/blog', async (req, res, next) => {
  try {
    console.log('SSR: Processing blog page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    // Fetch blog posts for SSR
    const posts = await prisma.post.findMany({
      where: { 
        status: 'PUBLISHED' 
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: true,
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 12
    });

    const metaTags = generateMetaTags({
      title: 'Blog - Latest Insights & Tutorials - Astralis',
      description: `Read our latest ${posts.length} articles about web development, digital marketing, and business growth strategies.`,
      url: 'https://astralisone.com/blog',
      type: 'website'
    });

    // Render React components to string with data
    const reactHtml = renderSimpleSSRPage('/blog', { posts });

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log(`SSR: Successfully rendered blog page with ${posts.length} posts and React content`);
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on blog page:', error);
    next();
  }
});

// Blog post detail page SSR
router.get('/blog/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`SSR: Processing blog post page for ID: ${id} with full React rendering`);
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    // Fetch specific blog post
    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ],
        status: 'PUBLISHED'
      },
      include: {
        author: { select: { name: true, avatar: true } },
        category: true,
        tags: true,
        _count: { select: { likes: true, comments: true } }
      }
    });

    if (!post) {
      console.log(`SSR: Blog post not found: ${id}`);
      return next();
    }

    const metaTags = generateMetaTags({
      title: `${post.title} - Astralis Blog`,
      description: post.excerpt || post.content?.substring(0, 160) || post.title,
      image: post.featuredImage,
      url: `https://astralisone.com/blog/${post.slug || post.id}`,
      type: 'article'
    });

    // Render React components to string with data
    const reactHtml = renderSimpleSSRPage(`/blog/${id}`, { post });

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log(`SSR: Successfully rendered blog post: ${post.title} with React content`);
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on blog post page:', error);
    next();
  }
});

// Contact page SSR
router.get('/contact', async (req, res, next) => {
  try {
    console.log('SSR: Processing contact page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    const metaTags = generateMetaTags({
      title: 'Contact Us - Get In Touch - Astralis',
      description: 'Ready to start your next project? Contact Astralis today for a free consultation. We\'re here to help bring your vision to life.',
      url: 'https://astralisone.com/contact',
      type: 'website'
    });

    // Render React components to string
    const reactHtml = renderSimpleSSRPage('/contact', null);

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log('SSR: Successfully rendered contact page with React content');
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on contact page:', error);
    next();
  }
});

// Login page SSR
router.get('/login', async (req, res, next) => {
  try {
    console.log('SSR: Processing login page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    const metaTags = generateMetaTags({
      title: 'Login - Astralis',
      description: 'Sign in to your Astralis account to access your dashboard and manage your projects.',
      url: 'https://astralisone.com/login',
      type: 'website'
    });

    // Render React components to string
    const reactHtml = renderSimpleSSRPage('/login', null);

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log('SSR: Successfully rendered login page with React content');
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on login page:', error);
    next();
  }
});

// Register page SSR
router.get('/register', async (req, res, next) => {
  try {
    console.log('SSR: Processing register page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    const metaTags = generateMetaTags({
      title: 'Register - Create Account - Astralis',
      description: 'Join Astralis today! Create your free account to access exclusive digital products and services.',
      url: 'https://astralisone.com/register',
      type: 'website'
    });

    // Render React components to string
    const reactHtml = renderSimpleSSRPage('/register', null);

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log('SSR: Successfully rendered register page with React content');
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on register page:', error);
    next();
  }
});

// Marketplace product page SSR (handles both /marketplace/:slug and /marketplace/product/:slug)
router.get('/marketplace/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    console.log(`SSR: Processing marketplace product page for slug: ${slug} with full React rendering`);
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    // Check if this is a product slug by looking for a product
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

    // If no product found, this might be a different route, let it fall through
    if (!item || item.status !== 'AVAILABLE' || !item.published) {
      console.log(`SSR: Product not found for slug: ${slug}, falling back`);
      return next();
    }

    const averageRating = item.reviews.length > 0 
      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
      : 0;

    const metaTags = generateMetaTags({
      title: `${item.title} - Astralis Marketplace`,
      description: item.description?.substring(0, 160) || `${item.title} available at Astralis One`,
      image: item.imageUrl,
      url: `https://astralisone.com/marketplace/${slug}`,
      type: 'product'
    });

    // Render React components to string with data
    const reactHtml = renderSimpleSSRPage(`/marketplace/${slug}`, { item });

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log(`SSR: Successfully rendered marketplace product page for: ${item.title} with React content`);
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on marketplace product page:', error);
    next();
  }
});

// Checkout page SSR
router.get('/checkout', async (req, res, next) => {
  try {
    console.log('SSR: Processing checkout page with full React rendering');
    
    const template = getBuildTemplate();
    if (!template) {
      console.log('SSR: Build template not found, falling back to client');
      return next();
    }

    const metaTags = generateMetaTags({
      title: 'Checkout - Complete Your Purchase - Astralis',
      description: 'Complete your purchase securely with our streamlined checkout process. Your digital products await!',
      url: 'https://astralisone.com/checkout',
      type: 'website'
    });

    // Render React components to string
    const reactHtml = renderSimpleSSRPage('/checkout', null);

    const html = template
      .replace('<head>', `<head>${metaTags}`)
      .replace('<div id="root"></div>', `<div id="root">${reactHtml}</div>`);
    
    console.log('SSR: Successfully rendered checkout page with React content');
    res.send(html);
    
  } catch (error) {
    console.error('SSR Error on checkout page:', error);
    next();
  }
});

export default router;