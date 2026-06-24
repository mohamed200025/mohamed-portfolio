"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Send, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { fadeIn } from "@/lib/animations";
import { siteNavLinks, type SiteNavActive } from "@/lib/site-nav";

interface SitePageNavProps {
  active?: SiteNavActive;
}

export function SitePageNav({ active }: SitePageNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = siteNavLinks.filter((link) =>
    ["Home", "About", "Projects", "Apps", "Services", "Pricing", "Contact"].includes(link.label)
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8 lg:py-3.5">
        <BrandLogo href="/#home" />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = link.activeKey === active;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-cyan-400"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 sm:inline-flex"
          >
            <Send className="h-4 w-4" />
            Contact Me
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-black/95 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm ${
                    link.activeKey === active
                      ? "bg-white/5 text-cyan-400"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
