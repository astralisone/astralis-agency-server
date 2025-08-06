import express from 'express';
import { prisma } from '../config/database';
import { sendContactFormEmail } from '../services/email';
import { getErrorMessage } from '../utils/error-handler';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Send email notification
    await sendContactFormEmail(contactForm);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      data: contactForm,
    });
  } catch (error: unknown) {
    console.error('Contact form submission failed:', error);
    res.status(500).json({
      error: getErrorMessage(error),
    });
  }
});

export default router;
