import express from 'express';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { formatErrorResponse, createNotFoundError, getErrorMessage } from '../utils/error-handler';
const router = express.Router();
const prisma = new PrismaClient();
// Get all blog posts with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { limit = '10', page = '1', search, category, status, sortBy = 'createdAt', order = 'desc' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = { slug: category };
        }
        if (status) {
            where.status = status;
        }
        else {
            where.status = 'PUBLISHED';
        }
        // Build orderBy
        const orderBy = {
            [sortBy]: order.toLowerCase()
        };
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    featuredImage: true,
                    status: true,
                    publishedAt: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: Number(limit),
            }),
            prisma.post.count({ where }),
        ]);
        const response = {
            status: 'success',
            data: {
                posts,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                    hasNextPage: skip + posts.length < total,
                    hasPrevPage: Number(page) > 1,
                },
            },
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to fetch posts'));
    }
});
// Get a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                category: true,
                tags: true,
            },
        });
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Blog post not found' });
        }
        res.json({ status: 'success', data: post });
    }
    catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch blog post' });
    }
});
// Get a single blog post by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                category: true,
                tags: true,
            },
        });
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Blog post not found' });
        }
        res.json({ status: 'success', data: post });
    }
    catch (error) {
        console.error('Error fetching post:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch post',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get blog categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            postsCount: category._count.posts,
        }));
        const response = {
            status: 'success',
            data: formattedCategories,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to fetch categories'));
    }
});
router.post('/categories', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and slug are required'
            });
        }
        // Check if slug already exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            return res.status(400).json({
                status: 'error',
                message: 'A category with this slug already exists'
            });
        }
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || '',
            },
        });
        res.status(201).json({
            status: 'success',
            data: category
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create category',
            error: getErrorMessage(error)
        });
    }
});
router.put('/categories/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;
        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and slug are required'
            });
        }
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            return res.status(404).json({
                status: 'error',
                message: 'Category not found'
            });
        }
        // Check if slug already exists (excluding current category)
        const slugExists = await prisma.category.findFirst({
            where: {
                slug,
                id: { not: id },
            },
        });
        if (slugExists) {
            return res.status(400).json({
                status: 'error',
                message: 'A category with this slug already exists'
            });
        }
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description: description || existingCategory.description || '',
            },
        });
        res.json({
            status: 'success',
            data: updatedCategory
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update category',
            error: getErrorMessage(error)
        });
    }
});
router.delete('/categories/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            return res.status(404).json({
                status: 'error',
                message: 'Category not found'
            });
        }
        // Check if category is in use by any blog posts
        const postsUsingCategory = await prisma.post.count({
            where: {
                categoryId: id,
            },
        });
        if (postsUsingCategory > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete category that is in use by blog posts',
                data: { postsCount: postsUsingCategory }
            });
        }
        await prisma.category.delete({
            where: { id },
        });
        res.json({
            status: 'success',
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete category',
            error: getErrorMessage(error)
        });
    }
});
// Get blog tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        const formattedTags = tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            postsCount: tag._count.posts,
        }));
        const response = {
            status: 'success',
            data: formattedTags,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to fetch tags'));
    }
});
router.post('/tags', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { name, slug } = req.body;
        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and slug are required'
            });
        }
        // Check if slug already exists
        const existingTag = await prisma.tag.findUnique({
            where: { slug },
        });
        if (existingTag) {
            return res.status(400).json({
                status: 'error',
                message: 'A tag with this slug already exists'
            });
        }
        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
            },
        });
        res.status(201).json({
            status: 'success',
            data: tag
        });
    }
    catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create tag',
            error: getErrorMessage(error)
        });
    }
});
router.put('/tags/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and slug are required'
            });
        }
        // Check if tag exists
        const existingTag = await prisma.tag.findUnique({
            where: { id },
        });
        if (!existingTag) {
            return res.status(404).json({
                status: 'error',
                message: 'Tag not found'
            });
        }
        // Check if slug already exists (excluding current tag)
        const slugExists = await prisma.tag.findFirst({
            where: {
                slug,
                id: { not: id },
            },
        });
        if (slugExists) {
            return res.status(400).json({
                status: 'error',
                message: 'A tag with this slug already exists'
            });
        }
        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                name,
                slug,
            },
        });
        res.json({
            status: 'success',
            data: updatedTag
        });
    }
    catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update tag',
            error: getErrorMessage(error)
        });
    }
});
router.delete('/tags/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if tag exists
        const existingTag = await prisma.tag.findUnique({
            where: { id },
        });
        if (!existingTag) {
            return res.status(404).json({
                status: 'error',
                message: 'Tag not found'
            });
        }
        // Check if tag is in use by any blog posts
        const postsUsingTag = await prisma.post.count({
            where: {
                tags: {
                    some: {
                        id,
                    },
                },
            },
        });
        if (postsUsingTag > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete tag that is in use by blog posts',
                data: { postsCount: postsUsingTag }
            });
        }
        await prisma.tag.delete({
            where: { id },
        });
        res.json({
            status: 'success',
            message: 'Tag deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete tag',
            error: getErrorMessage(error)
        });
    }
});
// Create a new blog post
router.post('/', async (req, res) => {
    try {
        const { title, content, featuredImage, categoryId, authorId, tags = [] } = req.body;
        // Generate a slug from the title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                featuredImage,
                author: {
                    connect: { id: authorId },
                },
                category: {
                    connect: { id: categoryId },
                },
                tags: {
                    connect: tags.map((id) => ({ id })),
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                category: true,
                tags: true,
            },
        });
        const response = {
            status: 'success',
            data: post,
        };
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to create post'));
    }
});
// Update a blog post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, featuredImage, categoryId, tags = [] } = req.body;
        // Check if post exists
        const existingPost = await prisma.post.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json(createNotFoundError('Post', id));
        }
        // Generate a new slug if title is updated
        const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                featuredImage,
                category: categoryId ? {
                    connect: { id: categoryId },
                } : undefined,
                tags: {
                    set: tags.map((id) => ({ id })),
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                category: true,
                tags: true,
            },
        });
        const response = {
            status: 'success',
            data: updatedPost,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to update post'));
    }
});
// Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if post exists
        const existingPost = await prisma.post.findUnique({
            where: { id },
        });
        if (!existingPost) {
            return res.status(404).json(createNotFoundError('Post', id));
        }
        await prisma.post.delete({
            where: { id },
        });
        const response = {
            status: 'success',
            data: { message: 'Post deleted successfully' },
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json(formatErrorResponse(error, 'Failed to delete post'));
    }
});
export default router;
