"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/types";
import { EnquiryForm } from "@/components/ui/EnquiryForm";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { fetchProductBySlug } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const { product: p, related } = await fetchProductBySlug(slug);
        setProduct(p);
        setRelatedProducts(related.slice(0, 3));
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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-3xl font-display text-white">Product Not Found</h1>
        <p className="mt-3 text-sm text-zinc-500">
          This product may have been removed or the link is incorrect.
        </p>
        <Link href="/products" className="btn-gold rounded-lg mt-6 inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const allImages = [product.heroImage, ...product.gallery.filter((img) => img !== product.heroImage)];
  const specs = product.specifications;
  const productFeatures = product.features?.length
    ? product.features
    : ["Weather-resistant", "Lightweight", "Durable"];

  return (
    <div className="pb-20">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-6 pb-8 md:px-8 md:pb-12">
            <Reveal>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-gold transition mb-4"
              >
                <ArrowLeft size={12} /> Back to Catalog
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-[9px] uppercase tracking-widest text-gold">
                  {product.category.replace("-", " ")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {product.finish} Finish
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-white md:text-6xl font-display">
                {product.name}
              </h1>
              {product.price && (
                <p className="mt-3 text-lg text-gold">{product.price}</p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto mt-10 max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <ImageGallery images={allImages} alt={product.name} />
            </Reveal>

            {/* Description */}
            <Reveal delay={0.1}>
              <div className="glass rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-display text-white mb-4">About This Material</h2>
                <p className="text-sm leading-7 text-zinc-300">{product.description}</p>
              </div>
            </Reveal>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Features */}
              <Reveal>
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-display text-white mb-4">Features</h2>
                  <ul className="space-y-3">
                    {productFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle size={16} className="text-gold shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Specifications */}
              {specs && (
                <Reveal delay={0.08}>
                  <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-display text-white mb-4">Specifications</h2>
                    <div className="space-y-3">
                      {specs.dimensions && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Dimensions
                          </span>
                          <span className="text-sm text-zinc-200">{specs.dimensions}</span>
                        </div>
                      )}
                      {specs.thickness && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Thickness
                          </span>
                          <span className="text-sm text-zinc-200">{specs.thickness}</span>
                        </div>
                      )}
                      {specs.material && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Material
                          </span>
                          <span className="text-sm text-zinc-200">{specs.material}</span>
                        </div>
                      )}
                      {specs.weight && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Weight
                          </span>
                          <span className="text-sm text-zinc-200">{specs.weight}</span>
                        </div>
                      )}
                      {specs.application && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Application
                          </span>
                          <span className="text-sm text-zinc-200 text-right max-w-[200px]">
                            {specs.application}
                          </span>
                        </div>
                      )}
                      {specs.warranty && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            Warranty
                          </span>
                          <span className="text-sm text-gold font-medium">{specs.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Enquiry */}
              <Reveal delay={0.16}>
                <div id="enquiry" className="glass rounded-xl p-6">
                  <h2 className="text-xl font-display text-white mb-2">Send Enquiry</h2>
                  <p className="text-xs text-zinc-500 mb-5">
                    Share your project details and our team will respond with recommendations.
                  </p>
                  <EnquiryForm product={product} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/5 pt-16">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-display text-white mb-8">
                Related Materials
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relProduct, index) => (
                <Reveal key={relProduct._id} delay={index * 0.08}>
                  <Link href={`/products/${relProduct.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group glass rounded-xl overflow-hidden transition-all hover:border-gold/30"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={relProduct.heroImage}
                          alt={relProduct.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-white font-display">
                          {relProduct.name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                          {relProduct.finish} · {relProduct.price}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
