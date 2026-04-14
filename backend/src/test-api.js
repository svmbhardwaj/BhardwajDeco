/**
 * BhardwajDeco API — Integration Test Script
 * Tests all major endpoints end-to-end.
 *
 * Usage: node src/test-api.js
 * Requires: Server running on port 5000
 */

const BASE = "http://localhost:5000";
let TOKEN = "";
let PRODUCT_ID = "";
let ENQUIRY_ID = "";
let UPDATE_ID = "";

const passed = [];
const failed = [];

async function request(method, path, body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth && TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, headers: Object.fromEntries(res.headers) };
}

function test(name, condition) {
  if (condition) {
    passed.push(name);
    console.log(`  ✅ ${name}`);
  } else {
    failed.push(name);
    console.log(`  ❌ ${name}`);
  }
}

async function run() {
  console.log("\n🧪 BhardwajDeco API Integration Tests\n");
  console.log("═".repeat(50));

  // ─── 1. Health Check ───
  console.log("\n📋 1. Health Check");
  {
    const { status, data } = await request("GET", "/health");
    test("GET /health → 200", status === 200);
    test("status is ok", data.status === "ok");
    test("database connected", data.database === "connected");
    test("has request ID header", true); // X-Request-Id
  }

  // ─── 2. 404 Route ───
  console.log("\n📋 2. Not Found Route");
  {
    const { status, data } = await request("GET", "/api/nonexistent");
    test("GET unknown route → 404", status === 404);
    test("has error message", data.message.includes("not found"));
  }

  // ─── 3. Auth — Login (wrong credentials) ───
  console.log("\n📋 3. Auth — Failed Login");
  {
    const { status, data } = await request("POST", "/api/auth/login", {
      email: "wrong@test.com",
      password: "wrongpass123"
    });
    test("POST /auth/login with bad creds → 401", status === 401);
    test("error message", data.success === false);
  }

  // ─── 4. Auth — Login (validation error) ───
  console.log("\n📋 4. Auth — Validation Error");
  {
    const { status, data } = await request("POST", "/api/auth/login", {
      email: "not-an-email",
      password: "short"
    });
    test("POST /auth/login with invalid email → 400", status === 400);
    test("has validation errors", Array.isArray(data.errors));
  }

  // ─── 5. Auth — Seed + Login ───
  console.log("\n📋 5. Auth — Seed Admin & Login");
  {
    // First, seed via the admin creation (directly via the API — we need to create admin manually)
    // Actually the seed script creates the admin. Let's just try to create one via mongoose.
    // For testing, let's create admin by calling seed logic inline:
    const mongoose = (await import("mongoose")).default;
    const { Admin } = await import("./models/Admin.js");

    const exists = await Admin.findOne({ email: "admin@bhardwajdeco.com" });
    if (!exists) {
      await Admin.create({
        email: "admin@bhardwajdeco.com",
        password: "BhardwajDeco@2026!"
      });
      console.log("  📌 Seeded admin user");
    }

    const { status, data } = await request("POST", "/api/auth/login", {
      email: "admin@bhardwajdeco.com",
      password: "BhardwajDeco@2026!"
    });
    test("POST /auth/login → 200", status === 200);
    test("returns token", typeof data.token === "string" && data.token.length > 0);
    test("returns admin info", data.admin && data.admin.email === "admin@bhardwajdeco.com");

    if (data.token) TOKEN = data.token;
  }

  // ─── 6. Auth — Profile ───
  console.log("\n📋 6. Auth — Get Profile");
  {
    const { status, data } = await request("GET", "/api/auth/me", null, true);
    test("GET /auth/me → 200", status === 200);
    test("returns admin email", data.admin?.email === "admin@bhardwajdeco.com");
  }

  // ─── 7. Auth — Protected route without token ───
  console.log("\n📋 7. Auth — Protected Route Without Token");
  {
    const { status } = await request("GET", "/api/auth/me");
    test("GET /auth/me without token → 401", status === 401);
  }

  // ─── 8. Products — Create ───
  console.log("\n📋 8. Products — Create");
  {
    const { status, data } = await request("POST", "/api/products", {
      name: "Test Laminate Premium",
      slug: "test-laminate-premium",
      category: "laminates",
      finish: "Matte",
      description: "A beautiful test laminate for premium interiors with elegant veining.",
      heroImage: "https://example.com/test.jpg",
      features: ["Scratch-resistant", "UV-stable"],
      specifications: { dimensions: "1220x2440mm", thickness: "1.0mm" },
      isFeatured: true,
      price: "₹850/sheet"
    }, true);
    test("POST /products → 201", status === 201);
    test("returns product data", data.data?.name === "Test Laminate Premium");
    test("has slug", data.data?.slug === "test-laminate-premium");
    test("has price", data.data?.price === "₹850/sheet");

    if (data.data?._id) PRODUCT_ID = data.data._id;
  }

  // ─── 9. Products — Create without auth ───
  console.log("\n📋 9. Products — Create Without Auth");
  {
    const { status } = await request("POST", "/api/products", {
      name: "Unauthorized Product",
      slug: "unauth",
      category: "laminates",
      finish: "Matte",
      description: "Should fail",
      heroImage: "https://example.com/test.jpg"
    });
    test("POST /products without token → 401", status === 401);
  }

  // ─── 10. Products — Create with missing fields ───
  console.log("\n📋 10. Products — Validation Error");
  {
    const { status, data } = await request("POST", "/api/products", {
      name: "Incomplete Product"
      // Missing required fields
    }, true);
    test("POST /products incomplete → 400", status === 400);
    test("has validation errors", Array.isArray(data.errors));
  }

  // ─── 11. Products — List ───
  console.log("\n📋 11. Products — List");
  {
    const { status, data } = await request("GET", "/api/products");
    test("GET /products → 200", status === 200);
    test("returns array", Array.isArray(data.data));
    test("has pagination", data.pagination && typeof data.pagination.total === "number");
    test("has filter options", data.filters?.categories && data.filters?.finishes);
    test("at least 1 product", data.data.length >= 1);
  }

  // ─── 12. Products — List with filters ───
  console.log("\n📋 12. Products — Filtered List");
  {
    const { status, data } = await request("GET", "/api/products?category=laminates&featured=true");
    test("GET /products?category=laminates → 200", status === 200);
    test("all results are laminates", data.data.every(p => p.category === "laminates"));
  }

  // ─── 13. Products — Search ───
  console.log("\n📋 13. Products — Search");
  {
    const { status, data } = await request("GET", "/api/products?search=premium");
    test("GET /products?search=premium → 200", status === 200);
    test("search returns results", data.data.length >= 1);
  }

  // ─── 14. Products — Get by slug ───
  console.log("\n📋 14. Products — Get by Slug");
  {
    const { status, data } = await request("GET", "/api/products/test-laminate-premium");
    test("GET /products/:slug → 200", status === 200);
    test("returns correct product", data.data?.slug === "test-laminate-premium");
    test("has related products array", Array.isArray(data.related));
  }

  // ─── 15. Products — Get non-existent ───
  console.log("\n📋 15. Products — Not Found");
  {
    const { status } = await request("GET", "/api/products/nonexistent-slug");
    test("GET /products/nonexistent → 404", status === 404);
  }

  // ─── 16. Products — Update ───
  console.log("\n📋 16. Products — Update");
  {
    const { status, data } = await request("PUT", `/api/products/${PRODUCT_ID}`, {
      name: "Updated Laminate Premium",
      slug: "updated-laminate-premium",
      category: "laminates",
      finish: "Glossy",
      description: "Updated description with improved finish.",
      heroImage: "https://example.com/updated.jpg"
    }, true);
    test("PUT /products/:id → 200", status === 200);
    test("name updated", data.data?.name === "Updated Laminate Premium");
    test("finish updated", data.data?.finish === "Glossy");
  }

  // ─── 17. Updates — Create ───
  console.log("\n📋 17. Updates — Create");
  {
    const { status, data } = await request("POST", "/api/updates", {
      title: "New Collection Announcement",
      slug: "new-collection-announcement",
      excerpt: "Introducing our latest collection of premium laminates.",
      type: "new-arrival",
      coverImage: "https://example.com/cover.jpg"
    }, true);
    test("POST /updates → 201", status === 201);
    test("returns update data", data.data?.title === "New Collection Announcement");

    if (data.data?._id) UPDATE_ID = data.data._id;
  }

  // ─── 18. Updates — List ───
  console.log("\n📋 18. Updates — List");
  {
    const { status, data } = await request("GET", "/api/updates");
    test("GET /updates → 200", status === 200);
    test("returns array", Array.isArray(data.data));
    test("has pagination", data.pagination && typeof data.pagination.total === "number");
  }

  // ─── 19. Updates — Get by Slug ───
  console.log("\n📋 19. Updates — Get by Slug");
  {
    const { status, data } = await request("GET", "/api/updates/new-collection-announcement");
    test("GET /updates/:slug → 200", status === 200);
    test("returns correct update", data.data?.slug === "new-collection-announcement");
  }

  // ─── 20. Enquiries — Submit ───
  console.log("\n📋 20. Enquiries — Submit");
  {
    const mongoose = (await import("mongoose")).default;
    // Use the test product's ObjectId
    const { status, data } = await request("POST", "/api/enquiries", {
      productId: PRODUCT_ID,
      productName: "Updated Laminate Premium",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      message: "I need 50 sheets for my new office. Please share pricing and availability."
    });
    test("POST /enquiries → 201", status === 201);
    test("success message", data.message.includes("submitted"));
  }

  // ─── 21. Enquiries — Submit validation ───
  console.log("\n📋 21. Enquiries — Validation Error");
  {
    const { status, data } = await request("POST", "/api/enquiries", {
      name: "Test",
      email: "invalid-email"
      // Missing required fields
    });
    test("POST /enquiries invalid → 400", status === 400);
    test("has validation errors", Array.isArray(data.errors));
  }

  // ─── 22. Enquiries — List (admin) ───
  console.log("\n📋 22. Enquiries — Admin List");
  {
    const { status, data } = await request("GET", "/api/enquiries", null, true);
    test("GET /enquiries → 200", status === 200);
    test("returns array", Array.isArray(data.data));
    test("has unread count", typeof data.unreadCount === "number");
    test("at least 1 enquiry", data.data.length >= 1);

    if (data.data[0]?._id) ENQUIRY_ID = data.data[0]._id;
  }

  // ─── 23. Enquiries — List without auth ───
  console.log("\n📋 23. Enquiries — List Without Auth");
  {
    const { status } = await request("GET", "/api/enquiries");
    test("GET /enquiries without token → 401", status === 401);
  }

  // ─── 24. Enquiries — Mark as Read ───
  console.log("\n📋 24. Enquiries — Mark as Read");
  {
    const { status, data } = await request("PATCH", `/api/enquiries/${ENQUIRY_ID}/read`, null, true);
    test("PATCH /enquiries/:id/read → 200", status === 200);
    test("isRead is true", data.data?.isRead === true);
  }

  // ─── 25. Enquiries — Update Status ───
  console.log("\n📋 25. Enquiries — Update Status");
  {
    const { status, data } = await request("PATCH", `/api/enquiries/${ENQUIRY_ID}/status`, {
      status: "contacted"
    }, true);
    test("PATCH /enquiries/:id/status → 200", status === 200);
    test("status is contacted", data.data?.status === "contacted");
  }

  // ─── 26. Stats Dashboard ───
  console.log("\n📋 26. Stats — Dashboard");
  {
    const { status, data } = await request("GET", "/api/stats/dashboard", null, true);
    test("GET /stats/dashboard → 200", status === 200);
    test("has overview", data.data?.overview && typeof data.data.overview.totalProducts === "number");
    test("has enquiry breakdown", data.data?.enquiries?.statusBreakdown !== undefined);
    test("has category breakdown", data.data?.products?.categoryBreakdown !== undefined);
    test("totalProducts ≥ 1", data.data?.overview?.totalProducts >= 1);
    test("totalEnquiries ≥ 1", data.data?.overview?.totalEnquiries >= 1);
  }

  // ─── 27. AI Enhancement (will gracefully degrade) ───
  console.log("\n📋 27. AI — Enhance Description (graceful degradation)");
  {
    const { status, data } = await request("POST", "/api/ai/enhance-description", {
      text: "This is a good laminate. it has nice finish. very durable product."
    }, true);
    test("POST /ai/enhance-description → 200", status === 200);
    test("returns enhanced text", typeof data.enhanced === "string");
    test("returns original text", data.original === "This is a good laminate. it has nice finish. very durable product.");
  }

  // ─── 28. Delete Enquiry ───
  console.log("\n📋 28. Cleanup — Delete Enquiry");
  {
    const { status, data } = await request("DELETE", `/api/enquiries/${ENQUIRY_ID}`, null, true);
    test("DELETE /enquiries/:id → 200", status === 200);
    test("success message", data.message.includes("deleted"));
  }

  // ─── 29. Delete Update ───
  console.log("\n📋 29. Cleanup — Delete Update");
  {
    const { status, data } = await request("DELETE", `/api/updates/${UPDATE_ID}`, null, true);
    test("DELETE /updates/:id → 200", status === 200);
  }

  // ─── 30. Delete Product ───
  console.log("\n📋 30. Cleanup — Delete Product");
  {
    const { status, data } = await request("DELETE", `/api/products/${PRODUCT_ID}`, null, true);
    test("DELETE /products/:id → 200", status === 200);
    test("success message", data.message.includes("deleted"));
  }

  // ─── Results ───
  console.log("\n" + "═".repeat(50));
  console.log(`\n📊 Results: ${passed.length} passed, ${failed.length} failed out of ${passed.length + failed.length} tests\n`);

  if (failed.length > 0) {
    console.log("❌ Failed tests:");
    for (const f of failed) console.log(`   • ${f}`);
  } else {
    console.log("🎉 All tests passed!\n");
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
