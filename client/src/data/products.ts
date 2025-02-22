import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'astro-template-1',
    name: 'Astro Portfolio Template',
    description: 'A modern, responsive portfolio template built with Astro and TailwindCSS.',
    price: 49.99,
    image: '/products/portfolio-template.jpg',
    features: [
      'Responsive design',
      'Dark/Light mode',
      'Blog section',
      'Project showcase',
      'Contact form',
      'SEO optimized'
    ],
    category: 'template',
    status: 'available'
  },
  {
    id: 'analytics-plugin',
    name: 'Analytics Dashboard Plugin',
    description: 'Advanced analytics dashboard for tracking website performance and user behavior.',
    price: 29.99,
    image: '/products/analytics-dashboard.jpg',
    features: [
      'Real-time tracking',
      'User behavior analysis',
      'Performance metrics',
      'Custom reports',
      'Data export',
      'API integration'
    ],
    category: 'plugin',
    status: 'available'
  },
  {
    id: 'seo-service',
    name: 'SEO Optimization Service',
    description: 'Comprehensive SEO optimization service to improve your website\'s search engine ranking.',
    price: 299.99,
    image: '/products/seo-service.jpg',
    features: [
      'Keyword research',
      'On-page optimization',
      'Technical SEO audit',
      'Content strategy',
      'Link building',
      'Monthly reports'
    ],
    category: 'service',
    status: 'available'
  }
]; 