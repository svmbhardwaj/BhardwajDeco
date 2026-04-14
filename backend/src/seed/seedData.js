import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";
import { Product } from "../models/Product.js";
import { UpdatePost } from "../models/UpdatePost.js";
import { env } from "../config/env.js";

const sampleProducts = [
  {
    name: "Aureum Vein",
    slug: "aureum-vein",
    category: "laminates",
    finish: "Matte",
    description:
      "Stone-inspired laminate with subtle warm veining for luxury interior surfaces.",
    shortDescription: "Warm-veined luxury laminate",
    features: [
      "Anti-fingerprint",
      "Scratch-resistant",
      "UV-stable pigments",
      "Fire-rated Class B1"
    ],
    specifications: {
      dimensions: "1220x2440mm",
      thickness: "1.0mm",
      material: "High Pressure Laminate",
      weight: "1.8kg/m²",
      application: "Kitchen counters, wall panels, furniture",
      warranty: "10 years"
    },
    heroImage:
      "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    price: "₹850/sheet"
  },
  {
    name: "Noir Fluted",
    slug: "noir-fluted",
    category: "wall-cladding",
    finish: "Textured",
    description:
      "Deep linear cladding profile designed for dramatic contrast and architectural rhythm.",
    shortDescription: "Dramatic fluted wall cladding",
    features: [
      "Moisture-resistant",
      "Easy-install click system",
      "Acoustic dampening",
      "Zero-formaldehyde"
    ],
    specifications: {
      dimensions: "600x2400mm",
      thickness: "10mm",
      material: "WPC Composite",
      weight: "2.4kg/m²",
      application: "Feature walls, reception areas, columns",
      warranty: "15 years"
    },
    heroImage:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: true,
    price: "₹1,200/panel"
  },
  {
    name: "Travert Soft Slate",
    slug: "travert-soft-slate",
    category: "soft-stone",
    finish: "Natural",
    description:
      "Flexible soft stone sheet with natural mineral movement and refined earthy tones.",
    shortDescription: "Flexible natural stone veneer",
    features: [
      "Real stone surface",
      "Ultra-lightweight",
      "Bendable on curves",
      "Interior & exterior use"
    ],
    specifications: {
      dimensions: "1220x610mm",
      thickness: "2mm",
      material: "Natural Slate & Fiberglass",
      weight: "1.2kg/m²",
      application: "Accent walls, counters, furniture wraps",
      warranty: "20 years"
    },
    heroImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    isFeatured: false,
    price: "₹2,800/sheet"
  }
];

const sampleUpdates = [
  {
    title: "Material Pairings for Monochrome Interiors",
    slug: "material-pairings-monochrome",
    excerpt:
      "A look at balancing matte laminates, fluted cladding, and warm metallic accents in modern spaces.",
    type: "market-trend",
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Soft Stone Sheets in Boutique Hospitality",
    slug: "soft-stone-boutique-hospitality",
    excerpt:
      "How flexible mineral sheets can elevate reception walls and lounge zones with tactile depth.",
    type: "market-trend",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
  }
];

export async function seedDatabase({ exitOnComplete = true } = {}) {
  try {
    await connectDB();
    console.log("\n🌱 Seeding BhardwajDeco database…\n");

    // ─── Seed Admin ───
    const existingAdmin = await Admin.findOne({ email: env.adminEmail });
    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${env.adminEmail}`);
    } else {
      await Admin.create({
        email: env.adminEmail,
        password: env.adminPassword
      });
      console.log(`✅ Admin created: ${env.adminEmail}`);
    }

    // ─── Seed Products ───
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products`);

    // ─── Seed Updates ───
    await UpdatePost.deleteMany({});
    await UpdatePost.insertMany(sampleUpdates);
    console.log(`✅ Seeded ${sampleUpdates.length} updates`);

    console.log("\n🎉 Seed complete!\n");
    console.log(`   Admin Email:    ${env.adminEmail}`);
    console.log(`   Admin Password: ${env.adminPassword}`);
    console.log(`   (Change password after first login)\n`);

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Seed failed:", error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
}

if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  seedDatabase();
}
