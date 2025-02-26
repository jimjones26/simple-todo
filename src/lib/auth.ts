import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function generateMagicLinkToken(email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15); // Token expires in 15 minutes

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Consider whether to create a user here or handle user creation elsewhere
    // For now, we'll assume the user exists. You might want to adjust this later.
    throw new Error('User not found'); // Or create user here if registration is part of this flow
  }

  await prisma.magicLinkToken.create({
    data: { token, expiration, userId: user.id },
  });

  return token;
}

export async function sendMagicLinkEmail(email: string, token: string) {
  const magicLinkUrl = `http://localhost:3000/auth/magic-link/${token}`; // Construct the magic link URL

  // Create a Nodemailer transporter - use ethereal email for testing
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lawson.littel36@ethereal.email', // Replace with your ethereal email user
      pass: '52VW13NSWFXJ1yPf1a', // Replace with your ethereal email password
    },
  });

  const mailOptions = {
    from: 'security@simple-todo.com', // Replace with your "from" email address
    to: email,
    subject: 'Your magic login link',
    html: `<p>Click this link to log in to your task manager:</p><a href="${magicLinkUrl}">${magicLinkUrl}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through Ethereal:
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true; // Indicate successful email sending
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Indicate email sending failure
  }
}
