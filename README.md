# Invoice Generator App

A modern, scalable invoicing application built with Next.js.


## Overview

This project demonstrates how to build a robust, full-featured invoicing system. It leverages the power of Next.js for a seamless, combined with the scalability and performance of Neon's serverless Postgres database.

## Key Features

- 🚀 Fast, responsive UI built with Next.js
- 💾 Serverless PostgreSQL with Neon for efficient data management
- 📊 Real-time invoice creation, editing, and management
- 🔐 Secure user authentication with Clerk

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: Node.js, Express (API routes in Next.js)
- Database: Neon Postgres
- Authentication: Clerk
- Deployment: Vercel (frontend), Neon (database)


## Getting Started

- Clone the repository.
- Create a [Neon project](https://neon.tech/docs/introduction)
- Create a [Clerk email authentication project](https://clerk.com/)
- Get your [Resend API key](https://resend.com/)
- Create a `.env.local` file containing the following credentials:

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEON_DATABASE_URL=
RESEND_API_KEY=r
```

- Run `npm i` to install the project dependencies.
- Run `npm run db-create` to create the database tables.
- Start the development server by running: `npm run dev`.
