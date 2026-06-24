"use client";

import { Calculator, FolderKanban, MessageCircle, ScrollText, Smartphone } from "lucide-react";

export type MobileNavTab = "home" | "projects" | "pricing" | "services" | "contact";

type BottomNavItemId = "home" | "projects" | "pricing" | "terms" | "contact";

interface MobileBottomNavProps {
  active: MobileNavTab;
  termsOpen: boolean;
  onChange: (tab: MobileNavTab) => void;
  onTermsClick: () => void;
}

const items: { id: BottomNavItemId; label: string; icon: typeof Smartphone }[] = [
  { id: "home", label: "Apps", icon: Smartphone },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "pricing", label: "Pricing", icon: Calculator },
  { id: "terms", label: "Terms", icon: ScrollText },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

export function MobileBottomNav({ active, termsOpen, onChange, onTermsClick }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto max-w-lg px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-stretch justify-around rounded-2xl border border-white/[0.1] bg-[#0a0a12]/80 px-1 py-1 shadow-[0_-4px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {items.map((item) => {
            const isPricing = item.id === "pricing";
            const isActive =
              item.id === "terms" ? termsOpen : active === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "terms") onTermsClick();
                  else onChange(item.id);
                }}
                className={`relative flex min-h-[52px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl active:bg-white/[0.04] ${
                  isPricing
                    ? "group transition-all duration-300 hover:scale-105 active:scale-[0.98]"
                    : "transition-colors"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={item.id === "terms" ? termsOpen : undefined}
                aria-label={isPricing ? "Pricing — project estimate wizard" : undefined}
                title={isPricing ? "Open project pricing" : undefined}
              >
                {isActive && (
                  <span className="absolute inset-x-2 top-1 h-8 rounded-full bg-cyan-400/15 blur-md" />
                )}
                {isPricing && !isActive && (
                  <span className="absolute inset-x-1 top-0.5 h-9 rounded-full bg-gradient-to-r from-violet-500/12 via-cyan-400/18 to-violet-500/12 blur-md transition-all duration-300 group-hover:from-violet-500/22 group-hover:via-cyan-400/28 group-hover:to-violet-500/22 group-hover:blur-lg" />
                )}
                {isPricing && isActive && (
                  <span className="absolute inset-x-1 top-0.5 h-9 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-500/15 to-cyan-400/20 blur-lg transition-all duration-300 group-hover:blur-xl" />
                )}
                <Icon
                  className={`relative z-10 h-[18px] w-[18px] transition-all duration-300 ${
                    isActive
                      ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      : isPricing
                        ? "text-white/45 drop-shadow-[0_0_6px_rgba(167,139,250,0.4)] group-hover:text-cyan-300/90 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                        : "text-white/35"
                  }`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                <span
                  className={`relative z-10 max-w-[3.5rem] truncate text-[9px] font-medium leading-tight transition-colors duration-300 ${
                    isActive
                      ? "text-cyan-400"
                      : isPricing
                        ? "text-white/45 group-hover:text-cyan-300/90"
                        : "text-white/35"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
