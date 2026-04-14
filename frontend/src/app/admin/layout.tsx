"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { LayoutDashboard, Package, Newspaper, Mail, ArrowLeft, LogOut } from "lucide-react";
import { clearAuthToken, fetchAdminProfile, hasAuthToken } from "@/lib/api";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/updates", label: "Updates", icon: Newspaper },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      if (!hasAuthToken()) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          router.replace("/login");
        }
        return;
      }

      try {
        await fetchAdminProfile();
        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch {
        clearAuthToken();
        if (isMounted) {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const handleSignOut = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    router.replace("/login");
    router.refresh();
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="animate-pulse text-sm uppercase tracking-widest text-zinc-500">
          Verifying admin session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col admin-sidebar border-r border-white/8 px-4 py-6 shrink-0">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-gold"
          >
            <ArrowLeft size={14} />
            Back to Store
          </Link>
          <h2 className="mt-4 text-2xl font-display text-white">Admin Panel</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            Product & Content Management
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400 transition hover:border-gold/40 hover:text-gold"
            >
              {isAuthenticated ? "Switch Account" : "Admin Sign In"}
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-red-400/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-red-300 transition hover:border-red-400/50 hover:text-red-200 inline-flex items-center gap-1"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Mobile admin nav ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[9px] uppercase tracking-widest transition ${
                isActive ? "text-gold" : "text-zinc-500"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 pb-24 md:pb-10">
        {children}
      </div>
    </div>
  );
}
