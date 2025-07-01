import express from 'express';
import { ContactForm } from '../models/ContactForm.js';
import { sendContactFormEmail } from '../services/email.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new contact form entry
    const contactForm = await ContactForm.create({
      name,
      email,
      message,
    });

    // Send email notification
    await sendContactFormEmail(contactForm);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      data: contactForm,
    });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    res.status(500).json({
      error: 'Failed to submit contact form',
    });
  }
});

export default router;
