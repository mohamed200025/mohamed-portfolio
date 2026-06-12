"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
}

function FormField({ id, label, type = "text", multiline, value, onChange }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          active
            ? "top-2 text-[10px] font-medium text-cyan-400"
            : "top-1/2 -translate-y-1/2 text-sm text-white/40"
        } ${multiline && active ? "top-3 translate-y-0" : ""}`}
        animate={{ scale: active ? 0.95 : 1 }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-7 text-sm text-white outline-none backdrop-blur-sm transition-all duration-300 focus:border-cyan-500/40 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-cyan-500/10"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-7 text-sm text-white outline-none backdrop-blur-sm transition-all duration-300 focus:border-cyan-500/40 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-cyan-500/10"
        />
      )}
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow border effect */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 opacity-50" />

      {/* Decorative paper plane */}
      <motion.div
        className="pointer-events-none absolute -right-4 top-8 hidden lg:block"
        animate={{ x: [0, 8, 0], y: [0, -6, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Send className="h-8 w-8 text-cyan-400/40" />
      </motion.div>

      <div className="relative">
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
            <Send className="h-5 w-5 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Send Me a Message</h3>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="name"
              label="Your Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <FormField
              id="email"
              label="Your Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
          </div>
          <FormField
            id="subject"
            label="Subject"
            value={form.subject}
            onChange={(v) => setForm({ ...form, subject: v })}
          />
          <FormField
            id="message"
            label="Your Message"
            multiline
            value={form.message}
            onChange={(v) => setForm({ ...form, message: v })}
          />

          {status === "success" && (
            <p className="text-sm text-emerald-400">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">Failed to send. Please try again.</p>
          )}

          <motion.button
            type="submit"
            disabled={status === "loading"}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-xl hover:shadow-blue-500/35 disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              {status === "loading" ? "Sending..." : "Send Message"}
            </span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
