import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { siteContact } from "@/lib/site";

export const metadata = {
  title: "BhardwajDeco — Premium Surface Materials",
  description:
    "Explore premium laminates, wall cladding, soft stone veneers, and louver panels. A visual-first catalog for architects, designers, and homeowners.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        {/* ── Header ── */}
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-black/70 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8 md:py-4">
            <Link
              href="/"
              className="brand-link flex items-center gap-2.5 text-lg font-semibold tracking-[0.08em] text-white md:text-xl"
            >
              <span className="brand-logo relative h-9 w-9 overflow-hidden rounded-full p-0.5 md:h-10 md:w-10">
                <Image
                  src="/logo1.png"
                  alt="BhardwajDeco logo"
                  fill
                  sizes="40px"
                  className="brand-logo-image rounded-full object-contain"
                />
              </span>
              <span className="brand-wordmark">BhardwajDeco</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-zinc-200">
              <Link
                href="/products"
                className="transition hover:text-gold relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
              >
                Materials
              </Link>
              <Link
                href="/updates"
                className="transition hover:text-gold relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
              >
                Updates
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-4 py-1.5 transition hover:border-gold hover:text-gold"
              >
                Admin
              </Link>
            </div>

            {/* Mobile menu */}
            <MobileMenu />
          </nav>
        </header>

        {/* ── Main ── */}
        <main className="pt-[72px]">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/8 bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="relative h-10 w-10 overflow-hidden rounded-full border border-gold/30 bg-white/90 p-0.5">
                    <Image
                      src="/logo.png"
                      alt="BhardwajDeco logo"
                      fill
                      sizes="40px"
                      className="rounded-full object-contain"
                    />
                  </span>
                  <h3 className="text-lg font-semibold tracking-wider text-white">
                    BhardwajDeco
                  </h3>
                </div>
                <p className="mt-3 max-w-md text-base leading-7 text-zinc-300 md:text-sm">
                  Redefining surfaces. Elevating spaces. Premium laminates, wall
                  cladding, soft stone veneers, and louver panels for modern
                  interiors and exteriors.
                </p>
              </div>

              {/* Categories */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
                  Location
                </p>
                <p className="text-sm leading-7 text-zinc-300">
                  {siteContact.studioLabel}
                  <br />
                  {siteContact.address}
                </p>
              </div>

              {/* Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
                  Contact
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>
                    <a href={`tel:${siteContact.phone.replace(/\s+/g, "")}`} className="transition hover:text-zinc-300">
                      {siteContact.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${siteContact.email}`} className="transition hover:text-zinc-300">
                      {siteContact.email}
                    </a>
                  </li>
                  <li>{siteContact.studioLabel}</li>
                  <li>{siteContact.address}</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                © {new Date().getFullYear()} BhardwajDeco. All rights reserved.
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Premium Surface Catalog
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
