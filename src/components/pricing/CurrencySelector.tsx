"use client";

import { motion } from "framer-motion";
import { WIZARD_CURRENCY_OPTIONS, type WizardCurrency } from "./types";

interface CurrencySelectorProps {
  value: WizardCurrency;
  onChange: (currency: WizardCurrency) => void;
  variant?: "default" | "compact";
}

export function CurrencySelector({ value, onChange, variant = "default" }: CurrencySelectorProps) {
  if (variant === "compact") {
    return (
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label="Display currency"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {WIZARD_CURRENCY_OPTIONS.map((option) => {
          const selected = value === option.code;
          return (
            <button
              key={option.code}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.code)}
              className={`min-h-[24px] rounded-md px-2 text-[10px] font-bold transition-colors ${
                selected
                  ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30"
                  : "bg-white/[0.04] text-white/35 active:bg-white/[0.08]"
              }`}
            >
              {option.code}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-1"
      role="radiogroup"
      aria-label="Display currency"
    >
      {WIZARD_CURRENCY_OPTIONS.map((option) => {
        const selected = value === option.code;
        return (
          <button
            key={option.code}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.code)}
            className={`relative min-h-[32px] flex-1 rounded-lg px-2 text-[11px] font-semibold transition-colors duration-200 ${
              selected ? "text-white" : "text-white/40 hover:text-white/60"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="wizard-currency-indicator"
                className="absolute inset-0 rounded-lg border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-violet-500/15 shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              {option.code} ({option.label})
            </span>
          </button>
        );
      })}
    </div>
  );
}
