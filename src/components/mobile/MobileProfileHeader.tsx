"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Download } from "lucide-react";

interface MobileProfileHeaderProps {
  name: string;
  title: string;
  bio: string;
  photoUrl?: string | null;
  cvUrl?: string | null;
}

export function MobileProfileHeader({
  name,
  title,
  bio,
  photoUrl,
  cvUrl,
}: MobileProfileHeaderProps) {
  return (
    <header className="px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 opacity-70" />
          <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full border-2 border-[#050508] bg-[#0d0d14]">
            {photoUrl ? (
              <Image src={photoUrl} alt={name} fill className="object-cover" sizes="68px" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/30 to-violet-600/30 text-xl font-bold text-white">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <span
            className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#050508] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
            aria-label="Available for work"
            title="Available for work"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-lg font-bold tracking-tight text-white">{name}</h1>
                <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-cyan-400" aria-hidden />
              </div>
              <p className="mt-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-[13px] font-semibold text-transparent">
                {title}
              </p>
            </div>
            {cvUrl && (
              <Link
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors active:bg-white/[0.08] active:text-cyan-400"
                aria-label="Download CV"
              >
                <Download className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3.5 text-[13px] leading-relaxed text-white/50">{bio}</p>
    </header>
  );
}
