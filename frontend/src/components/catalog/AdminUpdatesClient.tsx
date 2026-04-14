"use client";

import Image from "next/image";
import { createUpdate, deleteUpdate, fetchUpdates, updateUpdate } from "@/lib/api";
import { UpdatePost } from "@/lib/types";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpdateFormState {
  title: string;
  slug: string;
  content: string;
  type: string;
  coverImage: string;
}

const initialForm: UpdateFormState = {
  title: "",
  slug: "",
  content: "",
  type: "general",
  coverImage: ""
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function AdminUpdatesClient() {
  const [items, setItems] = useState<UpdatePost[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<UpdateFormState>(initialForm);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void (async () => {
      setItems(await fetchUpdates());
    })();
  }, []);

  const saveUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      content: form.content,
      excerpt: form.content.substring(0, 150) + "...",
      type: form.type as UpdatePost["type"],
      coverImage: form.coverImage
    };

    try {
      if (editId) {
        await updateUpdate(editId, payload);
        setStatus("Update edited successfully.");
        setEditId(null);
      } else {
        await createUpdate(payload as Omit<UpdatePost, "_id" | "publishedAt">);
        setStatus("Update posted successfully.");
      }

      setItems(await fetchUpdates());
      setForm(initialForm);
      setShowForm(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save update.");
    }
  };

  const startEdit = (item: UpdatePost) => {
    setEditId(item._id);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content || item.excerpt || "",
      type: item.type || "general",
      coverImage: item.coverImage
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeUpdate = async (id: string) => {
    if (!confirm("Delete this update?")) return;
    try {
      await deleteUpdate(id);
      setItems(await fetchUpdates());
      setStatus("Update deleted.");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete update.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50 focus:bg-white/[0.07] placeholder:text-zinc-600";

  const typeLabels: Record<string, string> = {
    "price-update": "Price Update",
    "new-arrival": "New Arrival",
    "market-trend": "Market Trend",
    general: "General"
  };

  const typeColors: Record<string, string> = {
    "price-update": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "new-arrival": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "market-trend": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    general: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-white">Updates</h1>
          <p className="text-xs text-zinc-500 mt-1">{items.length} community updates</p>
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
          {showForm ? "Cancel" : "+ New Update"}
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
            <form onSubmit={saveUpdate} className="glass rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-display text-white">
                {editId ? "Edit Update" : "New Update"}
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Title *
                  </label>
                  <input
                    required
                    placeholder="Update title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: editId ? prev.slug : slugify(e.target.value)
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    Type *
                  </label>
                  <select
                    aria-label="Update type"
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                    className={inputClass}
                  >
                    <option className="bg-[#111]" value="price-update">Price Update</option>
                    <option className="bg-[#111]" value="new-arrival">New Arrival</option>
                    <option className="bg-[#111]" value="market-trend">Market Trend</option>
                    <option className="bg-[#111]" value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  Cover Image
                </label>
                <ImageUpload
                  value={form.coverImage}
                  onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
                  label="Cover Image"
                />
                <input
                  placeholder="Or paste image URL"
                  value={form.coverImage.startsWith("data:") ? "" : form.coverImage}
                  onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className={`${inputClass} mt-2`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write your update content..."
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-gold rounded-lg">
                  {editId ? "Save Changes" : "Post Update"}
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

      {/* Update list */}
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-4 flex items-start gap-4"
          >
            {item.coverImage && (
              <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] sm:block">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-widest ${
                    typeColors[item.type || "general"]
                  }`}
                >
                  {typeLabels[item.type || "general"]}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {item.content || item.excerpt}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1">
                {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(item)}
                aria-label={`Edit ${item.title}`}
                title={`Edit ${item.title}`}
                className="rounded-lg border border-white/15 p-2 text-zinc-400 transition hover:border-gold/50 hover:text-gold"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeUpdate(item._id)}
                aria-label={`Delete ${item.title}`}
                title={`Delete ${item.title}`}
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
