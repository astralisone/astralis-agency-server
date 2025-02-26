import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // First, get the admin user to associate testimonials with
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!adminUser) {
      console.error('Admin user not found. Please run the main seed script first.');
      return;
    }

    console.log('Found admin user:', adminUser.email);

    // Sample testimonials data
    const testimonials = [
      {
        content: "Working with Astralis has been transformative for our brand. Their attention to detail and creative solutions exceeded our expectations.",
        rating: 5,
        authorId: adminUser.id,
        role: "CEO at TechStart",
        company: "TechStart",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        featured: true,
        published: true,
        sortOrder: 1,
      },
      {
        content: "The team's expertise in digital marketing helped us achieve record-breaking growth. Highly recommended!",
        rating: 5,
        authorId: adminUser.id,
        role: "Marketing Director",
        company: "InnovateTech",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        featured: true,
        published: true,
        sortOrder: 2,
      },
      {
        content: "Their innovative approach to problem-solving and dedication to quality makes them stand out from the competition.",
        rating: 5,
        authorId: adminUser.id,
        role: "Product Manager",
        company: "SaaS Solutions",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        featured: true,
        published: true,
        sortOrder: 3,
      },
      {
        content: "Astralis Agency delivered exceptional results for our website redesign. Their technical expertise and creative vision transformed our online presence.",
        rating: 5,
        authorId: adminUser.id,
        role: "CTO at InnovateTech",
        company: "InnovateTech",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        featured: false,
        published: true,
        sortOrder: 4,
      },
      {
        content: "The digital marketing strategy Astralis created for us resulted in a 200% increase in online sales within just three months.",
        rating: 5,
        authorId: adminUser.id,
        role: "E-commerce Manager",
        company: "RetailPlus",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        featured: false,
        published: true,
        sortOrder: 5,
      },
    ];

    console.log('Seeding testimonials...');

    // Create testimonials
    for (const testimonial of testimonials) {
      await prisma.testimonial.upsert({
        where: {
          id: `seed-${testimonial.sortOrder}`,
        },
        update: testimonial,
        create: {
          id: `seed-${testimonial.sortOrder}`,
          ...testimonial,
        },
      });
      console.log(`Created/updated testimonial ${testimonial.sortOrder}`);
    }

    console.log('Testimonials seeded successfully!');
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 