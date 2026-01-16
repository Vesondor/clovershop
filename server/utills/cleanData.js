const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function clean() {
  await prisma.customer_order_product.deleteMany();
  await prisma.customer_order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.bulk_upload_item.deleteMany();
  await prisma.bulk_upload_batch.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.merchant.deleteMany();
  console.log("Cleaned.");
}
clean().catch(console.error).finally(() => prisma.$disconnect());