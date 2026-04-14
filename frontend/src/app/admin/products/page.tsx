"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hasAuthToken } from "@/lib/api";
import { AdminProductsClient } from "@/components/catalog/AdminProductsClient";

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasAuthToken()) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
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

  return <AdminProductsClient />;
}
