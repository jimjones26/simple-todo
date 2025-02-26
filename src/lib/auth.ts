import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

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
     { token, expiration, userId: user.id },
  });

  return token;
}
