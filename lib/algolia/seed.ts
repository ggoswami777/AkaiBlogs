import { prisma } from "../prisma";
import { blogsIndex, usersIndex } from "./client";
import { toAlgoliaBlog, toAlgoliaUser } from "./transformer";
export async function seedAlgolia() {
  console.log("Starting Algolia index seeding...");
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      include: { author: true }
    });
    const algoliaBlogs = blogs.map(toAlgoliaBlog);
    if (algoliaBlogs.length > 0) {
      await blogsIndex.saveObjects(algoliaBlogs);
      console.log(`Successfully seeded ${algoliaBlogs.length} blogs to Algolia.`);
    }
    const users = await prisma.user.findMany();
    const algoliaUsers = users.map(toAlgoliaUser);
    if (algoliaUsers.length > 0) {
      await usersIndex.saveObjects(algoliaUsers);
      console.log(`Successfully seeded ${algoliaUsers.length} users to Algolia.`);
    }
    console.log("Algolia seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding Algolia:", error);
    throw error;
  }
}
seedAlgolia()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
 });