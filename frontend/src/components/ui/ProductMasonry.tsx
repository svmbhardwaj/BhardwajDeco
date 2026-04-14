"use client";

import { Product } from "@/lib/types";
import { ProductTile } from "@/components/ui/ProductTile";

interface ProductMasonryProps {
  products: Product[];
}

export function ProductMasonry({ products }: ProductMasonryProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-2xl glass p-8">
          <p className="text-xl text-zinc-400 font-display">No products found</p>
          <p className="mt-2 text-xs text-zinc-600 uppercase tracking-widest">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductTile key={product._id} product={product} />
      ))}
    </div>
  );
}
