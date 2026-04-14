"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Product, UpdatePost } from "@/lib/types";
import { motion } from "framer-motion";
import { HomeEnquiryForm } from "@/components/ui/HomeEnquiryForm";
import { siteContact } from "@/lib/site";
import { fetchProducts, fetchUpdates } from "@/lib/api";
import {
  ArrowRight,
  Shield,
  Leaf,
  Layers,
  Sparkles,
  Phone,
  Mail as MailIcon,
  MapPin
} from "lucide-react";

const categoryData = [
  {
    name: "Laminates",
    slug: "laminates",
    description: "High pressure decorative surfaces",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Wall Cladding",
    slug: "wall-cladding",
    description: "Exterior & interior wall solutions",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Soft Stone (MCM)",
    slug: "soft-stone",
    description: "Flexible natural stone veneers",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Louvers & Panels",
    slug: "louvers-panels",
    description: "Fluted panels & louver systems",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
  }
];

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    desc: "Sourced from top manufacturers with rigorous quality checks"
  },
  {
    icon: Layers,
    title: "Durable & Lasting",
    desc: "Weather-resistant materials built for decades of performance"
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    desc: "Sustainable sourcing with minimal environmental impact"
  },
  {
    icon: Sparkles,
    title: "Modern Finishes",
    desc: "Trend-forward designs for contemporary interiors & exteriors"
  }
];

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<UpdatePost[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    let isActive = true;
    void (async () => {
      try {
        const [products, updates] = await Promise.all([fetchProducts(), fetchUpdates()]);
        if (!isActive) return;
        setFeaturedProducts(products.filter((p) => p.isFeatured).slice(0, 4));
        setLatestUpdates(updates.slice(0, 2));
      } catch (error) {
        if (!isActive) return;
        setFeaturedProducts([]);
        setLatestUpdates([]);
        console.error("Failed to load homepage API data:", error);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        {/* Background */}
        <Image
          src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=2200&q=80"
          alt="Premium stone surface background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-40 left-10 h-48 w-48 rounded-full bg-gold/3 blur-[80px]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 text-white md:px-8 md:pb-24">
          <Reveal>
            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-gold">
              Premium Surface House
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.1] md:text-8xl font-display">
              Bhardwaj<span className="gradient-text">Deco</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base text-zinc-300 leading-8 md:text-lg">
              Redefining surfaces. Elevating spaces. Explore premium laminates,
              wall cladding, soft stone veneers, and architectural panels.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products" className="btn-gold rounded-lg inline-flex items-center gap-2">
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link href="/updates" className="btn-outline rounded-lg">
                Community Updates
              </Link>
            </div>
          </Reveal>

          {/* Stats bar */}
          <Reveal delay={0.4}>
            <div className="mt-14 flex flex-wrap gap-8 md:gap-14 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-display text-white">4+</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Product Categories
                </p>
              </div>
              <div>
                <p className="text-3xl font-display text-white">12+</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Premium Materials
                </p>
              </div>
              <div>
                <p className="text-3xl font-display text-white">10+</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Years Warranty
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Collections</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display">
            Material Categories
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {isHydrated ? categoryData.map((cat, index) => (
            <Reveal key={cat.slug} delay={index * 0.08}>
              <Link href="/products">
                <motion.article
                  whileHover={{ scale: 1.01 }}
                  className="group relative overflow-hidden rounded-xl border border-white/8 h-64 md:h-80"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-all group-hover:from-black/90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] uppercase tracking-widest text-gold mb-2">
                      {cat.description}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-display text-white">{cat.name}</h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400 group-hover:text-gold transition">
                      <span>Explore</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </Reveal>
          )) : Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="skeleton relative h-64 rounded-xl border border-white/8 md:h-80"
            />
          ))}
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#0a0a0a] border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
            <div className="flex items-end justify-between mb-14">
              <Reveal>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Curated</p>
                  <h2 className="mt-4 text-4xl md:text-6xl font-display">
                    Featured Materials
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/products"
                  className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline underline-offset-8"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <Reveal key={product._id} delay={index * 0.08}>
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group glass rounded-xl overflow-hidden transition-all hover:border-gold/30"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.heroImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                          {product.category.replace("-", " ")}
                        </p>
                        <h3 className="mt-1 text-base font-medium text-white font-display">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] uppercase tracking-widest text-gold">
                            {product.finish}
                          </span>
                          {product.price && (
                            <span className="text-[10px] text-zinc-600">{product.price}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/products"
                className="btn-outline rounded-lg inline-flex items-center gap-2"
              >
                View All Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ WHY US ═══ */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display">
            Built for Modern Spaces
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-6 transition-all hover:border-gold/20"
              >
                <div className="rounded-lg bg-gold/10 p-3 w-fit text-gold mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-display text-white">{feature.title}</h3>
                <p className="mt-2 text-xs text-zinc-500 leading-5">{feature.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ LATEST UPDATES ═══ */}
      {latestUpdates.length > 0 && (
        <section className="bg-[#0a0a0a] border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
            <div className="flex items-end justify-between mb-14">
              <Reveal>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Community</p>
                  <h2 className="mt-4 text-4xl md:text-5xl font-display">Latest Updates</h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/updates"
                  className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:underline underline-offset-8"
                >
                  All Updates <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {latestUpdates.map((post, index) => (
                <Reveal key={post._id} delay={index * 0.08}>
                  <Link href={`/updates/${post.slug}`}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      className="group glass rounded-xl overflow-hidden transition-all hover:border-gold/30"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                        <h3 className="mt-2 text-xl font-display text-white leading-tight">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-xs text-zinc-500 leading-5 line-clamp-2">
                          {post.excerpt || post.content}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Info */}
            <div className="p-8 md:p-12 space-y-8">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Get in Touch</p>
                <h2 className="mt-4 text-3xl md:text-4xl font-display">
                  Plan Your Surface Palette
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Visit our studio for product sampling, project consultation, and material
                  comparison. Our experts will help you select the perfect surfaces.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Phone size={16} className="text-gold" />
                    <a href={`tel:${siteContact.phone.replace(/\s+/g, "")}`} className="transition hover:text-gold">
                      {siteContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <MailIcon size={16} className="text-gold" />
                    <a href={`mailto:${siteContact.email}`} className="transition hover:text-gold">
                      {siteContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <MapPin size={16} className="text-gold" />
                    {siteContact.address}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="p-8 md:p-12 bg-white/[0.02]">
              <Reveal delay={0.15}>
                <HomeEnquiryForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
