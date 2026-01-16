const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const demoMerchant = [
  {
    id: "1",
    name: "Demo Merchant",
    description: "This is demo merchant description",
    phone: "1234567890",
    address: "123 Demo St, Demo City, DM 12345",
    status: "active",
    createdAt : new Date(),
    updatedAt : new Date(),
  }
]

const demoProducts = [
  {
    id: "1",
    title: "Classic Green T-Shirt",
    price: 25,
    rating: 5,
    description: "A comfortable classic green t-shirt made from 100% cotton.",
    mainImage: "shirt1.webp",
    slug: "classic-green-t-shirt",
    manufacturer: "Clover Basics",
    categoryId: "shirt-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "2",
    title: "Denim Jeans",
    price: 45,
    rating: 4,
    description: "Durable blue denim jeans for everyday wear.",
    mainImage: "jeans1.webp",
    slug: "denim-jeans",
    manufacturer: "Clover Denim",
    categoryId: "pants-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "3",
    title: "Summer Skirt",
    price: 35,
    rating: 5,
    description: "Lightweight summer skirt with floral patterns.",
    mainImage: "skirt1.webp",
    slug: "summer-skirt",
    manufacturer: "Clover Style",
    categoryId: "skirt-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "4",
    title: "Running Shoes",
    price: 85,
    rating: 4,
    description: "High performance running shoes.",
    mainImage: "shoe1.webp",
    slug: "running-shoes",
    manufacturer: "SportyClover",
    categoryId: "shoe-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "5",
    title: "Ankle Socks (3-Pack)",
    price: 15,
    rating: 5,
    description: "Comfortable ankle socks.",
    mainImage: "socks1.webp",
    slug: "ankle-socks-3pack",
    manufacturer: "Clover Basics",
    categoryId: "socks-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "6",
    title: "Leather Jacket",
    price: 150,
    rating: 5,
    description: "Premium leather jacket.",
    mainImage: "jacket1.webp",
    slug: "leather-jacket",
    manufacturer: "Clover Lux",
    categoryId: "jacket-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "7",
    title: "Silk Scarf",
    price: 40,
    rating: 4,
    description: "Elegant silk scarf.",
    mainImage: "scarf1.webp",
    slug: "silk-scarf",
    manufacturer: "Clover Accessories",
    categoryId: "access-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "8",
    title: "Oxford Button-Down",
    price: 55,
    rating: 4,
    description: "Classic white oxford shirt for formal or casual wear.",
    mainImage: "shirt1.webp",
    slug: "oxford-button-down",
    manufacturer: "Clover Formal",
    categoryId: "shirt-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "9",
    title: "Slim Fit Chinos",
    price: 49,
    rating: 5,
    description: "Beige chinos with a modern slim fit.",
    mainImage: "jeans1.webp",
    slug: "slim-fit-chinos",
    manufacturer: "Clover Denim",
    categoryId: "pants-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "10",
    title: "Pleated Midi Skirt",
    price: 45,
    rating: 3,
    description: "Elegant pleated midi skirt in emerald green.",
    mainImage: "skirt1.webp",
    slug: "pleated-midi-skirt",
    manufacturer: "Clover Style",
    categoryId: "skirt-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "11",
    title: "Canvas Sneakers",
    price: 39,
    rating: 4,
    description: "Casual canvas sneakers for everyday comfort.",
    mainImage: "shoe1.webp",
    slug: "canvas-sneakers",
    manufacturer: "Clover Basics",
    categoryId: "shoe-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "12",
    title: "Wool Crew Socks",
    price: 18,
    rating: 5,
    description: "Warm wool blend socks for winter.",
    mainImage: "socks1.webp",
    slug: "wool-crew-socks",
    manufacturer: "Clover Cozy",
    categoryId: "socks-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "13",
    title: "Bomber Jacket",
    price: 89,
    rating: 4,
    description: "Stylish olive green bomber jacket.",
    mainImage: "jacket1.webp",
    slug: "bomber-jacket",
    manufacturer: "Clover Outerwear",
    categoryId: "jacket-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "14",
    title: "Leather Belt",
    price: 35,
    rating: 5,
    description: "Genuine leather belt in brown.",
    mainImage: "scarf1.webp",
    slug: "leather-belt",
    manufacturer: "Clover Accessories",
    categoryId: "access-cat-id",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "15",
    title: "Polo Shirt",
    price: 30,
    rating: 4,
    description: "Sporty polo shirt with clover logo.",
    mainImage: "shirt1.webp",
    slug: "polo-shirt",
    manufacturer: "SportyClover",
    categoryId: "shirt-cat-id",
    inStock: 1,
    merchantId: "1",
  },
   {
    id: "16",
    title: "Cargo Pants",
    price: 59,
    rating: 4,
    description: "Functional cargo pants with many pockets.",
    mainImage: "jeans1.webp",
    slug: "cargo-pants",
    manufacturer: "Clover Utility",
    categoryId: "pants-cat-id",
    inStock: 1,
    merchantId: "1",
  }
];


const demoCategories = [
  {
    id: "shirt-cat-id",
    name: "shirts",
  },
  {
    id: "pants-cat-id",
    name: "pants",
  },
  {
    id: "skirt-cat-id",
    name: "skirts",
  },
  {
    id: "shoe-cat-id",
    name: "shoes",
  },
  {
    id: "socks-cat-id",
    name: "socks",
  },
  {
    id: "jacket-cat-id",
    name: "jackets",
  },
  {
    id: "access-cat-id",
    name: "accessories",
  }
];

async function insertDemoData() {

  for (const merchant of demoMerchant) {
    await prisma.merchant.create({
      data: merchant,
    });
  }
  console.log("Demo merchant inserted successfully!");

  for (const category of demoCategories) {
    await prisma.category.create({
      data: category,
    });
  }
  console.log("Demo categories inserted successfully!");

  for (const product of demoProducts) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log("Demo products inserted successfully!");
}

insertDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });