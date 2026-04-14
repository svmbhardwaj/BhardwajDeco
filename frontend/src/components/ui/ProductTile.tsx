"use client";

import { Product } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProductTileProps {
  product: Product;
}

export function ProductTile({ product }: ProductTileProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-glow">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.heroImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Hover overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-[10px] uppercase tracking-widest text-black font-medium">
                View Details <ArrowUpRight size={12} />
              </span>
            </div>

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-zinc-300 border border-white/10">
                {product.category.replace("-", " ")}
              </span>
            </div>

            {/* Featured badge */}
            {product.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[9px] uppercase tracking-widest text-black font-semibold">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-medium text-white font-display">{product.name}</h3>
            <p className="text-xs text-zinc-400 leading-5 line-clamp-2">
              {product.shortDescription || product.description}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{product.finish}</span>
              {product.price && (
                <span className="text-xs text-zinc-500">{product.price}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
