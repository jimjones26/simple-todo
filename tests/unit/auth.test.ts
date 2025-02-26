import { describe, it, expect, beforeAll, afterAll, vi, beforeEach, afterEach } from 'vitest';
import { generateMagicLinkToken, sendMagicLinkEmail } from '../../src/lib/auth'; // Import the function
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

describe('generateMagicLinkToken', () => {
  const email = 'test@example.com'; // Example email for testing

  beforeAll(async () => {
    // Ensure user exists before running tests
    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: { email: email },
    });
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.magicLinkToken.deleteMany({
      where: { user: { email: email } },
    });
    await prisma.user.delete({ where: { email: email } }); // Clean up user as well
    await prisma.$disconnect();
  });

  it('generates a unique, secure token', async () => {
    const token = await generateMagicLinkToken(email);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(50); // Basic check for token length
  });

  it('saves token to database with 15-minute expiration', async () => {
    const token = await generateMagicLinkToken(email);
    expect(token).toBeDefined();

    const magicLinkToken = await prisma.magicLinkToken.findFirst({
      where: { token: token },
      include: { user: true },
    });
    expect(magicLinkToken).toBeDefined();
    expect(magicLinkToken?.userId).toBeDefined();
    expect(magicLinkToken?.user.email).toBe(email);
    expect(magicLinkToken?.expiration).toBeInstanceOf(Date);
    // Check if expiration is within a reasonable range (around 15 minutes from now) - can be improved for more precision
    const expectedExpiration = new Date();
    expectedExpiration.setMinutes(expectedExpiration.getMinutes() + 15);
    expect(magicLinkToken?.expiration?.getTime()).toBeGreaterThan(Date.now());
    expect(magicLinkToken?.expiration?.getTime()).toBeLessThanOrEqual(expectedExpiration.getTime() + 60000); // Add a buffer of 60 seconds
  });

  it('returns the token', async () => {
    const token = await generateMagicLinkToken(email);
    expect(typeof token).toBe('string');
  });
});

describe('sendMagicLinkEmail', () => {
  let mockSendMail: any;
  let mockCreateTransport: any;

  beforeEach(() => {
    mockSendMail = vi.fn().mockResolvedValue({ messageId: 'mocked-message-id', envelope: { id: 'mocked-envelope-id' } }); // Mock sendMail to return a resolved promise
    mockCreateTransport = vi.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: mockSendMail,
    } as any); // Type assertion to bypass strict type checking for mock
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Restore original implementations after each test
  });

  it('constructs correct magic link URL', async () => {
    const email = 'test@example.com';
    const token = 'test-token';
    await sendMagicLinkEmail(email, token);

    // Get the arguments passed to the mocked sendMail function
    const sendMailArgs = mockSendMail.mock.calls[0][0];

    // Assert that the constructed URL is present in the HTML body
    expect(sendMailArgs.html).toContain(`http://localhost:3000/auth/magic-link/${token}`);
  });

  it('sends email with token', async () => { // Test case for sending email
    const email = 'test@example.com';
    const token = 'test-token';
    await sendMagicLinkEmail(email, token);
    expect(mockSendMail).toHaveBeenCalled(); // Check if sendMail was called
  });
});
