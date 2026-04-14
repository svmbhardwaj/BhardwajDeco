import { Product, UpdatePost } from "./types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export const DEMO_PRODUCTS: Product[] = [
  {
    _id: generateId(),
    name: "Royal Teak Laminate",
    slug: "royal-teak-laminate",
    category: "laminates",
    textureType: "wood",
    color: "teak",
    finish: "Matte",
    description:
      "Inspired by the rich grain of natural teak, this premium laminate brings warmth and sophistication to any interior space. Its deep, honey-toned color palette and authentic wood grain texture make it a favorite among architects and designers for residential and commercial projects alike.",
    shortDescription: "Premium wood-grain laminate with authentic teak texture",
    features: ["Weather-resistant", "Anti-scratch coating", "UV-stable pigments", "Easy maintenance", "Fire-retardant"],
    specifications: {
      dimensions: "1220 x 2440 mm",
      thickness: "1.0 mm",
      material: "High Pressure Laminate (HPL)",
      weight: "1.8 kg/m²",
      application: "Furniture, Wall Panels, Cabinetry",
      warranty: "10 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594940235898-f4e6793946d6?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    price: "₹890 / sheet",
    createdAt: new Date("2025-12-01").toISOString()
  },
  {
    _id: generateId(),
    name: "Charcoal Oak Laminate",
    slug: "charcoal-oak-laminate",
    category: "laminates",
    textureType: "wood",
    color: "charcoal",
    finish: "Textured",
    description:
      "A bold, contemporary take on the classic oak grain. The charcoal pigmentation adds drama and depth, perfect for modern kitchens, office interiors, and statement walls. The textured surface provides a tactile experience that mirrors real wood.",
    shortDescription: "Dark oak grain with tactile textured finish",
    features: ["Scratch-resistant", "Moisture-proof core", "Eco-friendly resin", "Antibacterial surface"],
    specifications: {
      dimensions: "1220 x 2440 mm",
      thickness: "1.0 mm",
      material: "High Pressure Laminate (HPL)",
      weight: "1.8 kg/m²",
      application: "Kitchen, Office, Wardrobes",
      warranty: "10 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    price: "₹950 / sheet",
    createdAt: new Date("2025-12-05").toISOString()
  },
  {
    _id: generateId(),
    name: "Ivory Silk Laminate",
    slug: "ivory-silk-laminate",
    category: "laminates",
    textureType: "linear",
    color: "ivory",
    finish: "Gloss",
    description:
      "A refined, luminous laminate with a silk-like sheen. The ivory tone brings an airy elegance to minimalist interiors. Its high-gloss finish reflects light beautifully, making smaller spaces appear larger and more open.",
    shortDescription: "Glossy ivory laminate with silk-like luminosity",
    features: ["High-gloss finish", "Stain-resistant", "Easy to clean", "UV-protection layer"],
    specifications: {
      dimensions: "1220 x 2440 mm",
      thickness: "1.0 mm",
      material: "High Pressure Laminate (HPL)",
      weight: "1.7 kg/m²",
      application: "Living Room, Retail Spaces",
      warranty: "8 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80&sat=-100&bri=20",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹780 / sheet",
    createdAt: new Date("2025-12-10").toISOString()
  },
  {
    _id: generateId(),
    name: "Alpine Stone Cladding",
    slug: "alpine-stone-cladding",
    category: "wall-cladding",
    textureType: "stone",
    color: "graphite",
    finish: "Natural",
    description:
      "Capture the raw beauty of alpine rock faces with this meticulously crafted wall cladding. Each panel replicates the irregular textures and shadowing of natural stone, creating a stunning feature wall that requires zero maintenance.",
    shortDescription: "Natural stone-effect cladding with alpine rock texture",
    features: ["Weatherproof (exterior-grade)", "Lightweight panels", "Easy click-lock install", "Frost-resistant", "Zero maintenance"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "12 mm",
      material: "Modified Stone Polymer Composite",
      weight: "5.2 kg/m²",
      application: "Exterior Walls, Feature Walls, Facades",
      warranty: "15 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    price: "₹2,450 / m²",
    createdAt: new Date("2025-11-28").toISOString()
  },
  {
    _id: generateId(),
    name: "Sandstone Brick Cladding",
    slug: "sandstone-brick-cladding",
    category: "wall-cladding",
    textureType: "stone",
    color: "sand",
    finish: "Textured",
    description:
      "This warm sandstone brick cladding evokes the charm of European countryside architecture. The interlocking brick pattern adds depth and character, ideal for accent walls in living rooms, restaurants, and boutique retail spaces.",
    shortDescription: "Warm sandstone brick pattern for accent walls",
    features: ["Interlocking panels", "UV-stable", "Moisture-resistant", "Lightweight (50% lighter than real brick)"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "10 mm",
      material: "PU Stone Composite",
      weight: "4.5 kg/m²",
      application: "Accent Walls, Restaurants, Retail",
      warranty: "12 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹1,980 / m²",
    createdAt: new Date("2025-12-15").toISOString()
  },
  {
    _id: generateId(),
    name: "Concrete Effect Cladding",
    slug: "concrete-effect-cladding",
    category: "wall-cladding",
    textureType: "concrete",
    color: "graphite",
    finish: "Matte",
    description:
      "Bring industrial sophistication to your space with this concrete-effect wall cladding. The subtle variations in grey tones and the raw, tactile surface create an urban-chic aesthetic that pairs beautifully with warm wood tones and metal accents.",
    shortDescription: "Industrial concrete look with a matte finish",
    features: ["Industrial aesthetic", "Sound-absorbing", "Easy to install", "Eco-friendly materials"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "8 mm",
      material: "Fiber Cement Composite",
      weight: "6.0 kg/m²",
      application: "Office Interiors, Lofts, Commercial Spaces",
      warranty: "10 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹2,100 / m²",
    createdAt: new Date("2025-12-20").toISOString()
  },
  {
    _id: generateId(),
    name: "Sahara Flex Stone",
    slug: "sahara-flex-stone",
    category: "soft-stone",
    textureType: "stone",
    color: "sand",
    finish: "Natural",
    description:
      "Harvested from ultra-thin natural stone layers and backed with a flexible polymer sheet, Sahara Flex Stone combines the organic beauty of real stone with incredible versatility. It can be applied to curves, columns, and irregular surfaces where traditional stone cannot go.",
    shortDescription: "Flexible natural stone veneer for curved surfaces",
    features: ["Real natural stone", "Bendable & flexible", "Ultra-lightweight", "DIY-friendly installation", "Interior & exterior use"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "2–3 mm",
      material: "Natural Stone + Polymer Backing (MCM)",
      weight: "2.5 kg/m²",
      application: "Curved Walls, Columns, Furniture Wrap, Fireplaces",
      warranty: "15 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    price: "₹3,200 / m²",
    createdAt: new Date("2025-11-15").toISOString()
  },
  {
    _id: generateId(),
    name: "Midnight Slate MCM",
    slug: "midnight-slate-mcm",
    category: "soft-stone",
    textureType: "stone",
    color: "charcoal",
    finish: "Natural",
    description:
      "Deep, inky blacks with subtle grey veining create a dramatic backdrop that exudes luxury. This Modified Clay Mineral (MCM) stone sheet is paper-thin yet remarkably durable, perfect for creating moody, sophisticated interiors that make a statement.",
    shortDescription: "Dark slate MCM with dramatic veining patterns",
    features: ["Ultra-thin (2mm)", "Fireproof Class A", "Flexible for curved surfaces", "Waterproof"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "2 mm",
      material: "Modified Clay Mineral (MCM)",
      weight: "2.0 kg/m²",
      application: "Feature Walls, Bar Counters, Retail Facades",
      warranty: "12 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹2,800 / m²",
    createdAt: new Date("2025-12-08").toISOString()
  },
  {
    _id: generateId(),
    name: "Rustic Mica MCM",
    slug: "rustic-mica-mcm",
    category: "soft-stone",
    textureType: "stone",
    color: "walnut",
    finish: "Natural",
    description:
      "Warm, earthy tones with glittering mica flecks that catch the light. This flexible stone sheet brings the organic beauty of mica-rich rock into your home without the weight or installation complexity of natural stone.",
    shortDescription: "Earthy mica-flecked flexible stone veneer",
    features: ["Mica mineral finish", "Heat-resistant", "Lightweight", "No grout needed"],
    specifications: {
      dimensions: "600 x 1200 mm",
      thickness: "2.5 mm",
      material: "Natural Mica + Polymer (MCM)",
      weight: "2.3 kg/m²",
      application: "Living Rooms, Bedrooms, Lobbies",
      warranty: "10 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹2,500 / m²",
    createdAt: new Date("2025-12-12").toISOString()
  },
  {
    _id: generateId(),
    name: "Walnut Fluted Panels",
    slug: "walnut-fluted-panels",
    category: "louvers-panels",
    textureType: "fluted",
    color: "walnut",
    finish: "Satin",
    description:
      "Elevate your interiors with these richly toned walnut fluted panels. The rhythmic vertical grooves create a play of light and shadow that adds dimension and architectural interest to any wall. Perfect for living rooms, bedrooms, and reception areas.",
    shortDescription: "Vertical fluted panels in warm walnut tone",
    features: ["CNC-precision grooves", "Sound-dampening", "Termite-proof", "Easy clip-on mounting", "WPC core"],
    specifications: {
      dimensions: "290 x 2900 mm",
      thickness: "22 mm",
      material: "WPC (Wood Plastic Composite)",
      weight: "3.8 kg/m²",
      application: "Living Room, Bedroom, Office Wall",
      warranty: "10 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    price: "₹320 / sq.ft",
    createdAt: new Date("2025-11-20").toISOString()
  },
  {
    _id: generateId(),
    name: "Charcoal Linear Louvers",
    slug: "charcoal-linear-louvers",
    category: "louvers-panels",
    textureType: "linear",
    color: "charcoal",
    finish: "Matte",
    description:
      "Sleek, horizontal louver panels in a deep charcoal finish that bring a contemporary edge to both interior and exterior applications. The precision-engineered slats provide privacy while allowing air circulation, making them ideal for facades, balconies, and partition walls.",
    shortDescription: "Modern horizontal louvers in matte charcoal",
    features: ["Exterior-grade", "Ventilation-friendly", "Rust-proof aluminum core", "Low maintenance"],
    specifications: {
      dimensions: "50 x 2900 mm (per slat)",
      thickness: "30 mm",
      material: "Powder-coated Aluminum + WPC",
      weight: "4.2 kg/m²",
      application: "Facades, Balconies, Partitions, Ceilings",
      warranty: "15 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹380 / sq.ft",
    createdAt: new Date("2025-12-18").toISOString()
  },
  {
    _id: generateId(),
    name: "Ivory Groove Panels",
    slug: "ivory-groove-panels",
    category: "louvers-panels",
    textureType: "fluted",
    color: "ivory",
    finish: "Matte",
    description:
      "Clean, minimalist grooved panels in a creamy ivory finish. These panels bring a Scandinavian-inspired freshness to interiors, adding subtle texture without overwhelming the space. Perfect for bedrooms, study rooms, and light-filled living areas.",
    shortDescription: "Minimalist groove panels in creamy ivory",
    features: ["Lightweight PVC foam", "Moisture-proof", "Tool-free install", "Paintable surface"],
    specifications: {
      dimensions: "300 x 2400 mm",
      thickness: "12 mm",
      material: "PVC Foam Board",
      weight: "2.1 kg/m²",
      application: "Bedrooms, Study, Ceiling Panels",
      warranty: "8 Years"
    },
    heroImage: "https://images.unsplash.com/photo-1594940235898-f4e6793946d6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594940235898-f4e6793946d6?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    price: "₹190 / sq.ft",
    createdAt: new Date("2025-12-22").toISOString()
  }
];

export const DEMO_UPDATES: UpdatePost[] = [
  {
    _id: generateId(),
    title: "HPL Laminate Prices Revised for Q1 2026",
    slug: "hpl-laminate-prices-q1-2026",
    excerpt: "Updated price list effective January 2026 for all High Pressure Laminate grades.",
    content:
      "We are pleased to announce the revised pricing for our HPL laminate range effective January 1, 2026. The new pricing reflects optimized sourcing and improved manufacturing processes, resulting in better value for our customers. All standard sheets (1220x2440mm) will see a 5–8% reduction in pricing across matte, gloss, and textured finishes. Bulk order discounts remain available for orders exceeding 100 sheets. Contact our sales team for the updated rate card and project-specific quotations.",
    type: "price-update",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-01-05").toISOString()
  },
  {
    _id: generateId(),
    title: "Introducing Sahara Flex Stone Collection",
    slug: "sahara-flex-stone-launch",
    excerpt: "New flexible natural stone veneer now available in 6 stunning patterns.",
    content:
      "BhardwajDeco is thrilled to introduce the Sahara Flex Stone Collection — our newest range of ultra-thin natural stone veneers. Sourced from premium quarries and backed with advanced polymer technology, these sheets can bend around curves, wrap columns, and cover irregular surfaces that traditional stone cannot. Available in 6 stunning natural patterns including Sahara Sand, Midnight Slate, Rustic Mica, Silver Cloud, Autumn Gold, and Glacier White. Each sheet is just 2–3mm thin and weighs under 3 kg/m², making installation a breeze. Visit our showroom for live demos and sample kits.",
    type: "new-arrival",
    coverImage: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-02-10").toISOString()
  },
  {
    _id: generateId(),
    title: "Fluted Panels: The Hottest Interior Trend of 2026",
    slug: "fluted-panels-trend-2026",
    excerpt: "Why architects and designers are choosing fluted wall panels for modern interiors.",
    content:
      "Fluted panels have emerged as the defining interior trend of 2026, and for good reason. The rhythmic vertical grooves create a captivating interplay of light and shadow that adds depth, texture, and architectural interest to any space. At BhardwajDeco, we've seen a 300% increase in fluted panel orders compared to last year. From luxury apartments to boutique hotels and corporate offices, these panels are transforming flat walls into design statements. Our WPC and PVC fluted panels come in 12 finishes ranging from warm walnut to cool contemporary charcoal. They're termite-proof, moisture-resistant, and install in half the time of traditional paneling.",
    type: "market-trend",
    coverImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-03-01").toISOString()
  },
  {
    _id: generateId(),
    title: "BhardwajDeco Showroom Now Open in Delhi NCR",
    slug: "delhi-ncr-showroom-opening",
    excerpt: "Visit our new experience center to touch, feel, and compare premium surface materials.",
    content:
      "We are excited to announce the grand opening of the BhardwajDeco Experience Center in Delhi NCR. Spread across 3,000 sq. ft., our showroom features live installations of every product in our catalog — from HPL laminates and wall claddings to flexible stone veneers and fluted panels. Architects and interior designers can book private consultations for project-specific guidance, and we offer complimentary sample kits for shortlisted materials. The showroom also hosts monthly design workshops and trend talks. Come experience the future of surface materials. Located at Sector 18, Noida. Open Monday–Saturday, 10 AM to 7 PM.",
    type: "general",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-03-20").toISOString()
  }
];
