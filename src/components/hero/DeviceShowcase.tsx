"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { DashboardUI } from "./DashboardUI";
import { MobileAppUI } from "./MobileAppUI";
import { FloatingCards } from "./FloatingCards";
import { slideInRight } from "@/lib/animations";

export function DeviceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[580px] lg:max-w-none"
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <FloatingCards />

      {/* Laptop */}
      <motion.div
        className="relative z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Laptop shadow */}
        <div className="absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-[100%] bg-blue-500/10 blur-2xl" />

        {/* Laptop body */}
        <div className="relative">
          {/* Screen bezel */}
          <div className="overflow-hidden rounded-t-xl border border-white/10 bg-gradient-to-b from-zinc-700 to-zinc-800 p-[3px] shadow-2xl shadow-black/50">
            {/* Camera notch */}
            <div className="absolute left-1/2 top-1.5 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-600" />

            {/* Screen */}
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-[10px] bg-black">
              <DashboardUI />
            </div>
          </div>

          {/* Keyboard base */}
          <div className="relative mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-lg bg-gradient-to-b from-zinc-600 to-zinc-800 shadow-lg">
            <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-md bg-zinc-500/50" />
          </div>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div
        className="absolute -right-2 bottom-[12%] z-20 sm:right-0 md:-right-6 lg:-right-8"
        animate={{
          y: [0, -14, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Phone shadow */}
        <div className="absolute -bottom-2 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-[100%] bg-violet-500/15 blur-xl" />

        {/* Phone frame */}
        <div className="relative w-[120px] overflow-hidden rounded-[20px] border-[3px] border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/60 sm:w-[140px]">
          {/* Notch */}
          <div className="absolute left-1/2 top-1.5 z-10 h-3 w-12 -translate-x-1/2 rounded-full bg-zinc-900" />

          {/* Screen */}
          <div className="aspect-[9/19] w-full overflow-hidden rounded-[17px]">
            <MobileAppUI />
          </div>
        </div>
      </motion.div>

      {/* Ambient glow behind devices */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 blur-3xl" />
    </motion.div>
  );
}
