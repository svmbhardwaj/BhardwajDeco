"use client";

import { FilterBar } from "@/components/ui/FilterBar";
import { ProductMasonry } from "@/components/ui/ProductMasonry";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Product } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "@/lib/api";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [textureType, setTextureType] = useState("all textures");
  const [color, setColor] = useState("all colors");
  const [finish, setFinish] = useState("all finishes");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    void (async () => {
      setProducts(await fetchProducts());
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const textureMatch =
        textureType === "all textures" || (product.textureType || "").toLowerCase() === textureType;
      const colorMatch = color === "all colors" || (product.color || "").toLowerCase() === color;
      const finishMatch = finish === "all finishes" || product.finish.toLowerCase() === finish;
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && textureMatch && colorMatch && finishMatch && searchMatch;
    });
  }, [products, category, textureType, color, finish, searchQuery]);

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  const resetAndSet = (setter: (val: string) => void, value: string) => {
    setter(value);
    setVisibleCount(9);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 text-white md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Collection"
          title="Product Catalog"
          subtitle="Browse premium laminates, cladding, soft stone, and louvers through a visual catalog designed for architects and interior professionals."
        />
      </Reveal>

      <div className="mt-10">
        <FilterBar
          selectedCategory={category}
          selectedTextureType={textureType}
          selectedColor={color}
          selectedFinish={finish}
          searchQuery={searchQuery}
          onCategoryChange={(v) => resetAndSet(setCategory, v)}
          onTextureTypeChange={(v) => resetAndSet(setTextureType, v)}
          onColorChange={(v) => resetAndSet(setColor, v)}
          onFinishChange={(v) => resetAndSet(setFinish, v)}
          onSearchChange={(v) => {
            setSearchQuery(v);
            setVisibleCount(9);
          }}
          resultCount={filteredProducts.length}
        />

        <ProductMasonry products={paginatedProducts} />

        {visibleCount < filteredProducts.length && (
          <div className="py-10 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="btn-outline rounded-lg"
            >
              Load More ({filteredProducts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
