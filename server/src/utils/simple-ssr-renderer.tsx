import React from 'react';
import { renderToString } from 'react-dom/server';
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

// Simple page components for SSR
const HomePage = ({ data }: { data?: any }) => (
  React.createElement('div', { className: 'min-h-screen bg-background text-foreground' }, [
    React.createElement('nav', { 
      key: 'nav',
      className: 'border-b bg-background/80 backdrop-blur-md sticky top-0 z-50' 
    }, [
      React.createElement('div', { 
        key: 'nav-container',
        className: 'container mx-auto px-4 py-4' 
      }, [
        React.createElement('div', { 
          key: 'nav-content',
          className: 'flex items-center justify-between' 
        }, [
          React.createElement('a', { 
            key: 'logo',
            href: '/', 
            className: 'text-2xl font-bold' 
          }, 'Astralis'),
          React.createElement('div', { 
            key: 'nav-links',
            className: 'hidden md:flex space-x-6' 
          }, [
            React.createElement('a', { key: 'home', href: '/', className: 'hover:text-primary' }, 'Home'),
            React.createElement('a', { key: 'marketplace', href: '/marketplace', className: 'hover:text-primary' }, 'Marketplace'),
            React.createElement('a', { key: 'blog', href: '/blog', className: 'hover:text-primary' }, 'Blog'),
            React.createElement('a', { key: 'contact', href: '/contact', className: 'hover:text-primary' }, 'Contact')
          ])
        ])
      ])
    ]),
    React.createElement('main', { key: 'main' }, [
      React.createElement('div', { 
        key: 'hero',
        className: 'container mx-auto px-4 py-16' 
      }, [
        React.createElement('h1', { 
          key: 'title',
          className: 'text-4xl font-bold mb-6' 
        }, 'Astralis - Creative Agency & Digital Products'),
        React.createElement('p', { 
          key: 'description',
          className: 'text-lg mb-8' 
        }, 'Transform your digital presence with Astralis. We create stunning websites, innovative mobile apps, and powerful digital marketing strategies.'),
        React.createElement('div', { 
          key: 'services',
          className: 'grid grid-cols-1 md:grid-cols-3 gap-6' 
        }, [
          React.createElement('div', { 
            key: 'service1',
            className: 'bg-card p-6 rounded-lg border' 
          }, [
            React.createElement('h3', { key: 'service1-title', className: 'text-xl font-semibold mb-3' }, 'Web Development'),
            React.createElement('p', { key: 'service1-desc' }, 'Custom websites and web applications built with modern technologies.')
          ]),
          React.createElement('div', { 
            key: 'service2',
            className: 'bg-card p-6 rounded-lg border' 
          }, [
            React.createElement('h3', { key: 'service2-title', className: 'text-xl font-semibold mb-3' }, 'Digital Marketing'),
            React.createElement('p', { key: 'service2-desc' }, 'Strategic marketing campaigns to grow your online presence.')
          ]),
          React.createElement('div', { 
            key: 'service3',
            className: 'bg-card p-6 rounded-lg border' 
          }, [
            React.createElement('h3', { key: 'service3-title', className: 'text-xl font-semibold mb-3' }, 'UI/UX Design'),
            React.createElement('p', { key: 'service3-desc' }, 'Beautiful and intuitive designs that engage your users.')
          ])
        ])
      ])
    ]),
    React.createElement('footer', { 
      key: 'footer',
      className: 'border-t bg-muted/50 mt-16' 
    }, [
      React.createElement('div', { 
        key: 'footer-container',
        className: 'container mx-auto px-4 py-8' 
      }, [
        React.createElement('div', { 
          key: 'footer-content',
          className: 'text-center text-muted-foreground' 
        }, [
          React.createElement('p', { key: 'copyright' }, '© 2025 Astralis. All rights reserved.')
        ])
      ])
    ])
  ])
);

