const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);
    
    users.forEach(u => {
      console.log(`User: ${u.email}, Role: ${u.role}, ID: ${u.id}`);
    });

    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      console.log("\n✅ Admin user found!");
    } else {
      console.log("\n❌ NO Admin user found!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
