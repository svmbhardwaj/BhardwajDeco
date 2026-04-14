"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthToken, fetchAdminProfile, hasAuthToken, loginAdmin } from "@/lib/api";
import { AlertCircle, LockKeyhole, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("Unable to sign in.");

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      if (!hasAuthToken()) return;
      try {
        await fetchAdminProfile();
        if (isMounted) {
          router.replace("/admin");
        }
      } catch {
        clearAuthToken();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await loginAdmin(email, password);
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md items-center px-5 py-12 md:px-6 md:py-16">
      <form onSubmit={onSubmit} className="glass w-full rounded-2xl p-6 space-y-5 md:p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
            <LockKeyhole size={20} />
          </div>
          <h1 className="text-2xl font-display text-white">Admin Sign In</h1>
          <p className="text-sm text-zinc-300">
            Sign in to manage products, updates, and enquiries on the backend.
          </p>
        </div>

        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-gold/50"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-gold/50"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-gold w-full rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {status === "loading" ? "Signing in..." : <><LogIn size={14} /> Sign In</>}
        </button>

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}