"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface ContactCardProps {
  label: string;
  value: string;
  sub: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function ContactCard({
  label,
  value,
  sub,
  href,
  icon: Icon,
  color,
}: ContactCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
          <Icon className="h-4 w-4" />
        </div>
        <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
      </div>
      <p className="text-xs font-medium text-white/50">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-white/40">{sub}</p>
    </motion.a>
  );
}
