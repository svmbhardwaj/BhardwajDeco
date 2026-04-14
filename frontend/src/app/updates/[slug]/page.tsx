"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UpdatePost } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchUpdateBySlug } from "@/lib/api";

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

export default function UpdateDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [update, setUpdate] = useState<UpdatePost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setUpdate(await fetchUpdateBySlug(slug));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-zinc-600 text-sm uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-3xl font-display text-white">Update Not Found</h1>
        <p className="mt-3 text-sm text-zinc-500">This update may have been removed.</p>
        <Link href="/updates" className="btn-gold rounded-lg mt-6 inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Updates
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-10 text-white md:px-8">
      <Reveal>
        <Link
          href="/updates"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-gold transition mb-6"
        >
          <ArrowLeft size={12} /> Back to Updates
        </Link>
      </Reveal>

      {update.coverImage && (
        <Reveal delay={0.05}>
          <div className="relative rounded-xl overflow-hidden mb-8">
            <div className="relative h-64 md:h-96">
              <Image
                src={update.coverImage}
                alt={update.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute top-4 left-4">
              <span
                className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-widest ${
                  typeColors[update.type || "general"]
                }`}
              >
                {typeLabels[update.type || "general"]}
              </span>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
          {new Date(update.publishedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-white leading-tight">
          {update.title}
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 glass rounded-xl p-6 md:p-10">
          <p className="text-sm md:text-base leading-8 text-zinc-300 whitespace-pre-line">
            {update.content || update.excerpt}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
