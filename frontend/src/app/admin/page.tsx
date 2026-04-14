"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAdminEnquiries, fetchDashboardStats, fetchProducts, hasAuthToken } from "@/lib/api";
import { StatsCard } from "@/components/ui/StatsCard";
import { Package, Newspaper, Mail, Star, Plus, ArrowRight } from "lucide-react";
import { Product, Enquiry } from "@/lib/types";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, totalUpdates: 0, totalEnquiries: 0, unreadEnquiries: 0, featuredProducts: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasAuthToken()) {
        router.push("/login");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
      
      try {
        const [dashboard, products, enquiries] = await Promise.all([
          fetchDashboardStats(),
          fetchProducts(),
          fetchAdminEnquiries()
        ]);
        const overview = dashboard.data.overview;
        setStats(overview);
        setRecentProducts(products.slice(0, 5));
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-zinc-600 text-sm uppercase tracking-widest">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-3xl font-display text-white">Access Denied</h1>
        <p className="mt-3 text-sm text-zinc-500">You must be signed in to access the admin panel.</p>
        <Link href="/login" className="btn-gold rounded-lg mt-6 inline-flex items-center gap-2">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-10">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Internal Panel</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-display text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your products, community updates, and customer enquiries.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Package} label="Total Products" value={stats.totalProducts} delay={0} />
        <StatsCard icon={Star} label="Featured" value={stats.featuredProducts} delay={0.08} />
        <StatsCard icon={Newspaper} label="Updates" value={stats.totalUpdates} delay={0.16} />
        <StatsCard icon={Mail} label="Enquiries" value={stats.totalEnquiries} accent={stats.unreadEnquiries > 0} delay={0.24} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/admin/products">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass rounded-xl p-6 flex items-center gap-4 transition-all hover:border-gold/30 cursor-pointer"
          >
            <div className="rounded-lg bg-gold/15 p-3 text-gold">
              <Plus size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Add New Product</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Add laminates, cladding, stones, panels</p>
            </div>
            <ArrowRight size={18} className="text-zinc-600" />
          </motion.div>
        </Link>

        <Link href="/admin/updates">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass rounded-xl p-6 flex items-center gap-4 transition-all hover:border-gold/30 cursor-pointer"
          >
            <div className="rounded-lg bg-gold/15 p-3 text-gold">
              <Newspaper size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Post Update</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Price changes, arrivals, trends</p>
            </div>
            <ArrowRight size={18} className="text-zinc-600" />
          </motion.div>
        </Link>
      </div>

      {/* Recent Products & Enquiries */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Products */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-display text-white">Recent Products</h3>
            <Link href="/admin/products" className="text-[10px] uppercase tracking-widest text-gold hover:underline">
              View All
            </Link>
          </div>
          <ul className="space-y-3">
            {recentProducts.map((p) => (
              <li key={p._id} className="flex items-center gap-3 group">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
                  <Image
                    src={p.heroImage}
                    alt={p.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                    {p.category.replace("-", " ")}
                  </p>
                </div>
                {p.price && (
                  <span className="text-[10px] text-zinc-500">{p.price}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Enquiries */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-display text-white">Recent Enquiries</h3>
            <Link href="/admin/enquiries" className="text-[10px] uppercase tracking-widest text-gold hover:underline">
              View All
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4">No enquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentEnquiries.map((e) => (
                <li key={e._id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${e.isRead ? "bg-zinc-600" : "bg-gold"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{e.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{e.productName}</p>
                  </div>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
