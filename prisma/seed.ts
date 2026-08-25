import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌿 Seeding LeLe-Organics database...");

  // -----------------------------
  // Categories
  // -----------------------------

  const ghee = await prisma.category.upsert({
    where: {
      slug: "desi-ghee",
    },
    update: {},
    create: {
      name: "Desi Ghee",
      slug: "desi-ghee",
      description:
        "Traditional desi ghee made from carefully sourced milk and crafted for everyday goodness.",
      isActive: true,
    },
  });

  const honey = await prisma.category.upsert({
    where: {
      slug: "raw-honey",
    },
    update: {},
    create: {
      name: "Raw Honey",
      slug: "raw-honey",
      description:
        "Naturally sourced raw honey with rich flavour and natural goodness.",
      isActive: true,
    },
  });

  const salt = await prisma.category.upsert({
    where: {
      slug: "natural-salts",
    },
    update: {},
    create: {
      name: "Natural Salts",
      slug: "natural-salts",
      description:
        "Pure mineral-rich salts sourced from natural Himalayan regions.",
      isActive: true,
    },
  });

  const essentials = await prisma.category.upsert({
    where: {
      slug: "natural-essentials",
    },
    update: {},
    create: {
      name: "Natural Essentials",
      slug: "natural-essentials",
      description:
        "Thoughtfully sourced natural essentials for everyday living.",
      isActive: true,
    },
  });

  // -----------------------------
  // Products
  // -----------------------------

  await prisma.product.upsert({
    where: {
      slug: "premium-desi-cow-ghee",
    },
    update: {
  images: {
    deleteMany: {},
    create: [
      {
        url: "/premium-desi-cow-ghee-v2.png",
        altText: "Premium Desi Cow Ghee",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
},
    create: {
      categoryId: ghee.id,
      name: "Premium Desi Cow Ghee",
      slug: "premium-desi-cow-ghee",
      description:
        "Rich and aromatic desi cow ghee traditionally crafted for authentic flavour and everyday nourishment.",
      shortDescription: "Rich, golden and traditionally crafted.",
      sku: "LELE-GHEE-500",
      price: 1299,
      compareAtPrice: 1499,
      stock: 100,
      weight: 500,
      weightUnit: "ml",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
    },
  });

  await prisma.product.upsert({
    where: {
      slug: "raw-forest-honey",
    },
    update: {
      images: {
        deleteMany: {},
        create: [
          {
            url: "/raw-forest-honey.png",
            altText: "Raw Forest Honey",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
    create: {
      categoryId: honey.id,
      name: "Raw Forest Honey",
      slug: "raw-forest-honey",
      description:
        "Naturally sourced raw forest honey with a deep, distinctive flavour inspired by nature.",
      shortDescription: "Pure raw honey, straight from nature.",
      sku: "LELE-HONEY-500",
      price: 899,
      compareAtPrice: 999,
      stock: 100,
      weight: 500,
      weightUnit: "g",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
    },
  });

  await prisma.product.upsert({
    where: {
      slug: "himalayan-pink-rock-salt",
    },
    update: {
      images: {
        deleteMany: {},
        create: [
          {
            url: "/himalayan-pink-rock-salt.png",
            altText: "Himalayan Pink Rock Salt",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
    create: {
      categoryId: salt.id,
      name: "Himalayan Pink Rock Salt",
      slug: "himalayan-pink-rock-salt",
      description:
        "Pure mineral-rich Himalayan pink rock salt, carefully sourced for everyday cooking.",
      shortDescription: "Pure Himalayan mineral-rich salt.",
      sku: "LELE-SALT-1000",
      price: 249,
      compareAtPrice: 299,
      stock: 200,
      weight: 1000,
      weightUnit: "g",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
    },
  });

  await prisma.product.upsert({
    where: {
      slug: "organic-turmeric-powder",
    },
    update: {},
    create: {
      categoryId: essentials.id,
      name: "Organic Turmeric Powder",
      slug: "organic-turmeric-powder",
      description:
        "Carefully sourced organic turmeric powder with natural colour, aroma and traditional character.",
      shortDescription: "Pure organic turmeric for everyday cooking.",
      sku: "LELE-TURMERIC-250",
      price: 299,
      compareAtPrice: 349,
      stock: 150,
      weight: 250,
      weightUnit: "g",
      status: "ACTIVE",
      isFeatured: false,
      isBestseller: false,
    },
  });

  console.log("✅ Categories created.");
  console.log("✅ Products created.");
  console.log("🌿 LeLe-Organics database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
