"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { submitEnquiryRequest } from "@/lib/site";

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export function HomeEnquiryForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("Could not send your enquiry.");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await submitEnquiryRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        productName: "Website Enquiry"
      });
      setStatus("success");
      setForm(initialState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not send your enquiry.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        required
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        placeholder="Name"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50"
        />
        <input
          required
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="Phone"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50"
        />
      </div>
      <textarea
        rows={4}
        value={form.message}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        placeholder="Tell us about your project..."
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold/50 resize-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold w-full rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === "loading" ? "Sending..." : <><Send size={14} /> Send Enquiry</>}
      </button>
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400">
          <CheckCircle size={16} />
          Your enquiry has been sent. We’ll respond by email shortly.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}
    </form>
  );
}