"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteEnquiry, fetchAdminEnquiries, markEnquiryRead, hasAuthToken } from "@/lib/api";
import { Enquiry } from "@/lib/types";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      if (!hasAuthToken()) {
        router.push("/login");
        return;
      }
      
      setIsAuthenticated(true);
      try {
        setEnquiries(await fetchAdminEnquiries());
      } catch (error) {
        console.error("Failed to load enquiries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndLoad();
  }, [router]);

  const handleMarkRead = async (id: string) => {
    const updated = await markEnquiryRead(id);
    setEnquiries((current) => current.map((item) => (item._id === updated._id ? updated : item)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((current) => current.filter((item) => item._id !== id));
      setSelectedId(null);
      setStatus("Enquiry deleted.");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete enquiry.");
    }
  };

  const selectedEnquiry = enquiries.find((e) => e._id === selectedId);
  const unreadCount = enquiries.filter((e) => !e.isRead).length;

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
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-white">Enquiries</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {enquiries.length} total · {unreadCount} unread
        </p>
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

      {enquiries.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Mail size={40} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400 font-display text-lg">No enquiries yet</p>
          <p className="text-xs text-zinc-600 mt-1">
            Enquiries from the product pages will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {enquiries.map((e) => (
              <button
                key={e._id}
                type="button"
                onClick={() => {
                  setSelectedId(e._id);
                  if (!e.isRead) handleMarkRead(e._id);
                }}
                className={`w-full text-left glass rounded-xl p-4 transition-all ${
                  selectedId === e._id
                    ? "border-gold/40 bg-gold/5"
                    : "hover:border-white/15"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {e.isRead ? (
                      <MailOpen size={16} className="text-zinc-600" />
                    ) : (
                      <Mail size={16} className="text-gold" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!e.isRead ? "text-white font-medium" : "text-zinc-300"}`}>
                      {e.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">{e.productName}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selectedEnquiry ? (
              <motion.div
                key={selectedEnquiry._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display text-white">{selectedEnquiry.name}</h2>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedEnquiry._id)}
                    title="Delete enquiry"
                    aria-label="Delete enquiry"
                    className="rounded-lg border border-red-400/20 p-2 text-red-400/70 transition hover:border-red-400/50 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Email</p>
                    <p className="text-sm text-zinc-200">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Phone</p>
                    <p className="text-sm text-zinc-200">{selectedEnquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Product</p>
                    <p className="text-sm text-gold">{selectedEnquiry.productName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Date</p>
                    <p className="text-sm text-zinc-200">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Message</p>
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 p-4 text-sm text-zinc-300 leading-7">
                    {selectedEnquiry.message || "No message provided."}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <Eye size={32} className="mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500">Select an enquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
