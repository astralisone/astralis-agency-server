import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // Create admin user if it doesn't exist
  console.log('Creating admin user...');
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@astralis.com' }
  });
  
  if (!admin) {
    const adminPassword = await hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@astralis.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Create categories
  console.log('Creating categories...');
  
  // Define category data
  const categoryData = [
    // Web & Tech Categories
    { name: 'Web Development', slug: 'web-development', description: 'Web development services and solutions' },
    { name: 'Mobile Development', slug: 'mobile-development', description: 'Mobile app development for iOS and Android' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design services' },
    { name: 'E-commerce', slug: 'e-commerce', description: 'Online store development and solutions' },
    
    // Marketing Categories
    { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Digital marketing and SEO services' },
    { name: 'Content Marketing', slug: 'content-marketing', description: 'Content creation and marketing strategies' },
    { name: 'Social Media', slug: 'social-media', description: 'Social media management and marketing' },
    
    // Design Categories
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Visual design services for print and digital media' },
    { name: 'Branding', slug: 'branding', description: 'Brand identity and strategy services' },
    
    // Business Categories
    { name: 'Business Strategy', slug: 'business-strategy', description: 'Business consulting and strategy services' },
    { name: 'Startup Resources', slug: 'startup-resources', description: 'Resources and services for startups' },
    
    // Blog-specific Categories
    { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides and tutorials' },
    { name: 'Case Studies', slug: 'case-studies', description: 'Real-world examples and success stories' },
    { name: 'Industry News', slug: 'industry-news', description: 'Latest news and trends in the industry' },
  ];
  
  // Create categories if they don't exist
  const categories = [];
  for (const category of categoryData) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug }
    });
    
    if (existingCategory) {
      console.log(`Category ${category.name} already exists`);
      categories.push(existingCategory);
    } else {
      const newCategory = await prisma.category.create({
        data: category
      });
      console.log(`Created category: ${category.name}`);
      categories.push(newCategory);
    }
  }

  // Create tags
  console.log('Creating tags...');
  
  // Define tag data
  const tagData = [
    // Technology Tags
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Python', slug: 'python' },
    { name: 'Django', slug: 'django' },
    { name: 'Vue.js', slug: 'vuejs' },
    { name: 'Angular', slug: 'angular' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'AWS', slug: 'aws' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Kubernetes', slug: 'kubernetes' },
    
    // Design Tags
    { name: 'UI Design', slug: 'ui-design' },
    { name: 'UX Design', slug: 'ux-design' },
    { name: 'Figma', slug: 'figma' },
    { name: 'Adobe XD', slug: 'adobe-xd' },
    { name: 'Sketch', slug: 'sketch' },
    { name: 'Responsive Design', slug: 'responsive-design' },
    
    // Marketing Tags
    { name: 'SEO', slug: 'seo' },
    { name: 'SEM', slug: 'sem' },
    { name: 'Content Strategy', slug: 'content-strategy' },
    { name: 'Email Marketing', slug: 'email-marketing' },
    { name: 'Social Media Marketing', slug: 'social-media-marketing' },
    { name: 'Analytics', slug: 'analytics' },
    { name: 'Conversion Rate Optimization', slug: 'cro' },
    
    // Business Tags
    { name: 'Startups', slug: 'startups' },
    { name: 'Entrepreneurship', slug: 'entrepreneurship' },
    { name: 'Funding', slug: 'funding' },
    { name: 'Growth Hacking', slug: 'growth-hacking' },
    { name: 'Remote Work', slug: 'remote-work' },
    
    // Content Type Tags
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'Guide', slug: 'guide' },
    { name: 'Case Study', slug: 'case-study' },
    { name: 'Interview', slug: 'interview' },
    { name: 'Opinion', slug: 'opinion' },
    { name: 'News', slug: 'news' },
  ];
  
  // Create tags if they don't exist
  const tags = [];
  for (const tag of tagData) {
    const existingTag = await prisma.tag.findUnique({
      where: { slug: tag.slug }
    });
    
    if (existingTag) {
      console.log(`Tag ${tag.name} already exists`);
      tags.push(existingTag);
    } else {
      const newTag = await prisma.tag.create({
        data: tag
      });
      console.log(`Created tag: ${tag.name}`);
      tags.push(newTag);
    }
  }

  // Check if we already have blog posts
  const existingPosts = await prisma.post.count();
  if (existingPosts > 0) {
    console.log(`${existingPosts} blog posts already exist, skipping blog post creation`);
  } else {
    // Create sample blog posts
    console.log('Creating sample blog posts...');
    await Promise.all([
      prisma.post.create({
        data: {
          title: 'Getting Started with React',
          slug: 'getting-started-with-react',
          content: '# Introduction to React\n\nReact is a popular JavaScript library for building user interfaces. In this guide, we\'ll cover the basics of React and how to get started with your first React application.\n\n## What is React?\n\nReact is a JavaScript library created by Facebook for building user interfaces. It allows developers to create large web applications that can change data without reloading the page. The main purpose of React is to be fast, scalable, and simple.\n\n## Setting Up Your First React App\n\nThe easiest way to start with React is to use Create React App. Run the following command in your terminal:\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\nThis will create a new React application and start a development server.\n\n## React Components\n\nComponents are the building blocks of any React application. A component is a JavaScript function or class that optionally accepts inputs (called "props") and returns a React element that describes how a section of the UI should appear.\n\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```\n\n## Conclusion\n\nThis is just the beginning of your React journey. As you continue learning, you\'ll discover hooks, context, and many other features that make React powerful and flexible.',
          excerpt: 'Learn the basics of React and start building modern web applications.',
          status: 'PUBLISHED',
          publishedAt: new Date(),
          author: {
            connect: { id: admin.id },
          },
          category: {
            connect: { id: categories[0].id },
          },
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'React')?.id },
              { id: tags.find(t => t.name === 'JavaScript')?.id },
              { id: tags.find(t => t.name === 'Tutorial')?.id }
            ].filter(t => t.id !== undefined),
          },
          metaTitle: 'Getting Started with React - Complete Guide',
          metaDescription: 'Learn React fundamentals and best practices in this comprehensive guide.',
          featured: true,
        },
      }),
      prisma.post.create({
        data: {
          title: 'SEO Best Practices 2024',
          slug: 'seo-best-practices-2024',
          content: '# SEO in 2024\n\nStay ahead of the competition with these SEO strategies for 2024. Search engine optimization continues to evolve, and keeping up with the latest trends is essential for maintaining visibility online.\n\n## Focus on User Experience\n\nGoogle\'s algorithms are increasingly prioritizing sites that offer excellent user experiences. This includes factors like page speed, mobile-friendliness, and intuitive navigation.\n\n## Content Quality Over Quantity\n\nIn 2024, it\'s better to publish fewer, high-quality pieces of content than to flood your site with mediocre articles. Focus on comprehensive, well-researched content that truly answers user questions.\n\n## AI and Natural Language Processing\n\nWith advancements in AI, search engines are better at understanding natural language. This means you should write for humans first, not search engines. Use conversational language and focus on answering questions naturally.\n\n## Core Web Vitals\n\nGoogle\'s Core Web Vitals have become increasingly important. These metrics measure loading performance, interactivity, and visual stability. Optimizing these aspects of your site can significantly improve your rankings.\n\n## Local SEO\n\nFor businesses with physical locations, local SEO remains crucial. Ensure your Google Business Profile is complete and up-to-date, and collect positive reviews from satisfied customers.\n\n## Conclusion\n\nSEO continues to evolve, but the fundamentals remain the same: create valuable content for users, ensure your site offers a great experience, and stay up-to-date with the latest best practices.',
          excerpt: 'Learn the latest SEO techniques to improve your website ranking.',
          status: 'PUBLISHED',
          publishedAt: new Date(),
          author: {
            connect: { id: admin.id },
          },
          category: {
            connect: { id: categories[4].id },
          },
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'SEO')?.id },
              { id: tags.find(t => t.name === 'Digital Marketing')?.id || tags.find(t => t.name === 'Content Strategy')?.id },
              { id: tags.find(t => t.name === 'Guide')?.id }
            ].filter(t => t.id !== undefined),
          },
          metaTitle: 'SEO Best Practices for 2024',
          metaDescription: 'Discover the latest SEO strategies to improve your website visibility.',
          featured: true,
        },
      }),
      prisma.post.create({
        data: {
          title: 'The Future of Remote Work in Tech',
          slug: 'future-of-remote-work-tech',
          content: '# The Future of Remote Work in Tech\n\nThe COVID-19 pandemic accelerated the adoption of remote work across the tech industry. Now, as we move forward, what does the future hold for remote work in tech companies?\n\n## Hybrid Models Becoming Standard\n\nMany companies are adopting hybrid models that combine remote and in-office work. This approach aims to provide flexibility while maintaining some level of in-person collaboration.\n\n## Global Talent Pools\n\nWith remote work, companies can hire talent from anywhere in the world. This opens up opportunities for both employers and employees, creating a truly global workforce.\n\n## Challenges and Solutions\n\nRemote work isn\'t without challenges. Issues like communication, collaboration, and work-life balance require thoughtful solutions. Companies are investing in better tools and processes to address these challenges.\n\n## The Impact on Cities\n\nAs tech workers spread out geographically, we\'re seeing changes in housing markets and local economies. Some tech hubs are experiencing shifts as workers move to more affordable areas.\n\n## Conclusion\n\nRemote work is here to stay in the tech industry, though its exact form will continue to evolve. Companies that embrace flexibility and invest in making remote work successful will have an advantage in attracting and retaining top talent.',
          excerpt: 'Explore how remote work is reshaping the tech industry and what to expect in the coming years.',
          status: 'PUBLISHED',
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          author: {
            connect: { id: admin.id },
          },
          category: {
            connect: { id: categories[13].id }, // Industry News
          },
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'Remote Work')?.id },
              { id: tags.find(t => t.name === 'Opinion')?.id }
            ].filter(t => t.id !== undefined),
          },
          metaTitle: 'The Future of Remote Work in Tech - Trends and Predictions',
          metaDescription: 'Discover how remote work is evolving in the tech industry and what to expect in the future.',
          featured: false,
        },
      }),
    ]);
    console.log('Created sample blog posts');
  }

  // Check if we already have marketplace items
  const existingItems = await prisma.marketplaceItem.count();
  if (existingItems > 0) {
    console.log(`${existingItems} marketplace items already exist, skipping marketplace item creation`);
  } else {
    // Create sample marketplace items
    console.log('Creating sample marketplace items...');
    await Promise.all([
      prisma.marketplaceItem.create({
        data: {
          title: 'Custom Website Development',
          slug: 'custom-website-development',
          description: 'Professional website development services using modern technologies. Our team of experienced developers will create a custom website tailored to your specific needs and requirements. We focus on creating responsive, fast, and user-friendly websites that help you achieve your business goals.',
          price: 999.99,
          imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          status: 'AVAILABLE',
          category: {
            connect: { id: categories[0].id }, // Web Development
          },
          seller: {
            connect: { id: admin.id },
          },
          specifications: {
            technologies: ['React', 'Node.js', 'PostgreSQL'],
            timeline: '4-6 weeks',
            support: '3 months',
            includes: [
              'Custom design',
              'Responsive layout',
              'Content management system',
              'SEO optimization',
              'Analytics integration'
            ]
          },
          features: [
            'Custom Design',
            'Responsive Layout',
            'SEO Optimization',
            'Performance Optimization',
            'Content Management System',
            '3 Months Support'
          ],
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'React')?.id },
              { id: tags.find(t => t.name === 'Node.js')?.id },
              { id: tags.find(t => t.name === 'Responsive Design')?.id }
            ].filter(t => t.id !== undefined),
          },
          stock: 5,
          featured: true,
        },
      }),
      prisma.marketplaceItem.create({
        data: {
          title: 'SEO Optimization Package',
          slug: 'seo-optimization-package',
          description: 'Comprehensive SEO services to improve your website ranking. Our SEO experts will analyze your website, identify areas for improvement, and implement strategies to increase your visibility in search engines. This package includes keyword research, on-page optimization, content strategy, and monthly reporting.',
          price: 499.99,
          imageUrl: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          status: 'AVAILABLE',
          category: {
            connect: { id: categories[4].id }, // Digital Marketing
          },
          seller: {
            connect: { id: admin.id },
          },
          specifications: {
            duration: '3 months',
            includes: [
              'Keyword Research',
              'On-page Optimization',
              'Content Strategy',
              'Monthly Reports',
              'Competitor Analysis',
              'Backlink Building'
            ],
          },
          features: [
            'Keyword Analysis',
            'Technical SEO',
            'Content Optimization',
            'Performance Tracking',
            'Monthly Reporting',
            'Competitor Analysis'
          ],
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'SEO')?.id },
              { id: tags.find(t => t.name === 'Content Strategy')?.id },
              { id: tags.find(t => t.name === 'Analytics')?.id }
            ].filter(t => t.id !== undefined),
          },
          stock: 10,
          featured: true,
        },
      }),
      prisma.marketplaceItem.create({
        data: {
          title: 'Mobile App Development',
          slug: 'mobile-app-development',
          description: 'Professional mobile app development for iOS and Android. Our team will design and develop a custom mobile application that meets your business needs and provides a great user experience. We use the latest technologies and best practices to ensure your app is fast, reliable, and easy to use.',
          price: 2499.99,
          imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          status: 'AVAILABLE',
          category: {
            connect: { id: categories[1].id }, // Mobile Development
          },
          seller: {
            connect: { id: admin.id },
          },
          specifications: {
            platforms: ['iOS', 'Android'],
            technologies: ['React Native', 'Firebase'],
            timeline: '8-12 weeks',
            support: '6 months',
          },
          features: [
            'Custom Design',
            'Cross-Platform Development',
            'User Authentication',
            'Push Notifications',
            'Offline Support',
            'Analytics Integration'
          ],
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'React')?.id },
              { id: tags.find(t => t.name === 'Mobile Development')?.id || tags.find(t => t.name === 'React Native')?.id }
            ].filter(t => t.id !== undefined),
          },
          stock: 3,
          featured: true,
        },
      }),
      prisma.marketplaceItem.create({
        data: {
          title: 'Brand Identity Package',
          slug: 'brand-identity-package',
          description: 'Complete brand identity design package for startups and small businesses. Our design team will create a cohesive brand identity that reflects your company\'s values and resonates with your target audience. This package includes logo design, color palette, typography, brand guidelines, and basic marketing materials.',
          price: 1299.99,
          imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          status: 'AVAILABLE',
          category: {
            connect: { id: categories[8].id }, // Branding
          },
          seller: {
            connect: { id: admin.id },
          },
          specifications: {
            deliverables: [
              'Logo Design (multiple concepts)',
              'Color Palette',
              'Typography Selection',
              'Brand Guidelines',
              'Business Cards',
              'Letterhead',
              'Email Signature'
            ],
            timeline: '3-4 weeks',
            revisions: '3 rounds',
          },
          features: [
            'Logo Design',
            'Brand Guidelines',
            'Color Palette',
            'Typography',
            'Business Cards',
            'Social Media Templates'
          ],
          tags: {
            connect: [
              { id: tags.find(t => t.name === 'Branding')?.id || tags.find(t => t.name === 'UI Design')?.id },
              { id: tags.find(t => t.name === 'Design')?.id || tags.find(t => t.name === 'Graphic Design')?.id }
            ].filter(t => t.id !== undefined),
          },
          stock: 8,
          featured: false,
        },
      }),
    ]);
    console.log('Created sample marketplace items');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 