
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@clover.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log('Updated admin password to hash:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
