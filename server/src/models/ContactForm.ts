import prisma from '../lib/prisma';

interface ContactFormAttributes {
  id?: number;
  name: string;
  email: string;
  message: string;
  status?: string;
  submittedAt?: Date;
  updatedAt?: Date;
}

export class ContactForm {
  // Create a new contact form submission
  static async create(data: {
    name: string;
    email: string;
    message: string;
    status?: string;
  }) {
    // Since there's no direct ContactForm model in the Prisma schema,
    // we'll create a custom implementation using a generic table or JSON storage
    // For now, we'll simulate it with a console log
    console.log('Contact form submission:', data);
    
    // In a real implementation, you would store this in a database table
    // This is a placeholder for the actual implementation
    return {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      email: data.email,
      message: data.message,
      status: data.status || 'pending',
      submittedAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export default ContactForm;
