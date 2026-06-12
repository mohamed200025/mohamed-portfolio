"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-medium tracking-tight transition-shadow duration-300";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35",
    secondary:
      "border border-white/15 bg-white/[0.04] text-white/90 backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.08]",
  };

  const motionProps = {
    animate: { x: position.x, y: position.y },
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    className: `${baseStyles} ${variants[variant]} ${className}`,
  };

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...motionProps}>
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-white/10 to-violet-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

export function ShimmerButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: ease.out }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
}
