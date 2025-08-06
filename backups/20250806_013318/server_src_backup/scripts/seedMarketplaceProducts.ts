import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import prisma from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function createCategories() {
  console.log('Creating marketplace categories...');
  
  const categories = [
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Custom web development services and solutions'
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX design, branding, and visual identity services'
    },
    {
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'SEO, PPC, social media, and content marketing services'
    },
    {
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'iOS and Android app development services'
    },
    {
      name: 'Consulting',
      slug: 'consulting',
      description: 'Strategic consulting and business development services'
    },
    {
      name: 'Automation',
      slug: 'automation',
      description: 'Workflow automation and integration services'
    }
  ];

  const createdCategories = {};
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData
    });
    createdCategories[categoryData.slug] = category;
  }
  
  return createdCategories;
}

async function createTags() {
  console.log('Creating marketplace tags...');
  
  const tags = [
    { name: 'React', slug: 'react' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'UI/UX', slug: 'ui-ux' },
    { name: 'SEO', slug: 'seo' },
    { name: 'Branding', slug: 'branding' },
    { name: 'E-commerce', slug: 'ecommerce' },
    { name: 'Mobile App', slug: 'mobile-app' },
    { name: 'Automation', slug: 'automation' },
    { name: 'Content Marketing', slug: 'content-marketing' },
    { name: 'PPC', slug: 'ppc' },
    { name: 'Email Marketing', slug: 'email-marketing' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'Subscription', slug: 'subscription' },
    { name: 'Consultation', slug: 'consultation' }
  ];

  const createdTags = {};
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData
    });
    createdTags[tagData.slug] = tag;
  }
  
  return createdTags;
}

async function getAdminUser() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@astralis.one' }
  });
  
  if (!admin) {
    throw new Error('Admin user not found. Please run the main seed script first.');
  }
  
  return admin;
}

