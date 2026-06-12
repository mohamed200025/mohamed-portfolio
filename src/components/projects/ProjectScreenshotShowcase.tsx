"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface ProjectScreenshotShowcaseProps {
  desktopUrl: string;
  mobileUrl?: string;
  alt: string;
  priority?: boolean;
  size?: "default" | "large";
}

export function ProjectScreenshotShowcase({
  desktopUrl,
  mobileUrl,
  alt,
  priority = false,
  size = "default",
}: ProjectScreenshotShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

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

  const maxWidth = size === "large" ? "max-w-[720px]" : "max-w-[520px]";
  const phoneWidth = size === "large" ? "w-[120px] sm:w-[130px]" : "w-[100px] sm:w-[115px]";

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto w-full ${maxWidth}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <div className="absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/15 via-blue-500/8 to-violet-500/12 blur-3xl" />

      {/* Laptop */}
      <motion.div
        className="relative z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute -bottom-3 left-1/2 h-6 w-[80%] -translate-x-1/2 rounded-[100%] bg-cyan-500/10 blur-2xl" />

        <div className="relative">
          <div className="overflow-hidden rounded-t-lg border border-white/10 bg-gradient-to-b from-zinc-700 to-zinc-800 p-[2px] shadow-2xl shadow-black/50">
            <div className="absolute left-1/2 top-1 z-10 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-zinc-600" />
            <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-t-[8px] bg-[#0a0a0f]">
              <Image
                src={desktopUrl}
                alt={`${alt} desktop screenshot`}
                fill
                priority={priority}
                className="object-contain object-center"
                sizes={size === "large" ? "(max-width: 1024px) 90vw, 720px" : "(max-width: 768px) 100vw, 520px"}
              />
            </div>
          </div>
          <div className="relative mx-auto h-2.5 w-[103%] -translate-x-[1.5%] rounded-b-md bg-gradient-to-b from-zinc-600 to-zinc-800">
            <div className="absolute left-1/2 top-0 h-0.5 w-12 -translate-x-1/2 rounded-b bg-zinc-500/50" />
          </div>
        </div>
      </motion.div>

      {/* Phone */}
      {mobileUrl && (
        <motion.div
          className="absolute -right-1 bottom-[10%] z-20 sm:right-0 md:-right-4"
          animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="absolute -bottom-1.5 left-1/2 h-4 w-[65%] -translate-x-1/2 rounded-[100%] bg-violet-500/15 blur-lg" />
          <div
            className={`relative ${phoneWidth} overflow-hidden rounded-[18px] border-[2.5px] border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/60`}
          >
            <div className="absolute left-1/2 top-1 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-zinc-900" />
            <div className="relative flex aspect-[9/19] w-full items-center justify-center overflow-hidden rounded-[15px] bg-[#0a0a0f]">
              <Image
                src={mobileUrl}
                alt={`${alt} mobile screenshot`}
                fill
                className="object-contain object-center"
                sizes="130px"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
