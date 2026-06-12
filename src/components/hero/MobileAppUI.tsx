"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, Code, Palette, BarChart3 } from "lucide-react";

const categories = [
  { icon: Code, color: "bg-blue-500", label: "Dev" },
  { icon: Palette, color: "bg-violet-500", label: "Design" },
  { icon: BarChart3, color: "bg-emerald-500", label: "Data" },
  { icon: BookOpen, color: "bg-amber-500", label: "Learn" },
];

export function MobileAppUI() {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-slate-50 to-white p-3">
      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[8px] font-semibold text-slate-800">9:41</span>
        <div className="flex gap-0.5">
          <div className="h-2 w-3 rounded-sm bg-slate-800" />
          <div className="h-2 w-2 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* Header */}
      <div className="mb-3">
        <p className="text-[8px] text-slate-500">Hello,</p>
        <p className="text-[11px] font-bold text-slate-900">Mohamed 👋</p>
      </div>

      {/* Search */}
      <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1.5">
        <Search className="h-3 w-3 text-slate-400" />
        <span className="text-[8px] text-slate-400">Search courses...</span>
      </div>

      {/* Progress card */}
      <motion.div
        className="mb-3 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-2.5 text-white shadow-lg"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[7px] opacity-80">Continue Learning</p>
        <p className="text-[9px] font-bold">Web Development</p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-3/4 rounded-full bg-white" />
        </div>
        <p className="mt-1 text-[7px] opacity-70">75% complete</p>
      </motion.div>

      {/* Categories */}
      <p className="mb-2 text-[8px] font-semibold text-slate-700">Categories</p>
      <div className="grid grid-cols-4 gap-1.5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.1 }}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${cat.color} shadow-sm`}>
              <cat.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[6px] text-slate-500">{cat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Course cards */}
      <div className="mt-3 space-y-1.5">
        {["React Mastery", "Flutter Basics"].map((title, i) => (
          <div key={title} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
            <div className={`h-8 w-8 rounded-lg ${i === 0 ? "bg-cyan-100" : "bg-violet-100"}`} />
            <div className="flex-1">
              <p className="text-[8px] font-semibold text-slate-800">{title}</p>
              <p className="text-[6px] text-slate-400">12 lessons · 4h</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
