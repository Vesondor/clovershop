import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Merchant
  const merchant = await prisma.merchant.upsert({
    where: { id: "default-merchant-id" },
    update: {},
    create: {
      id: "default-merchant-id",
      name: "Clover Default Merchant",
      email: "merchant@clover.com",
      status: "ACTIVE",
    },
  });
  console.log({ merchant });

  // 2. Create Categories
  const categories = [
    "Shirts",
    "Pants",
    "Skirts",
    "Shoes",
    "Socks",
    "Accessories",
    "Underwear",
  ];

  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
      },
    });
    console.log(`Created category: ${category.name}`);
  }

  // 3. Create Default User (Admin)
  const user = await prisma.user.upsert({
    where: { email: "admin@clover.com" },
    update: {},
    create: {
      email: "admin@clover.com",
      role: "admin",
      password: "password123", // Note: In real app, hash this!
    },
  });
  console.log({ user });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
