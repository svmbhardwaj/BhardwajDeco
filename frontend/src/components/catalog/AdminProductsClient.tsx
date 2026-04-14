"use client";

import Image from "next/image";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "@/lib/api";
import { Product, ProductCategory } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";
import { Pencil, Trash2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormState {
  name: string;
  slug: string;
  category: ProductCategory;
  textureType: string;
  color: string;
  finish: string;
  description: string;
  shortDescription: string;
  features: string;
  heroImage: string;
  gallery: string[];
  price: string;
  isFeatured: boolean;
  specDimensions: string;
  specThickness: string;
  specMaterial: string;
  specWeight: string;
  specApplication: string;
  specWarranty: string;
}

const initialForm: ProductFormState = {
  name: "",
  slug: "",
  category: "laminates",
  textureType: "wood",
  color: "",
  finish: "Matte",
  description: "",
  shortDescription: "",
  features: "",
  heroImage: "",
  gallery: [],
  price: "",
  isFeatured: false,
  specDimensions: "",
  specThickness: "",
  specMaterial: "",
  specWeight: "",
  specApplication: "",
  specWarranty: ""
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function AdminProductsClient() {
  const [items, setItems] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void (async () => {
      setItems(await fetchProducts());
    })();
  }, []);

  const updateField = useCallback(<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !editId) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }, [editId]);

  const buildPayload = () => {
    const parsedFeatures = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    return {
      name: form.name,
      slug: form.slug || slugify(form.name),
      category: form.category,
      textureType: form.textureType,
      color: form.color,
      finish: form.finish,
      description: form.description,
      shortDescription: form.shortDescription,
      features: parsedFeatures,
      specifications: {
        dimensions: form.specDimensions,
        thickness: form.specThickness,
        material: form.specMaterial,
        weight: form.specWeight,
        application: form.specApplication,
        warranty: form.specWarranty
      },
      heroImage: form.heroImage,
      gallery: form.gallery.length ? form.gallery : form.heroImage ? [form.heroImage] : [],
      isFeatured: form.isFeatured,
      price: form.price
    };
  };

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();

    try {
      if (editId) {
        await updateProduct(editId, payload);
        setStatus("Product updated successfully.");
        setEditId(null);
      } else {
        await createProduct(payload as Omit<Product, "_id" | "createdAt">);
        setStatus("Product added successfully.");
      }

      setItems(await fetchProducts());
      setForm(initialForm);
      setShowForm(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save product.");
    }
  };

  const startEdit = (item: Product) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      textureType: item.textureType || "",
      color: item.color || "",
      finish: item.finish,
      description: item.description,
      shortDescription: item.shortDescription || "",
      features: (item.features || []).join(", "),
      heroImage: item.heroImage,
      gallery: item.gallery || [],
      price: item.price || "",
      isFeatured: item.isFeatured,
      specDimensions: item.specifications?.dimensions || "",
      specThickness: item.specifications?.thickness || "",
      specMaterial: item.specifications?.material || "",
      specWeight: item.specifications?.weight || "",
      specApplication: item.specifications?.application || "",
      specWarranty: item.specifications?.warranty || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setItems(await fetchProducts());
      setStatus("Product deleted.");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete product.");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50 focus:bg-white/[0.07] placeholder:text-zinc-600";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-white">Products</h1>
          <p className="text-xs text-zinc-500 mt-1">{items.length} products in catalog</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(initialForm);
          }}
          className="btn-gold rounded-lg text-sm"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Status */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-gold/10 border border-gold/20 px-4 py-3 text-xs uppercase tracking-widest text-gold"
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={saveProduct} className="glass rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-display text-white">
                {editId ? "Edit Product" : "New Product"}
              </h2>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Product Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Royal Teak Laminate"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Slug
                  </label>
                  <input
                    placeholder="auto-generated"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Category & Details */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="product-category" className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Category *
                  </label>
                  <select
                    id="product-category"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value as ProductCategory)}
                    className={inputClass}
                  >
                    <option className="bg-[#111]" value="laminates">Laminates</option>
                    <option className="bg-[#111]" value="wall-cladding">Wall Cladding</option>
                    <option className="bg-[#111]" value="soft-stone">Soft Stone (MCM)</option>
                    <option className="bg-[#111]" value="louvers-panels">Louvers / Panels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Finish *
                  </label>
                  <input
                    required
                    placeholder="Matte, Gloss, Textured..."
                    value={form.finish}
                    onChange={(e) => updateField("finish", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Texture Type
                  </label>
                  <input
                    placeholder="Wood, Stone, Fluted..."
                    value={form.textureType}
                    onChange={(e) => updateField("textureType", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Color
                  </label>
                  <input
                    placeholder="Teak, Charcoal, Ivory..."
                    value={form.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Price & Featured */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Price (display)
                  </label>
                  <input
                    placeholder="₹890 / sheet"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => updateField("isFeatured", e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    <span className="text-sm text-zinc-300">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Hero Image *
                  </label>
                  <ImageUpload
                    value={form.heroImage}
                    onChange={(url) => updateField("heroImage", url)}
                    label="Hero Image"
                  />
                  <input
                    placeholder="Or paste image URL"
                    value={form.heroImage.startsWith("data:") ? "" : form.heroImage}
                    onChange={(e) => updateField("heroImage", e.target.value)}
                    className={`${inputClass} mt-2`}
                  />
                </div>
                <MultiImageUpload
                  values={form.gallery}
                  onChange={(urls) => updateField("gallery", urls)}
                  label="Gallery Images"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  Short Description *
                </label>
                <input
                  required
                  placeholder="A brief one-liner..."
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed product description..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  Features (comma-separated)
                </label>
                <input
                  placeholder="Weather-resistant, Lightweight, Durable"
                  value={form.features}
                  onChange={(e) => updateField("features", e.target.value)}
                  className={inputClass}
                />
                {form.features && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.features.split(",").filter(Boolean).map((f, i) => (
                      <span key={i} className="rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-[10px] text-gold">
                        {f.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
                  Specifications
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <input placeholder="Dimensions (e.g. 1220x2440mm)" value={form.specDimensions} onChange={(e) => updateField("specDimensions", e.target.value)} className={inputClass} />
                  <input placeholder="Thickness (e.g. 1.0mm)" value={form.specThickness} onChange={(e) => updateField("specThickness", e.target.value)} className={inputClass} />
                  <input placeholder="Material (e.g. HPL)" value={form.specMaterial} onChange={(e) => updateField("specMaterial", e.target.value)} className={inputClass} />
                  <input placeholder="Weight (e.g. 1.8 kg/m²)" value={form.specWeight} onChange={(e) => updateField("specWeight", e.target.value)} className={inputClass} />
                  <input placeholder="Application areas" value={form.specApplication} onChange={(e) => updateField("specApplication", e.target.value)} className={inputClass} />
                  <input placeholder="Warranty (e.g. 10 Years)" value={form.specWarranty} onChange={(e) => updateField("specWarranty", e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button type="submit" className="btn-gold rounded-lg">
                  {editId ? "Update Product" : "Add Product"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm(initialForm);
                      setShowForm(false);
                    }}
                    className="btn-outline rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-zinc-200 outline-none transition focus:border-gold/50"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            title="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-4 flex items-center gap-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              <Image
                src={item.heroImage}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                {item.isFeatured && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[8px] uppercase tracking-widest text-gold shrink-0">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
                {item.category.replace("-", " ")} · {item.finish}
              </p>
              {item.price && (
                <p className="text-xs text-zinc-600 mt-0.5">{item.price}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(item)}
                aria-label={`Edit ${item.name}`}
                title={`Edit ${item.name}`}
                className="rounded-lg border border-white/15 p-2 text-zinc-400 transition hover:border-gold/50 hover:text-gold"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeProduct(item._id)}
                aria-label={`Delete ${item.name}`}
                title={`Delete ${item.name}`}
                className="rounded-lg border border-red-400/20 p-2 text-red-400/70 transition hover:border-red-400/50 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
