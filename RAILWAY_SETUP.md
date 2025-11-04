# Railway PostgreSQL Setup Guide

This guide will help you connect your Next.js application to a Railway PostgreSQL database.

## Prerequisites

- A Railway account (sign up at https://railway.app)
- Railway CLI (optional, but recommended)

## Step 1: Create a PostgreSQL Database on Railway

1. Go to [Railway](https://railway.app) and log in
2. Create a new project or select an existing one
3. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway will automatically provision a PostgreSQL database for you

## Step 2: Get Your Database Connection String

1. In your Railway project, click on your **PostgreSQL service**
2. Go to the **"Variables"** tab
3. Find the `DATABASE_URL` variable
4. Copy the full connection string (it should look like this):
   ```
   postgresql://username:password@hostname.railway.internal:5432/railway
   ```

## Step 3: Configure Local Environment

1. Create a `.env` file in the root of your project:
   ```bash
   touch .env
   ```

2. Add your Railway database URL to `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
   ```
   
   **Important:** Replace the example with your actual DATABASE_URL from Railway.

3. Make sure `.env` is in your `.gitignore` file (it should already be there)

## Step 4: Define Your Database Schema

1. Open `prisma/schema.prisma`
2. Add your data models. Here's an example:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Step 5: Run Your First Migration

1. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

2. Create and run your first migration:
   ```bash
   npm run prisma:migrate
   ```
   
   You'll be prompted to name your migration (e.g., "init")

3. (Optional) Push schema without creating a migration:
   ```bash
   npm run prisma:push
   ```

## Step 6: Using Prisma in Your Application

Import the Prisma client from `lib/prisma.ts`:

```typescript
import { prisma } from '@/lib/prisma';

// Example: Fetch all users
export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

// Example: Create a new user
export async function createUser(email: string, name: string) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return user;
}
```

### Using Prisma in API Routes (App Router)

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: body,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### Using Prisma in Server Components

```typescript
// app/users/page.tsx
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Step 7: Deploy to Railway

1. Connect your GitHub repository to Railway:
   - In Railway, click **"+ New"** → **"GitHub Repo"**
   - Select your repository

2. Railway will automatically detect it's a Next.js app and set it up

3. **Important:** Add the `DATABASE_URL` environment variable to your Railway service:
   - Click on your **Next.js service** (not the database)
   - Go to **"Variables"** tab
   - Click **"+ New Variable"** → **"Reference"**
   - Select your PostgreSQL database's `DATABASE_URL`
   
   This connects your app to the database on Railway.

4. Railway will automatically build and deploy your app

## Available Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run migrations (development)
- `npm run prisma:push` - Push schema to database without creating migrations
- `npm run prisma:studio` - Open Prisma Studio (GUI database browser)
- `npm run prisma:seed` - Run seed script (if configured)

## Prisma Studio (Database GUI)

To view and edit your data visually:

```bash
npm run prisma:studio
```

This will open a browser interface at `http://localhost:5555` where you can browse and edit your database.

## Troubleshooting

### Connection Issues

If you're having trouble connecting:

1. Make sure your `DATABASE_URL` is correct
2. Check that SSL mode is enabled: `?sslmode=require`
3. Verify your Railway PostgreSQL service is running

### Migration Issues

If migrations fail:

1. Try using `npm run prisma:push` for quick schema updates during development
2. For production, always use migrations: `npm run prisma:migrate`

### Build Issues on Railway

If the build fails on Railway:

1. Make sure `prisma generate` is in your build script (already configured)
2. Verify the `DATABASE_URL` environment variable is set in Railway
3. Check Railway build logs for specific errors

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js with Prisma](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

