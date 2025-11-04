# Authentication Setup Guide

This project now includes a complete authentication system built with NextAuth.js v5 (Auth.js), following industry best practices.

## ✨ Features Implemented

- **Secure Password Authentication**: Using bcrypt for password hashing
- **Session Management**: JWT-based sessions via NextAuth.js
- **Database Integration**: Prisma adapter with PostgreSQL
- **Protected Routes**: Middleware for route protection
- **Beautiful UI**: Modern login/signup pages with Tailwind CSS
- **User Management**: Complete CRUD operations for users

## 🔧 Required Environment Variables

Add these to your `.env` file:

```env
# NextAuth Configuration
AUTH_SECRET="LP4WMev5cs2FEueFdSAZz9Lpwm+r70qtLe2YXwiXgnA="
AUTH_URL="http://localhost:3000"

# Your existing DATABASE_URL should already be set
DATABASE_URL="postgresql://..."
```

### Generating a New Secret

If you need to generate a new `AUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

Or use the NextAuth CLI:

```bash
npx auth secret
```

## 📁 Files Created/Modified

### New Files:
- `auth.ts` - NextAuth configuration with Prisma adapter
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `app/api/signup/route.ts` - User registration endpoint
- `app/login/page.tsx` - Login page with form
- `app/signup/page.tsx` - Signup page with form
- `app/components/Navbar.tsx` - Navigation with auth status
- `app/components/SessionProvider.tsx` - Session context provider
- `middleware.ts` - Route protection middleware
- `types/next-auth.d.ts` - TypeScript type extensions

### Modified Files:
- `prisma/schema.prisma` - Added User.password, Account, Session, VerificationToken models
- `app/layout.tsx` - Added SessionProvider and Navbar
- `package.json` - Added next-auth, @auth/prisma-adapter, bcryptjs

### Database Migration:
- `prisma/migrations/20251104002807_add_auth_tables/` - Applied migration

## 🚀 Getting Started

1. **Ensure environment variables are set** in your `.env` file
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Navigate to** `http://localhost:3000`

## 📱 Usage

### User Registration
1. Visit `/signup`
2. Fill in name (optional), email, and password (minimum 8 characters)
3. Submit the form
4. You'll be automatically logged in and redirected to home

### User Login
1. Visit `/login`
2. Enter your email and password
3. Submit the form
4. You'll be redirected to home with an active session

### Logout
- Click the "Logout" button in the navigation bar
- You'll be logged out and redirected to home

### Protected Routes
- By default, all routes except `/`, `/login`, and `/signup` require authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users trying to access `/login` or `/signup` are redirected to `/`

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Password Validation**: Minimum 8 characters
- **Email Validation**: Standard email format required
- **Unique Emails**: Database constraint prevents duplicate accounts
- **Session Security**: JWT tokens with secure configuration
- **CSRF Protection**: Built into NextAuth
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🎨 Customization

### Modify Protected Routes
Edit `middleware.ts` to change which routes require authentication:

```typescript
const publicRoutes = ["/", "/login", "/signup", "/about"]; // Add your public routes
```

### Change Auth Behavior
Edit `auth.ts` to modify:
- JWT expiration
- Session strategy
- Custom callbacks
- Additional providers (Google, GitHub, etc.)

### Customize UI
The login and signup pages use Tailwind CSS. Modify:
- `app/login/page.tsx` - Login page design
- `app/signup/page.tsx` - Signup page design
- `app/components/Navbar.tsx` - Navigation bar design

## 🧪 Testing the Auth System

### Manual Testing Checklist:
- ✅ Create a new account via `/signup`
- ✅ Login with correct credentials
- ✅ Try logging in with wrong password (should fail)
- ✅ Try accessing protected routes without login (should redirect to login)
- ✅ Logout and verify session is cleared
- ✅ Try creating account with existing email (should fail)
- ✅ Verify password requirements (minimum 8 characters)

## 📚 Additional Resources

- [NextAuth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

## 🔄 Next Steps

Consider implementing:
- Email verification
- Password reset functionality
- OAuth providers (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- Rate limiting for login attempts
- Remember me functionality
- User profile management
- Role-based access control (RBAC)

## 🐛 Troubleshooting

### "AUTH_SECRET is not set"
Make sure you've added `AUTH_SECRET` to your `.env` file.

### Database connection errors
Verify your `DATABASE_URL` is correct and the database is running.

### Session not persisting
Check that cookies are enabled in your browser and `AUTH_URL` matches your current domain.

### Migration errors
Try resetting the database:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

