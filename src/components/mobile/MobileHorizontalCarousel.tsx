"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MobileHorizontalCarouselProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  seeAllHref?: string;
  layout?: "horizontal" | "vertical";
  id?: string;
  className?: string;
}

export function MobileHorizontalCarousel({
  title,
  subtitle,
  children,
  seeAllHref,
  layout = "horizontal",
  id,
  className = "",
}: MobileHorizontalCarouselProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="mb-4 flex items-center justify-between px-5">
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-white/35">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex min-h-[44px] items-center gap-0.5 text-[11px] font-medium text-white/40 transition-colors active:text-cyan-400"
          >
            See All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {layout === "horizontal" ? (
        <div className="overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4 py-1">{children}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5">{children}</div>
      )}
    </section>
  );
}

export function MobileCarouselEmpty({ message }: { message: string }) {
  return (
    <div className="mx-5 flex min-h-[100px] items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-6">
      <p className="text-center text-sm text-white/40">{message}</p>
    </div>
  );
}