const marketplaceProducts = [
  {
    title: 'Brand Identity Design Package',
    slug: 'brand-identity-design-package',
    description: 'Complete brand identity package including logo design, color palette, typography, brand guidelines, and marketing materials. Perfect for startups and businesses looking to establish a strong visual identity that resonates with their target audience.',
    price: 2200.00,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80',
    categorySlug: 'design',
    stock: 8,
    featured: true,
    specifications: {
      deliverables: ['Logo design (3 concepts)', 'Color palette', 'Typography selection', 'Brand guidelines', 'Business card design', 'Letterhead design'],
      timeline: '2-3 weeks',
      revisions: '3 rounds included',
      formats: ['Vector files (AI, EPS)', 'PNG/JPG exports', 'PDF guidelines']
    },
    features: [
      'Professional logo design with 3 initial concepts',
      'Complete color palette and typography guide',
      'Comprehensive brand guidelines document',
      'Business card and letterhead designs',
      'Vector files and various format exports',
      '3 rounds of revisions included',
      'Source files and brand guidelines PDF'
    ],
    tags: ['branding', 'ui-ux']
  },
  {
    title: 'Social Media Management Pro',
    slug: 'social-media-management-pro',
    description: 'Comprehensive social media management service including content creation, scheduling, community management, and monthly analytics reports. Boost your online presence with professional social media strategy and execution.',
    price: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    categorySlug: 'digital-marketing',
    stock: 10,
    featured: true,
    specifications: {
      platforms: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
      posting_frequency: '5-7 posts per week per platform',
      content_types: ['Graphics', 'Videos', 'Carousels', 'Stories'],
      billing: 'Monthly subscription',
      includes: ['Content calendar', 'Analytics reports', 'Community management']
    },
    features: [
      'Daily content creation and posting',
      'Professional graphic design for posts',
      'Community management and engagement',
      'Monthly performance analytics reports',
      'Content calendar planning',
      'Hashtag research and optimization',
      'Cross-platform posting and scheduling'
    ],
    tags: ['social-media', 'content-marketing', 'subscription']
  },
  {
    title: 'Email Marketing Setup & Automation',
    slug: 'email-marketing-setup-automation',
    description: 'Complete email marketing setup including platform configuration, automated sequences, lead magnets, and template designs. Turn your email list into a revenue-generating machine with professional automation workflows.',
    price: 1650.00,
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    categorySlug: 'digital-marketing',
    stock: 12,
    featured: false,
    specifications: {
      platforms: ['Mailchimp', 'ConvertKit', 'ActiveCampaign', 'Klaviyo'],
      automations: ['Welcome series', 'Abandoned cart', 'Re-engagement', 'Product recommendations'],
      timeline: '2-4 weeks',
      includes: ['Setup', 'Templates', 'Sequences', 'Testing']
    },
    features: [
      'Email platform setup and configuration',
      'Custom email template designs',
      'Automated email sequences (welcome, nurture, sales)',
      'Lead magnet creation and integration',
      'Segmentation strategy implementation',
      'A/B testing setup for optimization',
      'Performance tracking and analytics'
    ],
    tags: ['email-marketing', 'automation']
  },
  {
    title: 'E-commerce Store Development',
    slug: 'ecommerce-store-development',
    description: 'Full-featured e-commerce store development with payment integration, inventory management, and mobile optimization. Built with modern technologies for scalability and performance, including admin dashboard and customer management.',
    price: 4500.00,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    categorySlug: 'web-development',
    stock: 3,
    featured: true,
    specifications: {
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe/PayPal'],
      features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order management'],
      timeline: '6-10 weeks',
      hosting: 'Deployment assistance included'
    },
    features: [
      'Modern React-based storefront',
      'Complete product catalog management',
      'Secure payment processing (Stripe/PayPal)',
      'Inventory and order management system',
      'Customer account and wishlist functionality',
      'Mobile-responsive design',
      'Admin dashboard for store management',
      'SEO optimization and performance tuning'
    ],
    tags: ['react', 'nodejs', 'ecommerce']
  },
  {
    title: 'Mobile App Development (iOS & Android)',
    slug: 'mobile-app-development-ios-android',
    description: 'Native mobile app development for both iOS and Android platforms. From concept to app store deployment, we handle the entire development process including UI/UX design, backend integration, and post-launch support.',
    price: 8500.00,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    categorySlug: 'mobile-development',
    stock: 2,
    featured: true,
    specifications: {
      platforms: ['iOS (Swift)', 'Android (Kotlin)', 'React Native (optional)'],
      backend: 'API development and integration',
      timeline: '10-16 weeks',
      includes: ['App store deployment', 'Testing', '3 months support']
    },
    features: [
      'Native iOS and Android app development',
      'Custom UI/UX design for mobile experience',
      'Backend API development and integration',
      'Push notifications and real-time features',
      'App store optimization and deployment',
      'Comprehensive testing across devices',
      'Post-launch support and maintenance',
      'Analytics integration for user insights'
    ],
    tags: ['mobile-app', 'typescript']
  },
  {
    title: 'Content Writing Services (Monthly)',
    slug: 'content-writing-services-monthly',
    description: 'Professional content writing services including blog posts, website copy, social media content, and email newsletters. SEO-optimized content that engages your audience and drives conversions.',
    price: 750.00,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    categorySlug: 'digital-marketing',
    stock: 15,
    featured: false,
    specifications: {
      content_types: ['Blog posts', 'Website copy', 'Social media content', 'Email newsletters'],
      word_count: '4 blog posts (800-1200 words each)',
      seo: 'Keyword research and optimization included',
      billing: 'Monthly subscription'
    },
    features: [
      '4 high-quality blog posts per month',
      'SEO keyword research and optimization',
      'Social media post content creation',
      'Email newsletter writing',
      'Content calendar and strategy planning',
      'Plagiarism-free, original content',
      'Multiple revisions included'
    ],
    tags: ['content-marketing', 'seo', 'subscription']
  },
  {
    title: 'PPC Campaign Management',
    slug: 'ppc-campaign-management',
    description: 'Professional Google Ads and Facebook Ads campaign management including setup, optimization, and monthly reporting. Maximize your ROI with data-driven advertising strategies and continuous optimization.',
    price: 1200.00,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    categorySlug: 'digital-marketing',
    stock: 8,
    featured: false,
    specifications: {
      platforms: ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads'],
      management_fee: 'Plus 15% of ad spend',
      includes: ['Campaign setup', 'Ad creation', 'Optimization', 'Reporting'],
      billing: 'Monthly subscription'
    },
    features: [
      'Complete campaign setup and configuration',
      'Keyword research and audience targeting',
      'Ad creative development and testing',
      'Daily monitoring and optimization',
      'Conversion tracking setup',
      'Monthly performance reports and insights',
      'Landing page recommendations',
      'Budget management and ROI optimization'
    ],
    tags: ['ppc', 'automation', 'subscription']
  },
  {
    title: 'Website Maintenance & Support',
    slug: 'website-maintenance-support',
    description: 'Comprehensive website maintenance service including security updates, performance optimization, backup management, and technical support. Keep your website running smoothly with proactive maintenance and monitoring.',
    price: 199.00,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    categorySlug: 'web-development',
    stock: 25,
    featured: false,
    specifications: {
      includes: ['Security updates', 'Performance monitoring', 'Backups', 'Technical support'],
      response_time: '2-hour response during business hours',
      uptime_monitoring: '24/7 monitoring included',
      billing: 'Monthly subscription'
    },
    features: [
      'Regular security updates and patches',
      'Performance monitoring and optimization',
      'Automated daily backups',
      'Malware scanning and removal',
      '24/7 uptime monitoring',
      'Technical support and troubleshooting',
      'Monthly performance reports',
      'Content updates (up to 2 hours/month)'
    ],
    tags: ['subscription', 'automation']
  },
  {
    title: 'Professional Logo Design',
    slug: 'professional-logo-design',
    description: 'Custom logo design service with multiple concepts, unlimited revisions, and complete file package. Create a memorable brand identity that perfectly represents your business values and attracts your target audience.',
    price: 650.00,
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    categorySlug: 'design',
    stock: 20,
    featured: false,
    specifications: {
      concepts: '5 initial logo concepts',
      revisions: 'Unlimited revisions',
      timeline: '1-2 weeks',
      files: ['Vector files (AI, EPS)', 'PNG/JPG exports', 'Black & white versions']
    },
    features: [
      '5 unique logo concepts to choose from',
      'Unlimited revisions until satisfied',
      'Vector files for scalability',
      'Multiple file formats (AI, EPS, PNG, JPG)',
      'Black and white versions included',
      'Social media and favicon sizes',
      'Commercial usage rights included'
    ],
    tags: ['branding', 'ui-ux']
  },
  {
    title: 'Digital Marketing Strategy Consultation',
    slug: 'digital-marketing-strategy-consultation',
    description: 'Comprehensive digital marketing strategy consultation including competitor analysis, audience research, channel recommendations, and actionable marketing plan. Get expert guidance to accelerate your business growth.',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    categorySlug: 'consulting',
    stock: 10,
    featured: false,
    specifications: {
      session_length: '2-hour strategy session',
      deliverables: ['Strategy document', 'Competitor analysis', 'Action plan'],
      follow_up: '1-hour follow-up call after 30 days',
      format: 'Video call or in-person (local)'
    },
    features: [
      'Comprehensive business and competitor analysis',
      'Target audience research and persona development',
      'Multi-channel marketing strategy development',
      'Budget allocation and ROI projections',
      'Implementation timeline and milestones',
      'Tool and platform recommendations',
      'Detailed action plan with priorities',
      '30-day follow-up consultation call'
    ],
    tags: ['consultation', 'seo', 'social-media']
  }
];

