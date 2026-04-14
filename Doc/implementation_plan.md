# BhardwajDeco – Frontend-Only Marketplace & Admin Panel

## Goal
Transform the existing BhardwajDeco Next.js codebase from a backend-dependent catalog into a **fully self-contained frontend application** with:
1. **Admin Panel** – Full CRUD for products & updates (image/file upload, title, description, specs, gallery)
2. **Public Marketplace** – Premium browsing experience with filtering, product details, and enquiry forms
3. **localStorage persistence** – All data stored client-side until the backend is ready

## Current State
The existing code has a good foundation (Next.js 15, Tailwind 3, Framer Motion, Lucide icons) but all data flows through `axios` calls to a non-existent backend (`localhost:5000/api`), meaning the app shows **empty pages**. The admin panel has basic form fields but no working CRUD.

---

## Proposed Changes

### 1. Data Layer – Replace API with localStorage Store

#### [MODIFY] [types.ts](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/lib/types.ts)
- Expand `ProductSpecification` with more fields: `material`, `weight`, `application`, `warranty`
- Add `gallery` as required array of strings
- Add `price` (optional string, for display like "₹890/sq.ft")
- Add `createdAt` timestamp

#### [NEW] [store.ts](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/lib/store.ts)
- localStorage-based CRUD operations for Products and Updates
- `getProducts()`, `getProductBySlug()`, `createProduct()`, `updateProduct()`, `deleteProduct()`
- `getUpdates()`, `getUpdateBySlug()`, `createUpdate()`, `deleteUpdate()`
- `submitEnquiry()` – stores to localStorage enquiries list
- Image handling: convert uploaded files to base64 data URLs for localStorage storage

#### [NEW] [seed-data.ts](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/lib/seed-data.ts)
- 12+ demo products across all 4 categories (laminates, wall cladding, soft stone, louvers/panels)
- Each product has: real Unsplash image URLs, detailed descriptions, specs, features
- 4+ demo community updates (price changes, new arrivals, trends)
- Auto-seeds on first visit if localStorage is empty

#### [DELETE] [api.ts](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/lib/api.ts) 
- Remove the axios-based API layer entirely (replaced by store.ts)

---

### 2. Admin Panel – Complete Rebuild

#### [NEW] [admin/layout.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/admin/layout.tsx)
- Dedicated admin layout with sidebar navigation (Dashboard, Products, Updates, Enquiries)
- Dark premium admin theme with gold accents
- Admin branding header

#### [MODIFY] [admin/page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/admin/page.tsx)
- Dashboard with stats cards: total products, total enquiries, total updates
- Quick action buttons for adding new products/updates
- Recent activity feed

#### [NEW] [AdminProductsClient.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/catalog/AdminProductsClient.tsx) (rewrite)
- Full product form with:
  - Image upload (drag-and-drop + click) with preview → stored as base64
  - Gallery: multiple image upload support
  - Title, slug (auto-generated from title), category dropdown
  - Rich description textarea
  - Specs: dimensions, thickness, material, weight, application area, warranty
  - Features as tag-style input
  - Color, finish, texture type pickers
- Product list with image thumbnails, edit/delete actions
- Search and filter within admin product list

#### [NEW] [AdminUpdatesClient.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/catalog/AdminUpdatesClient.tsx) (rewrite)
- Update form with: title, type (price-update/new-arrival/market-trend/general), cover image upload, rich content
- List of existing updates with edit/delete actions

#### [NEW] [admin/enquiries/page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/admin/enquiries/page.tsx)
- View all submitted enquiries in a table
- Mark as read/unread, delete capability

---

### 3. Public Marketplace – Premium Redesign

#### [MODIFY] [layout.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/layout.tsx)
- Enhanced navbar with mobile hamburger menu
- Improved footer with category links, contact info, social icons
- Google Font imports (Inter for body, Playfair Display for headings)

#### [MODIFY] [page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/page.tsx) (Home)
- Hero section with animated gradient overlay and CTA buttons
- Featured Products carousel (auto-populated from localStorage)
- Category cards with hover effects and product count badges
- "Why BhardwajDeco" section with icon-based feature cards
- Testimonials/trust section
- Contact section with form

#### [MODIFY] [products/page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/products/page.tsx)
- Convert from server component to client component (reads from localStorage)
- Enhanced filter bar with visual category pills
- Grid/masonry layout toggle
- Product count display

#### [MODIFY] [products/[slug]/page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/products/%5Bslug%5D/page.tsx)
- Convert to client component
- Full-width hero image with parallax-like effect
- Image gallery with lightbox/modal viewer
- Detailed specs table
- Features with icons
- Enquiry form with localStorage submission
- Related products section

#### [MODIFY] [updates/page.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/updates/page.tsx)
- Convert to client component
- Type-based filtering (price updates, new arrivals, etc.)
- Card-based layout with cover images

---

### 4. Enhanced Components

#### [MODIFY] All UI components
- `FilterBar.tsx` – Enhanced with animated category pills, search input
- `ProductTile.tsx` – Add hover overlay with quick view, glassmorphism card style
- `ProductMasonry.tsx` – Support grid/masonry toggle
- `EnquiryForm.tsx` – Connect to localStorage, add validation feedback
- `Reveal.tsx` – Keep as-is (already good)
- `SectionHeading.tsx` – Keep as-is

#### [NEW] [ImageUpload.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/ui/ImageUpload.tsx)
- Drag-and-drop image upload component
- Preview with remove button
- Converts to base64 for localStorage storage
- Used in both admin product and update forms

#### [NEW] [ImageGallery.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/ui/ImageGallery.tsx)
- Lightbox-style image viewer for product detail page
- Thumbnail grid with click-to-expand
- Keyboard navigation (left/right/escape)

#### [NEW] [StatsCard.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/ui/StatsCard.tsx)
- Animated stats card for admin dashboard

#### [NEW] [MobileMenu.tsx](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/components/ui/MobileMenu.tsx)
- Slide-in mobile navigation menu

---

### 5. Styling & Config

#### [MODIFY] [globals.css](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/src/app/globals.css)
- Import Google Fonts (Inter, Playfair Display)
- Add glassmorphism utility classes
- Add custom scrollbar styling
- Add gradient animation keyframes
- Polish dark theme variables

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/tailwind.config.ts)
- Extend color palette with richer gold tones and accent colors
- Add custom animations (fade-in, slide-up, pulse-gold)
- Add backdrop-blur and glassmorphism extensions

#### [MODIFY] [next.config.mjs](file:///c:/Users/svmbh/OneDrive/Desktop/BhardwajDeco/frontend/next.config.mjs)
- Keep Unsplash + Cloudinary remote patterns
- Add `unoptimized: true` for base64 data URL images from localStorage

---

> [!IMPORTANT]
> All data is stored in `localStorage`. This means:
> - Data persists across page refreshes but is browser-specific
> - The app auto-seeds with 12+ demo products on first visit
> - Admin can add/edit/delete products and they appear instantly on the marketplace
> - When backend is ready, only `store.ts` needs to be swapped back to API calls

## Verification Plan

### Automated
- `npm run dev` – ensure app starts without errors
- Browser test: navigate all pages, verify products display, filters work

### Manual
- Admin: Add a product with image upload → verify it appears in marketplace
- Admin: Edit/delete products → verify changes reflect
- Marketplace: Browse categories, filter, view product details, submit enquiry
- Mobile: Verify responsive design on mobile viewport
