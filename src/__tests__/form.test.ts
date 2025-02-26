import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Form Submission API', () => {
  describe('POST /api/submit-form', () => {
    it('should create a new form submission', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
        company: 'Test Company',
        phone: '123-456-7890',
      };

      const response = await request(app)
        .post('/api/submit-form')
        .send(formData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');

      // Verify database entry
      const submission = await prisma.$queryRaw`
        SELECT * FROM form_submissions WHERE email = ${formData.email};
      `;
      expect(submission[0]).toMatchObject({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        company: formData.company,
        phone: formData.phone,
      });
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        subject: 'Hi', // Too short
        message: 'Short', // Too short
      };

      const response = await request(app)
        .post('/api/submit-form')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/submit-form/submissions', () => {
    beforeEach(async () => {
      // Create test submissions
      await prisma.$executeRaw`
        INSERT INTO form_submissions (name, email, subject, message)
        VALUES 
          ('Test User 1', 'test1@example.com', 'Subject 1', 'Message 1'),
          ('Test User 2', 'test2@example.com', 'Subject 2', 'Message 2');
      `;
    });

    it('should return all form submissions', async () => {
      const response = await request(app)
        .get('/api/submit-form/submissions');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('PATCH /api/submit-form/:id/status', () => {
    let submissionId: string;

    beforeEach(async () => {
      // Create test submission
      const result = await prisma.$queryRaw`
        INSERT INTO form_submissions (name, email, subject, message)
        VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test Message')
        RETURNING id;
      `;
      submissionId = result[0].id;
    });

    it('should update submission status', async () => {
      const response = await request(app)
        .patch(`/api/submit-form/${submissionId}/status`)
        .send({ status: 'in_progress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      // Verify database update
      const submission = await prisma.$queryRaw`
        SELECT status FROM form_submissions WHERE id = ${submissionId}::uuid;
      `;
      expect(submission[0].status).toBe('in_progress');
    });

    it('should return error for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/submit-form/${submissionId}/status`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
}); 