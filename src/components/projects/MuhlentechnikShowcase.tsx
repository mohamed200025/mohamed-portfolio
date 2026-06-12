"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FileText, Image, Type, MousePointer2 } from "lucide-react";
import { MuhlentechnikWebsiteUI } from "./MuhlentechnikWebsiteUI";
import { MuhlentechnikMobileUI } from "./MuhlentechnikMobileUI";

const cmsFields = [
  { icon: Type, label: "Page Title", value: "Innovative Technology..." },
  { icon: Image, label: "Hero Image", value: "silos-hero.jpg" },
  { icon: FileText, label: "Content Block", value: "3 sections" },
];

export function MuhlentechnikShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [5, -5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[520px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <div className="absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/12 via-cyan-500/6 to-blue-600/10 blur-3xl" />

      {/* CMS floating panel */}
      <motion.div
        className="absolute -left-[2%] top-[8%] z-30 hidden w-[160px] rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl lg:-left-[8%] lg:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <p className="mb-2 text-[10px] font-semibold text-white/70">CMS Panel</p>
        <div className="space-y-2">
          {cmsFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-2 py-1.5"
            >
              <field.icon className="h-3 w-3 shrink-0 text-blue-400" />
              <div className="min-w-0">
                <p className="text-[8px] text-white/40">{field.label}</p>
                <p className="truncate text-[9px] text-white/70">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
        <motion.div
          className="mt-2 rounded-md bg-blue-500/20 px-2 py-1 text-center text-[8px] font-medium text-blue-300"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Auto-saved
        </motion.div>
      </motion.div>

      {/* Laptop */}
      <motion.div
        className="relative z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute -bottom-3 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[100%] bg-blue-500/10 blur-2xl" />

        <div className="relative">
          <div className="overflow-hidden rounded-t-lg border border-white/10 bg-gradient-to-b from-zinc-700 to-zinc-800 p-[2px] shadow-2xl shadow-black/50">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-[8px] bg-white">
              <div className="relative h-full overflow-hidden">
                <MuhlentechnikWebsiteUI />

                {/* Animated cursor */}
                <motion.div
                  className="pointer-events-none absolute z-20"
                  animate={{
                    left: ["20%", "60%", "40%", "75%", "30%"],
                    top: ["30%", "50%", "25%", "60%", "40%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MousePointer2 className="h-4 w-4 text-blue-500 drop-shadow-lg" fill="currentColor" />
                  <motion.div
                    className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-blue-400 bg-blue-500/30"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto h-2.5 w-[103%] -translate-x-[1.5%] rounded-b-md bg-gradient-to-b from-zinc-600 to-zinc-800" />
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div
        className="absolute -right-1 bottom-[10%] z-20 sm:right-0 md:-right-4"
        animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="relative w-[90px] overflow-hidden rounded-[16px] border-[2.5px] border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/60 sm:w-[100px]">
          <div className="absolute left-1/2 top-1 z-10 h-2 w-8 -translate-x-1/2 rounded-full bg-zinc-900" />
          <div className="aspect-[9/19] w-full overflow-hidden rounded-[13px]">
            <MuhlentechnikMobileUI />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
