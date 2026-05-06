# Simple Todo

A SvelteKit task management application with magic link (passwordless) authentication using Prisma ORM and a SQLite database.

## Tech Stack

- **Framework**: Svelte 5 + SvelteKit
- **Authentication**: Magic link / passwordless email flow using custom token model
- **Database**: SQLite via Prisma ORM
- **Forms**: sveltekit-superforms with Zod schema validation
- **Email**: Nodemailer for magic link delivery
- **UI**: Tailwind CSS v4, bits-ui components, tailwind-variants
- **Testing**: Vitest (unit), Playwright (e2e)
- **Language**: TypeScript

## Key Features

- Passwordless authentication via email magic link
- Prisma-managed database schema with User and MagicLinkToken models
- Type-safe form handling with sveltekit-superforms and Zod
- Email verification request and "check your email" confirmation flow
- Component-level unit tests and end-to-end test configuration

## Getting Started

**Prerequisites:** Node.js 18+, an SMTP provider for email delivery

```bash
# Clone the repository
git clone https://github.com/jimjones26/simple-todo.git
cd simple-todo

# Install dependencies
npm install

# Configure environment
# Set DATABASE_URL and SMTP credentials in your environment
DATABASE_URL="file:./dev.db"

# Apply database schema
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Usage

```bash
# Start the development server
npm run dev

# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Build for production
npm run build
```

## Database Schema

- `User` — email address, optional first name, related magic link tokens
- `MagicLinkToken` — unique token with expiration tied to a user
