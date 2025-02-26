import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Blog API', () => {
  let authorId: string;
  let categoryId: string;
  let tagId: string;

  beforeAll(async () => {
    // Create test author
    const author = await prisma.user.create({
      data: {
        email: 'author@example.com',
        name: 'Test Author',
        password: 'password123',
        role: 'AUTHOR',
      },
    });
    authorId = author.id;

    // Create test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test category description',
      },
    });
    categoryId = category.id;

    // Create test tag
    const tag = await prisma.tag.create({
      data: {
        name: 'Test Tag',
        slug: 'test-tag',
      },
    });
    tagId = tag.id;
  });

  describe('GET /api/blog', () => {
    beforeEach(async () => {
      // Create test posts
      await prisma.post.createMany({
        data: [
          {
            title: 'Test Post 1',
            slug: 'test-post-1',
            content: 'Content 1',
            excerpt: 'Excerpt 1',
            status: 'PUBLISHED',
            authorId,
            categoryId,
            publishedAt: new Date(),
          },
          {
            title: 'Test Post 2',
            slug: 'test-post-2',
            content: 'Content 2',
            excerpt: 'Excerpt 2',
            status: 'PUBLISHED',
            authorId,
            categoryId,
            publishedAt: new Date(),
          },
        ],
      });
    });

    it('should return paginated blog posts', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.posts).toHaveLength(2);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter posts by category', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ category: 'test-category' });

      expect(response.status).toBe(200);
      expect(response.body.data.posts).toHaveLength(2);
      expect(response.body.data.posts[0].category.slug).toBe('test-category');
    });

    it('should search posts by content', async () => {
      const response = await request(app)
        .get('/api/blog')
        .query({ search: 'Content 1' });

      expect(response.status).toBe(200);
      expect(response.body.data.posts).toHaveLength(1);
      expect(response.body.data.posts[0].title).toBe('Test Post 1');
    });
  });

  describe('GET /api/blog/:slug', () => {
    let postSlug: string;

    beforeEach(async () => {
      // Create test post
      const post = await prisma.post.create({
        data: {
          title: 'Detailed Post',
          slug: 'detailed-post',
          content: 'Detailed content',
          excerpt: 'Detailed excerpt',
          status: 'PUBLISHED',
          authorId,
          categoryId,
          publishedAt: new Date(),
          tags: {
            connect: { id: tagId },
          },
        },
      });
      postSlug = post.slug;

      // Create test comment
      await prisma.comment.create({
        data: {
          content: 'Test comment',
          postId: post.id,
          authorId,
        },
      });
    });

    it('should return post details with comments', async () => {
      const response = await request(app)
        .get(`/api/blog/${postSlug}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toMatchObject({
        title: 'Detailed Post',
        slug: 'detailed-post',
        content: 'Detailed content',
      });
      expect(response.body.data.comments).toHaveLength(1);
      expect(response.body.data.tags).toHaveLength(1);
      expect(response.body.data.tags[0].slug).toBe('test-tag');
    });

    it('should increment view count', async () => {
      const before = await prisma.post.findUnique({
        where: { slug: postSlug },
        select: { viewCount: true },
      });

      await request(app).get(`/api/blog/${postSlug}`);

      const after = await prisma.post.findUnique({
        where: { slug: postSlug },
        select: { viewCount: true },
      });

      expect(after!.viewCount).toBe(before!.viewCount + 1);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/blog/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/blog/:slug/comments', () => {
    let postSlug: string;

    beforeEach(async () => {
      // Create test post
      const post = await prisma.post.create({
        data: {
          title: 'Comment Test Post',
          slug: 'comment-test-post',
          content: 'Content for commenting',
          excerpt: 'Excerpt',
          status: 'PUBLISHED',
          authorId,
          categoryId,
          publishedAt: new Date(),
        },
      });
      postSlug = post.slug;
    });

    it('should create a new comment', async () => {
      const response = await request(app)
        .post(`/api/blog/${postSlug}/comments`)
        .send({
          content: 'New comment',
          authorId,
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.content).toBe('New comment');
      expect(response.body.data.author).toHaveProperty('name');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/blog/${postSlug}/comments`)
        .send({
          content: 'New comment',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/blog/:slug/likes', () => {
    let postSlug: string;
    let userId: string;

    beforeEach(async () => {
      // Create test post
      const post = await prisma.post.create({
        data: {
          title: 'Like Test Post',
          slug: 'like-test-post',
          content: 'Content for liking',
          excerpt: 'Excerpt',
          status: 'PUBLISHED',
          authorId,
          categoryId,
          publishedAt: new Date(),
        },
      });
      postSlug = post.slug;

      // Create test user
      const user = await prisma.user.create({
        data: {
          email: 'user@example.com',
          name: 'Test User',
          password: 'password123',
        },
      });
      userId = user.id;
    });

    it('should toggle like status', async () => {
      // Like the post
      let response = await request(app)
        .post(`/api/blog/${postSlug}/likes`)
        .send({ userId });

      expect(response.status).toBe(200);
      expect(response.body.data.liked).toBe(true);
      expect(response.body.data.likeCount).toBe(1);

      // Unlike the post
      response = await request(app)
        .post(`/api/blog/${postSlug}/likes`)
        .send({ userId });

      expect(response.status).toBe(200);
      expect(response.body.data.liked).toBe(false);
      expect(response.body.data.likeCount).toBe(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/blog/${postSlug}/likes`)
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
}); 