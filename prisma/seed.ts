
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@akaiblogs.com" },
    update: {},
    create: {
      username: "demo_ronin",
      email: "demo@akaiblogs.com",
      password: hashedPassword,
      bio: "A demo ronin exploring the AkaiBlogs realm.",
    },
  });

  // Create demo blogs
  const categories = ["Technology", "Lifestyle", "Photography", "Travel", "Design"];
  const blogs = [
    {
      title: "The Way of the Code",
      excerpt: "A ronin's guide to mastering the art of programming.",
      content: "In the digital age, the blade is replaced by the keyboard. Every line of code is a strike against chaos. The master coder does not rush — they flow through logic like water through stone.",
      category: "Technology",
    },
    {
      title: "Minimalism in Design",
      excerpt: "Less is more — the philosophy of empty space.",
      content: "True design mastery lies not in what you add, but in what you remove. The empty canvas speaks louder than the cluttered one. Every pixel must earn its place.",
      category: "Design",
    },
    {
      title: "Chasing Sunsets in Kyoto",
      excerpt: "A journey through ancient temples and golden light.",
      content: "The bamboo groves whisper secrets of centuries past. As the sun dips below the pagoda rooftops, the sky ignites in crimson and gold — a painting that no artist could replicate.",
      category: "Travel",
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { id: blog.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: blog.title.toLowerCase().replace(/\s+/g, "-"),
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        authorId: demoUser.id,
      },
    });
  }

  console.log("Seed complete!");
  console.log(`  - User: demo@akaiblogs.com / password123`);
  console.log(`  - Blogs: ${blogs.length} created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });