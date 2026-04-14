"use client";

import { ProductCategory } from "@/lib/types";
import { Search } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  selectedTextureType: string;
  selectedColor: string;
  selectedFinish: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onTextureTypeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onFinishChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

const categories: Array<{ label: string; value: ProductCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Laminates", value: "laminates" },
  { label: "Wall Cladding", value: "wall-cladding" },
  { label: "Soft Stone", value: "soft-stone" },
  { label: "Louvers / Panels", value: "louvers-panels" }
];

const textureTypes = ["All Textures", "Wood", "Stone", "Fluted", "Linear", "Concrete"];
const colors = ["All Colors", "Teak", "Walnut", "Charcoal", "Ivory", "Sand", "Graphite"];
const finishes = ["All Finishes", "Matte", "Gloss", "Textured", "Satin", "Natural"];

export function FilterBar({
  selectedCategory,
  selectedTextureType,
  selectedColor,
  selectedFinish,
  searchQuery,
  onCategoryChange,
  onTextureTypeChange,
  onColorChange,
  onFinishChange,
  onSearchChange,
  resultCount
}: FilterBarProps) {
  return (
    <div className="sticky top-[72px] z-20 border-y border-white/10 bg-[#050505]/90 py-5 backdrop-blur-xl space-y-5">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search materials..."
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-zinc-200 outline-none transition focus:border-gold/50 focus:bg-white/[0.07]"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-zinc-600">
          {resultCount} results
        </span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-all ${
              selectedCategory === category.value
                ? "border-gold bg-gold/15 text-white shadow-glow"
                : "border-white/15 text-zinc-400 hover:border-gold/50 hover:text-zinc-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <select
          aria-label="Filter by texture type"
          value={selectedTextureType}
          onChange={(event) => onTextureTypeChange(event.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-300 outline-none transition focus:border-gold/50"
        >
          {textureTypes.map((texture) => (
            <option key={texture} value={texture.toLowerCase()} className="bg-[#111] text-zinc-200">
              {texture}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by color"
          value={selectedColor}
          onChange={(event) => onColorChange(event.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-300 outline-none transition focus:border-gold/50"
        >
          {colors.map((c) => (
            <option key={c} value={c.toLowerCase()} className="bg-[#111] text-zinc-200">
              {c}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by finish"
          value={selectedFinish}
          onChange={(event) => onFinishChange(event.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-300 outline-none transition focus:border-gold/50"
        >
          {finishes.map((f) => (
            <option key={f} value={f.toLowerCase()} className="bg-[#111] text-zinc-200">
              {f}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
