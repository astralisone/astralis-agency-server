import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('45tr4l15', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@astralis.one' },
    update: {},
    create: {
      email: 'admin@astralis.one',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      bio: 'System Administrator',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('password123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@astralis.one' },
    update: {},
    create: {
      email: 'user@astralis.one',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
      bio: 'Test user for development',
      },
    });

  // Create categories
  const webDevCategory = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Articles and resources about web development',
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: 'Design',
      slug: 'design',
      description: 'Design tips, trends, and resources',
    },
  });

  const servicesCategory = await prisma.category.upsert({
    where: { slug: 'services' },
    update: {},
    create: {
      name: 'Services',
      slug: 'services',
      description: 'Professional services and consulting',
    },
  });

  // Create tags
  const reactTag = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
    },
  });

  const typescriptTag = await prisma.tag.upsert({
    where: { slug: 'typescript' },
    update: {},
    create: {
      name: 'TypeScript',
      slug: 'typescript',
    },
  });

  const uiuxTag = await prisma.tag.upsert({
    where: { slug: 'ui-ux' },
    update: {},
    create: {
      name: 'UI/UX',
      slug: 'ui-ux',
    },
  });

  // Create sample blog posts
  const post1 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-react' },
    update: {},
    create: {
      title: 'Getting Started with React in 2024',
      slug: 'getting-started-with-react',
      content: `# Getting Started with React in 2024

React continues to be one of the most popular frontend frameworks. In this comprehensive guide, we'll walk through everything you need to know to get started with React development.

## What is React?

React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Meta and the open-source community.

## Key Features

- **Component-Based**: Build encapsulated components that manage their own state
- **Virtual DOM**: Efficient updates and rendering
- **Learn Once, Write Anywhere**: Use React for web, mobile, and desktop applications

## Getting Started

To create a new React application, you can use Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will set up a new React project with all the necessary dependencies and build tools.`,
      excerpt: 'Learn how to get started with React development in 2024. This comprehensive guide covers everything from setup to building your first component.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: webDevCategory.id,
      metaTitle: 'Getting Started with React in 2024 - Complete Guide',
      metaDescription: 'Learn React development from scratch with this comprehensive 2024 guide. Perfect for beginners and experienced developers.',
      keywords: ['react', 'javascript', 'frontend', 'web development', 'tutorial'],
      featured: true,
      viewCount: 150,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'typescript-best-practices' },
    update: {},
    create: {
      title: 'TypeScript Best Practices for Large Applications',
      slug: 'typescript-best-practices',
      content: `# TypeScript Best Practices for Large Applications

TypeScript has become essential for building maintainable large-scale applications. Here are the best practices we've learned from years of TypeScript development.

## Type Safety First

Always prefer explicit types over \`any\`. Use strict mode in your TypeScript configuration:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## Interface vs Type

Use interfaces for object shapes that might be extended, and types for unions, primitives, and computed types.

## Utility Types

Leverage TypeScript's built-in utility types like \`Partial\`, \`Pick\`, \`Omit\`, and \`Record\` to create more maintainable code.`,
      excerpt: 'Discover essential TypeScript best practices for building large, maintainable applications. Learn about type safety, interfaces, and utility types.',
          status: 'PUBLISHED',
          publishedAt: new Date(),
      authorId: admin.id,
      categoryId: webDevCategory.id,
      metaTitle: 'TypeScript Best Practices for Large Applications',
      metaDescription: 'Essential TypeScript best practices for building scalable, maintainable applications. Learn from real-world experience.',
      keywords: ['typescript', 'best practices', 'large applications', 'type safety'],
      viewCount: 89,
    },
  });

  // Connect tags to posts
  await prisma.post.update({
    where: { id: post1.id },
        data: {
          tags: {
        connect: [{ id: reactTag.id }],
      },
    },
  });

  await prisma.post.update({
    where: { id: post2.id },
        data: {
          tags: {
        connect: [{ id: typescriptTag.id }],
      },
    },
  });

  // Create marketplace items
  const webDevService = await prisma.marketplaceItem.upsert({
    where: { slug: 'custom-web-development' },
    update: {},
    create: {
      title: 'Custom Web Development',
      slug: 'custom-web-development',
      description: 'Professional custom web development services using modern technologies like React, TypeScript, and Node.js. We build scalable, performant web applications tailored to your business needs.',
      price: 2500.00,
      imageUrl: '/images/web-development-service.jpg',
          status: 'AVAILABLE',
      categoryId: servicesCategory.id,
      sellerId: admin.id,
          specifications: {
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        timeline: '4-8 weeks',
        includes: ['Responsive design', 'SEO optimization', 'Performance optimization', 'Testing']
          },
          features: [
        'Modern React with TypeScript',
        'Responsive mobile-first design',
        'SEO optimized',
        'Performance optimized',
        'Comprehensive testing',
        '3 months support included'
      ],
          stock: 5,
          featured: true,
        },
  });

  const uiuxService = await prisma.marketplaceItem.upsert({
    where: { slug: 'ui-ux-design-package' },
    update: {},
    create: {
      title: 'UI/UX Design Package',
      slug: 'ui-ux-design-package',
      description: 'Complete UI/UX design package including user research, wireframing, prototyping, and final designs. Perfect for startups and businesses looking to create exceptional user experiences.',
      price: 1800.00,
      imageUrl: '/images/ui-ux-design-service.jpg',
          status: 'AVAILABLE',
      categoryId: designCategory.id,
      sellerId: admin.id,
          specifications: {
        deliverables: ['User research', 'Wireframes', 'High-fidelity designs', 'Interactive prototype'],
        timeline: '3-6 weeks',
        tools: ['Figma', 'Adobe Creative Suite', 'Principle']
          },
          features: [
        'User research and personas',
        'Information architecture',
        'Wireframes and user flows',
        'High-fidelity mockups',
        'Interactive prototypes',
        'Design system creation'
      ],
      stock: 3,
          featured: true,
        },
  });

  // Connect tags to marketplace items
  await prisma.marketplaceItem.update({
    where: { id: webDevService.id },
        data: {
          tags: {
        connect: [{ id: reactTag.id }, { id: typescriptTag.id }],
      },
    },
  });

  await prisma.marketplaceItem.update({
    where: { id: uiuxService.id },
        data: {
      tags: {
        connect: [{ id: uiuxTag.id }],
      },
    },
  });

  // Create testimonials
  await prisma.testimonial.upsert({
    where: { id: 'testimonial-1' },
    update: {},
    create: {
      id: 'testimonial-1',
      content: 'Astralis Agency delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
      rating: 5,
      authorId: testUser.id,
      role: 'CEO',
      company: 'TechStart Inc.',
      featured: true,
      published: true,
      sortOrder: 1,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: 'testimonial-2' },
    update: {},
    create: {
      id: 'testimonial-2',
      content: 'The UI/UX design work was phenomenal. Our user engagement increased by 40% after implementing their designs.',
      rating: 5,
      authorId: testUser.id,
      role: 'Product Manager',
      company: 'Digital Solutions Ltd.',
      featured: true,
      published: true,
      sortOrder: 2,
    },
  });

  // Create sample contact form entries
  await prisma.contactForm.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'I am interested in your web development services. Could you please provide more information about your pricing and timeline?',
      status: 'pending',
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 2 users (admin and test user)');
  console.log('  - 3 categories');
  console.log('  - 3 tags');
  console.log('  - 2 blog posts');
  console.log('  - 2 marketplace items');
  console.log('  - 2 testimonials');
  console.log('  - 1 contact form entry');
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('  Admin: admin@astralis.one / 45tr4l15');
  console.log('  User:  user@astralis.one / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 