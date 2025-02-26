import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@astralis.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development services and solutions',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Digital marketing and SEO services',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'Design services including UI/UX and branding',
      },
    }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'React',
        slug: 'react',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Node.js',
        slug: 'nodejs',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'SEO',
        slug: 'seo',
      },
    }),
  ]);

  // Create sample blog posts
  await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with React',
        slug: 'getting-started-with-react',
        content: '# Introduction to React\n\nReact is a popular JavaScript library for building user interfaces...',
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
          connect: [{ id: tags[0].id }],
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
        content: '# SEO in 2024\n\nStay ahead of the competition with these SEO strategies...',
        excerpt: 'Learn the latest SEO techniques to improve your website ranking.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        author: {
          connect: { id: admin.id },
        },
        category: {
          connect: { id: categories[1].id },
        },
        tags: {
          connect: [{ id: tags[2].id }],
        },
        metaTitle: 'SEO Best Practices for 2024',
        metaDescription: 'Discover the latest SEO strategies to improve your website visibility.',
        featured: true,
      },
    }),
  ]);

  // Create sample marketplace items
  await Promise.all([
    prisma.marketplaceItem.create({
      data: {
        title: 'Custom Website Development',
        slug: 'custom-website-development',
        description: 'Professional website development services using modern technologies.',
        price: 999.99,
        imageUrl: 'https://example.com/website-dev.jpg',
        status: 'AVAILABLE',
        category: {
          connect: { id: categories[0].id },
        },
        seller: {
          connect: { id: admin.id },
        },
        specifications: {
          technologies: ['React', 'Node.js', 'PostgreSQL'],
          timeline: '4-6 weeks',
          support: '3 months',
        },
        features: [
          'Custom Design',
          'Responsive Layout',
          'SEO Optimization',
          'Performance Optimization',
        ],
        tags: {
          connect: [
            { id: tags[0].id },
            { id: tags[1].id },
          ],
        },
        stock: 5,
        featured: true,
      },
    }),
    prisma.marketplaceItem.create({
      data: {
        title: 'SEO Optimization Package',
        slug: 'seo-optimization-package',
        description: 'Comprehensive SEO services to improve your website ranking.',
        price: 499.99,
        imageUrl: 'https://example.com/seo-package.jpg',
        status: 'AVAILABLE',
        category: {
          connect: { id: categories[1].id },
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
          ],
        },
        features: [
          'Keyword Analysis',
          'Technical SEO',
          'Content Optimization',
          'Performance Tracking',
        ],
        tags: {
          connect: [{ id: tags[2].id }],
        },
        stock: 10,
        featured: true,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 