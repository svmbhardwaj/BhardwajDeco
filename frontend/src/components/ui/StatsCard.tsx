"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: boolean;
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, accent = false, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass rounded-xl p-6 transition-all hover:border-gold/30 ${
        accent ? "glow-pulse" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${accent ? "bg-gold/15 text-gold" : "bg-white/5 text-zinc-400"}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-white font-display">{value}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
