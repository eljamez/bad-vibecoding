import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
    },
  });

  console.log(`✅ Created users: ${user1.name}, ${user2.name}`);

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js and Prisma',
      content: 'This is a comprehensive guide to setting up Next.js with Prisma ORM and PostgreSQL.',
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building Modern Web Applications',
      content: 'Learn how to build scalable and maintainable web applications with modern tools.',
      published: true,
      authorId: user1.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Draft: Upcoming Features',
      content: 'This post is still being written...',
      published: false,
      authorId: user2.id,
    },
  });

  console.log(`✅ Created posts: ${post1.title}, ${post2.title}, ${post3.title}`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

