import nodemailer, { Transporter } from 'nodemailer';

// Define a ContactFormData interface to match our ContactForm model
interface ContactFormData {
  id?: number;
  name: string;
  email: string;
  message: string;
  status?: string;
  submittedAt?: Date;
  updatedAt?: Date;
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendContactFormEmail(contactForm: ContactFormData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_EMAIL_RECIPIENT,
    subject: 'New Contact Form Submission',
    text: `
      Name: ${contactForm.name}
      Email: ${contactForm.email}
      Message: ${contactForm.message}
      Submitted: ${contactForm.submittedAt}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactForm.name}</p>
      <p><strong>Email:</strong> ${contactForm.email}</p>
      <p><strong>Message:</strong> ${contactForm.message}</p>
      <p><strong>Submitted:</strong> ${contactForm.submittedAt}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
