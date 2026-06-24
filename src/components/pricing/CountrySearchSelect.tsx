"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRY_OPTIONS } from "./countries";

interface CountrySearchSelectProps {
  value: string;
  onChange: (countryName: string) => void;
  placeholder?: string;
}

export function CountrySearchSelect({
  value,
  onChange,
  placeholder = "Select country",
}: CountrySearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_OPTIONS;
    return COUNTRY_OPTIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = COUNTRY_OPTIONS.find((c) => c.name === value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-left text-[14px] text-white outline-none transition-colors focus:border-cyan-500/40"
      >
        <span className={selected ? "text-white" : "text-white/30"}>
          {selected ? `${selected.flag} ${selected.name}` : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-56 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0c14]/98 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="border-b border-white/[0.06] p-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-2">
                <Search className="h-3.5 w-3.5 text-white/35" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/30"
                  autoFocus
                />
              </div>
            </div>
            <ul className="max-h-40 overflow-y-auto overscroll-contain py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-center text-[12px] text-white/35">No countries found</li>
              ) : (
                filtered.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(country.name);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.06] ${
                        value === country.name ? "bg-cyan-500/10 text-cyan-300" : "text-white/75"
                      }`}
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
