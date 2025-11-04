# Quick Start Guide - Railway PostgreSQL + Prisma

## 🚀 Setup Steps (5 minutes)

### 1. Create Railway PostgreSQL Database
```bash
# Option A: Using Railway Web Console
# 1. Go to https://railway.app
# 2. Create new project → Add PostgreSQL
# 3. Copy the DATABASE_URL from Variables tab

# Option B: Using Railway CLI (if installed)
railway login
railway init
railway add postgresql
railway variables
```

### 2. Configure Local Environment
```bash
# Create .env file
touch .env

# Add your DATABASE_URL (get from Railway → PostgreSQL → Variables)
echo 'DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"' >> .env
```

### 3. Generate Prisma Client & Setup Database
```bash
# Generate Prisma Client from schema
npm run prisma:generate

# Create database tables (creates migration)
npm run prisma:migrate

# (Optional) Seed database with example data
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Database Connection
Open http://localhost:3000/test-db in your browser

---

## 📝 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run prisma:studio         # Open database GUI (localhost:5555)

# Database Schema Changes
npm run prisma:migrate        # Create migration after schema changes
npm run prisma:push           # Push schema without creating migration (quick dev)
npm run prisma:generate       # Regenerate Prisma Client

# Database Management
npm run prisma:seed           # Seed database with test data
```

---

## 🔧 Example Usage

### In API Routes (`app/api/*/route.ts`)
```typescript
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

### In Server Components (`app/*/page.tsx`)
```typescript
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const users = await prisma.user.findMany();
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 🌐 Available API Endpoints

Test these with curl or Postman:

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Get all posts
curl http://localhost:3000/api/posts

# Create a post (need a valid authorId from users)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Content here","authorId":"user_id","published":true}'
```

---

## 📊 Database Schema

Current schema includes:
- **User**: id, email, name, createdAt, updatedAt
- **Post**: id, title, content, published, authorId, createdAt, updatedAt

Edit `prisma/schema.prisma` to add more models.

---

## 🚢 Deploy to Railway

### 1. Connect Repository
```bash
# Push your code to GitHub
git add .
git commit -m "Add Prisma setup"
git push origin main
```

### 2. Deploy on Railway
1. Railway Dashboard → New → GitHub Repo
2. Select your repository
3. Railway auto-detects Next.js

### 3. Link Database
1. Click your **Next.js service** (not the database)
2. Go to **Variables** tab
3. Click **+ New Variable** → **Reference**
4. Select PostgreSQL → `DATABASE_URL`
5. Redeploy if needed

### 4. Run Migrations on Railway
```bash
# Option A: Via Railway CLI
railway run npm run prisma:migrate deploy

# Option B: Add to package.json build script (already configured)
# The build script already includes "prisma generate"
```

---

## 🐛 Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure `.env` file exists and contains `DATABASE_URL`
- Restart your dev server after creating `.env`

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify PostgreSQL is running on Railway
- Ensure `?sslmode=require` is at the end of the URL

### Prisma Client errors
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Database out of sync
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or push schema changes
npm run prisma:push
```

---

## 📚 Learn More

- [Full Railway Setup Guide](./RAILWAY_SETUP.md)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js + Prisma Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

---

## ✅ Checklist

- [ ] Created Railway PostgreSQL database
- [ ] Copied DATABASE_URL to `.env` file
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:migrate`
- [ ] Tested at http://localhost:3000/test-db
- [ ] Created your first user via API
- [ ] Explored Prisma Studio (`npm run prisma:studio`)

