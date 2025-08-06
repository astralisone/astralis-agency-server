import { User as PrismaUser, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

// User model interface
export interface UserAttributes {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: UserRole;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// User model class with static methods
export class User {
  // Find a user by email
  static async findOne({ where }: { where: { email?: string; id?: string } }) {
    if (where.email) {
      return prisma.user.findUnique({
        where: { email: where.email }
      });
    } else if (where.id) {
      return prisma.user.findUnique({
        where: { id: where.id }
      });
    }
    return null;
  }

  // Find a user by ID
  static async findByPk(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  // Create a new user
  static async create(data: {
    email: string;
    name?: string;
    password: string;
    role?: UserRole;
    avatar?: string;
    bio?: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        password: hashedPassword,
        role: data.role || 'USER',
        avatar: data.avatar || null,
        bio: data.bio || null,
      },
    });
  }

  // Validate password
  static async validatePassword(user: PrismaUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

export default User;
