"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Send } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { fadeIn } from "@/lib/animations";

const navLinks = [
  { label: "Home", href: "#home", active: true },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Calculator", href: "#calculator" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8 lg:py-3.5">
        <BrandLogo href="#home" />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-sm transition-colors ${
                link.active ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
              {link.active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500"
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            className="hidden items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/5 px-4 py-2 text-sm text-white/90 backdrop-blur-sm transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/10 sm:inline-flex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="h-3.5 w-3.5 text-cyan-400" />
            Contact Me
          </motion.a>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                    link.active
                      ? "bg-white/5 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-white"
              >
                <Send className="h-3.5 w-3.5 text-cyan-400" />
                Contact Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