async function seedMarketplaceProducts() {
  try {
    console.log('🌱 Starting marketplace products seeding...');
    
    // Get admin user
    const admin = await getAdminUser();
    console.log('✅ Found admin user');
    
    // Create categories and tags
    const categories = await createCategories();
    const tags = await createTags();
    console.log('✅ Categories and tags created/updated');
    
    console.log('🛍️  Creating marketplace products...');
    
    for (const productData of marketplaceProducts) {
      const category = categories[productData.categorySlug];
      if (!category) {
        console.error(`Category not found: ${productData.categorySlug}`);
        continue;
      }
      
      // Create the product
      const product = await prisma.marketplaceItem.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          imageUrl: productData.imageUrl,
          status: 'AVAILABLE',
          categoryId: category.id,
          sellerId: admin.id,
          specifications: productData.specifications,
          features: productData.features,
          stock: productData.stock,
          featured: productData.featured || false,
          published: true
        }
      });
      
      // Connect tags
      if (productData.tags && productData.tags.length > 0) {
        const tagConnections = productData.tags
          .map(tagSlug => tags[tagSlug])
          .filter(tag => tag)
          .map(tag => ({ id: tag.id }));
          
        if (tagConnections.length > 0) {
          await prisma.marketplaceItem.update({
            where: { id: product.id },
            data: {
              tags: {
                connect: tagConnections
              }
            }
          });
        }
      }
      
      console.log(`✅ Created product: ${product.title}`);
    }
    
    console.log('🎉 Marketplace products seeding completed successfully!');
    console.log(`📊 Created ${marketplaceProducts.length} new products`);
    console.log('💰 Price range: $199 - $8,500');
    console.log('🏷️  Categories: Design, Development, Marketing, Mobile, Consulting, Automation');
    console.log('⭐ Featured products: 4 out of 10');
    
  } catch (error) {
    console.error('❌ Error seeding marketplace products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMarketplaceProducts()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedMarketplaceProducts;