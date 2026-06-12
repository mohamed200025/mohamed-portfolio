"use client";

import { motion } from "framer-motion";

export function MuhlentechnikWebsiteUI() {
  return (
    <motion.div
      className="flex h-full w-full flex-col bg-white"
      animate={{ y: [0, -120, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-blue-600" />
          <span className="text-[9px] font-bold text-gray-800">MUHLENTECHNIK</span>
        </div>
        <div className="hidden gap-3 sm:flex">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <span key={item} className="text-[7px] text-gray-500">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-6">
        <div className="absolute right-2 top-2 flex gap-1 opacity-40">
          <div className="h-16 w-4 rounded-t-full bg-slate-500" />
          <div className="h-20 w-5 rounded-t-full bg-slate-400" />
          <div className="h-14 w-4 rounded-t-full bg-slate-500" />
        </div>
        <p className="mb-1 text-[7px] font-medium uppercase tracking-wider text-cyan-400">
          Agriculture & Industry
        </p>
        <h1 className="max-w-[200px] text-[11px] font-bold leading-tight text-white">
          Innovative Technology for Agriculture & Industry
        </h1>
        <p className="mt-2 max-w-[180px] text-[7px] leading-relaxed text-white/60">
          Leading solutions for grain storage, processing and industrial equipment worldwide.
        </p>
        <div className="mt-3 inline-block rounded bg-blue-600 px-2 py-1 text-[7px] font-medium text-white">
          Explore Solutions
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {["Silos", "Conveyors", "Dryers"].map((item, i) => (
          <div key={item} className="rounded-lg border border-gray-100 p-2">
            <div className={`mb-1.5 h-8 rounded bg-gradient-to-br ${i === 0 ? "from-blue-100 to-blue-200" : i === 1 ? "from-slate-100 to-slate-200" : "from-amber-100 to-amber-200"}`} />
            <p className="text-[7px] font-semibold text-gray-800">{item}</p>
            <p className="text-[6px] text-gray-400">Learn more →</p>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 border-t border-gray-100 bg-gray-50 px-3 py-3">
        {[
          { v: "40+", l: "Years" },
          { v: "60+", l: "Countries" },
          { v: "500+", l: "Projects" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <p className="text-[10px] font-bold text-blue-600">{s.v}</p>
            <p className="text-[6px] text-gray-500">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div className="mt-auto bg-slate-900 px-4 py-3">
        <p className="text-[6px] text-white/50">© Muhlentechnik — Industrial Excellence</p>
      </div>
    </motion.div>
  );
}
