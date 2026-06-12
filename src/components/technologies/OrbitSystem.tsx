"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Code2 } from "lucide-react";

export function OrbitSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 22 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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

  const radius = 130;

  return (
    <motion.div
      ref={containerRef}
      className="relative z-20 mx-auto flex h-[320px] w-full max-w-[360px] items-center justify-center overflow-visible sm:h-[380px] sm:max-w-[420px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative h-full w-full overflow-visible"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Orbit rings */}
        {[1, 0.75, 0.5].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 z-20 rounded-full border border-white/[0.06]"
            style={{
              width: radius * 2 * scale * 1.15,
              height: radius * 2 * scale * 1.15,
              marginLeft: -(radius * scale * 1.15),
              marginTop: -(radius * scale * 1.15),
            }}
            animate={{ rotate: i % 2 === 1 ? -360 : 360 }}
            transition={{
              duration: 40 + i * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Blue glow */}
        <div className="absolute left-1/2 top-1/2 z-[25] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[50px]" />

        {/* Center icon */}
        <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <div className="relative z-30 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-500/25 bg-black/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm sm:h-24 sm:w-24">
            <Code2 className="h-8 w-8 text-cyan-400 sm:h-10 sm:w-10" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
