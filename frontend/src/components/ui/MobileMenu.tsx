"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Materials" },
  { href: "/updates", label: "Updates" },
  { href: "/login", label: "Admin" }
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden rounded-md p-1.5 text-zinc-300 transition hover:text-gold"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-72 bg-[#0a0a0a] border-l border-white/10 p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2.5">
                  <span className="relative h-9 w-9 overflow-hidden rounded-full border border-gold/30 bg-white/90 p-0.5">
                    <Image
                      src="/logo.png"
                      alt="BhardwajDeco logo"
                      fill
                      sizes="36px"
                      className="rounded-full object-contain"
                    />
                  </span>
                  <span className="text-lg font-semibold tracking-wider text-white">
                    BhardwajDeco
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-zinc-400 transition hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base uppercase tracking-[0.14em] text-zinc-200 transition hover:bg-white/5 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-white/10 mt-10">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Premium Surface Catalog
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