const MarketplacePage = ({ data }: { data?: any }) => (
  React.createElement('div', { className: 'min-h-screen bg-background text-foreground' }, [
    React.createElement('div', { 
      key: 'content',
      className: 'container mx-auto px-4 py-8' 
    }, [
      React.createElement('h1', { 
        key: 'title',
        className: 'text-4xl font-bold mb-6' 
      }, 'Digital Products Marketplace'),
      React.createElement('p', { 
        key: 'description',
        className: 'text-lg mb-8' 
      }, `Discover ${data?.items?.length || 'premium'} digital products, templates, and services.`),
      data?.items?.length > 0 && React.createElement('div', { 
        key: 'products',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
      }, data.items.slice(0, 6).map((item: any, index: number) => 
        React.createElement('div', { 
          key: `product-${item.id}`,
          className: 'bg-card p-6 rounded-lg border' 
        }, [
          React.createElement('h3', { 
            key: `title-${index}`,
            className: 'text-xl font-semibold mb-3' 
          }, item.title),
          React.createElement('p', { 
            key: `desc-${index}`,
            className: 'text-muted-foreground mb-4' 
          }, (item.description || '').substring(0, 100) + '...'),
          React.createElement('div', { 
            key: `meta-${index}`,
            className: 'flex justify-between items-center' 
          }, [
            React.createElement('span', { 
              key: `price-${index}`,
              className: 'text-lg font-bold' 
            }, `$${item.price}`),
            React.createElement('span', { 
              key: `category-${index}`,
              className: 'text-sm text-muted-foreground' 
            }, item.category?.name || 'Digital Product')
          ])
        ])
      ))
    ])
  ])
);

const ContactPage = () => (
  React.createElement('div', { className: 'min-h-screen bg-background text-foreground' }, [
    React.createElement('div', { 
      key: 'content',
      className: 'container mx-auto px-4 py-8' 
    }, [
      React.createElement('h1', { 
        key: 'title',
        className: 'text-4xl font-bold mb-6' 
      }, 'Contact Us - Get In Touch'),
      React.createElement('p', { 
        key: 'description',
        className: 'text-lg mb-8' 
      }, 'Ready to start your next project? Contact Astralis today for a free consultation.'),
      React.createElement('div', { 
        key: 'contact-info',
        className: 'grid grid-cols-1 md:grid-cols-2 gap-8' 
      }, [
        React.createElement('div', { key: 'info' }, [
          React.createElement('h2', { key: 'info-title', className: 'text-2xl font-semibold mb-4' }, 'Get in Touch'),
          React.createElement('div', { key: 'email', className: 'mb-4' }, [
            React.createElement('h3', { key: 'email-label', className: 'font-medium' }, 'Email'),
            React.createElement('p', { key: 'email-value', className: 'text-muted-foreground' }, 'hello@astralis.one')
          ]),
          React.createElement('div', { key: 'phone', className: 'mb-4' }, [
            React.createElement('h3', { key: 'phone-label', className: 'font-medium' }, 'Phone'),
            React.createElement('p', { key: 'phone-value', className: 'text-muted-foreground' }, '+1 (555) 123-4567')
          ])
        ]),
        React.createElement('div', { key: 'form' }, [
          React.createElement('h2', { key: 'form-title', className: 'text-2xl font-semibold mb-4' }, 'Contact Form'),
          React.createElement('form', { key: 'contact-form', className: 'space-y-4' }, [
            React.createElement('input', { 
              key: 'name',
              type: 'text',
              placeholder: 'Your name',
              className: 'w-full p-2 border border-border rounded-md'
            }),
            React.createElement('input', { 
              key: 'email',
              type: 'email',
              placeholder: 'your@email.com',
              className: 'w-full p-2 border border-border rounded-md'
            }),
            React.createElement('textarea', { 
              key: 'message',
              placeholder: 'Tell us about your project...',
              rows: 4,
              className: 'w-full p-2 border border-border rounded-md'
            }),
            React.createElement('button', { 
              key: 'submit',
              type: 'submit',
              className: 'bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90'
            }, 'Send Message')
          ])
        ])
      ])
    ])
  ])
);

export const renderSimpleSSRPage = (pathname: string, data?: any): string => {
  try {
    let component;
    
    switch (pathname) {
      case '/':
        component = React.createElement(HomePage, { data });
        break;
      case '/marketplace':
        component = React.createElement(MarketplacePage, { data });
        break;
      case '/contact':
        component = React.createElement(ContactPage);
        break;
      default:
        component = React.createElement('div', { 
          className: 'min-h-screen bg-background text-foreground flex items-center justify-center' 
        }, [
          React.createElement('div', { 
            key: 'default',
            className: 'text-center' 
          }, [
            React.createElement('h1', { 
              key: 'title',
              className: 'text-4xl font-bold mb-4' 
            }, 'Page Loading...'),
            React.createElement('p', { 
              key: 'desc',
              className: 'text-muted-foreground' 
            }, 'This page will load shortly.')
          ])
        ]);
    }
    
    return renderToString(component);
  } catch (error) {
    console.error('Simple SSR Render Error:', error);
    return '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold">Loading...</h1></div>';
  }
};