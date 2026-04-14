"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UpdatePost } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchUpdates } from "@/lib/api";

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

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    void (async () => {
      setUpdates(await fetchUpdates());
    })();
  }, []);

  const filteredUpdates =
    filterType === "all" ? updates : updates.filter((u) => u.type === filterType);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 text-white md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Community"
          title="Updates & Announcements"
          subtitle="Price updates, new arrivals, market trends, and announcements from the BhardwajDeco material ecosystem."
        />
      </Reveal>

      {/* Type filter */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {[
          { label: "All", value: "all" },
          { label: "Price Updates", value: "price-update" },
          { label: "New Arrivals", value: "new-arrival" },
          { label: "Market Trends", value: "market-trend" },
          { label: "General", value: "general" }
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterType(filter.value)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-all ${
              filterType === filter.value
                ? "border-gold bg-gold/15 text-white"
                : "border-white/15 text-zinc-300 hover:border-gold/50 hover:text-zinc-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Updates grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredUpdates.map((post, index) => (
          <Reveal key={post._id} delay={index * 0.08}>
            <Link href={`/updates/${post.slug}`}>
              <motion.article
                whileHover={{ y: -4 }}
                className="group glass rounded-xl overflow-hidden h-full transition-all hover:border-gold/30"
              >
                {post.coverImage && (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${
                          typeColors[post.type || "general"]
                        }`}
                      >
                        {typeLabels[post.type || "general"]}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                  <h2 className="text-xl leading-tight font-display text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-7 text-zinc-300 line-clamp-3">
                    {post.content || post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gold pt-2">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </motion.article>
            </Link>
          </Reveal>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="glass rounded-xl p-12 text-center mt-10">
          <p className="text-zinc-400 font-display text-lg">No updates found</p>
          <p className="text-xs text-zinc-600 mt-1">Try selecting a different filter.</p>
        </div>
      )}
    </div>
  );
}
