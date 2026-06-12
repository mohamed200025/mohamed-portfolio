"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { TrendingUp, BookOpen } from "lucide-react";
import { DashboardUI } from "@/components/hero/DashboardUI";
import { MobileAppUI } from "@/components/hero/MobileAppUI";

const widgets = [
  {
    label: "Total Students",
    value: "2,847",
    change: "+12.5%",
    icon: TrendingUp,
    position: "top-[6%] -left-[2%] lg:-left-[6%]",
    color: "text-emerald-400",
  },
  {
    label: "Courses",
    value: "48",
    change: "+3",
    icon: BookOpen,
    position: "bottom-[20%] -right-[2%] lg:-right-[4%]",
    color: "text-cyan-400",
  },
];

export function EduveraShowcase() {
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

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[520px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/15 via-blue-500/8 to-violet-500/12 blur-3xl" />

      {/* Floating widgets */}
      {widgets.map((widget, i) => (
        <motion.div
          key={widget.label}
          className={`absolute ${widget.position} z-30 hidden rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl sm:block`}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 4.5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30">
              <widget.icon className={`h-3.5 w-3.5 ${widget.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-white/50">{widget.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">{widget.value}</span>
                <span className={`text-[10px] font-medium ${widget.color}`}>
                  {widget.change}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

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
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-[8px] bg-black">
              <DashboardUI />
            </div>
          </div>
          <div className="relative mx-auto h-2.5 w-[103%] -translate-x-[1.5%] rounded-b-md bg-gradient-to-b from-zinc-600 to-zinc-800">
            <div className="absolute left-1/2 top-0 h-0.5 w-12 -translate-x-1/2 rounded-b bg-zinc-500/50" />
          </div>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div
        className="absolute -right-1 bottom-[10%] z-20 sm:right-0 md:-right-4"
        animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="absolute -bottom-1.5 left-1/2 h-4 w-[65%] -translate-x-1/2 rounded-[100%] bg-violet-500/15 blur-lg" />
        <div className="relative w-[100px] overflow-hidden rounded-[18px] border-[2.5px] border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/60 sm:w-[115px]">
          <div className="absolute left-1/2 top-1 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-zinc-900" />
          <div className="aspect-[9/19] w-full overflow-hidden rounded-[15px]">
            <MobileAppUI />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
