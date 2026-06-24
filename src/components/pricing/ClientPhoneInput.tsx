"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DIAL_CODE_OPTIONS } from "./countries";

interface ClientPhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
}

export function ClientPhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
}: ClientPhoneInputProps) {
  const [codeOpen, setCodeOpen] = useState(false);

  const selectedLabel = useMemo(
    () => DIAL_CODE_OPTIONS.find((o) => o.dialCode === countryCode)?.label ?? countryCode,
    [countryCode]
  );

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setCodeOpen((o) => !o)}
            className="flex min-h-[48px] items-center gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-2.5 text-[13px] font-medium text-white outline-none transition-colors focus:border-cyan-500/40"
            aria-label="Country code"
          >
            <span className="whitespace-nowrap">{selectedLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-white/40" />
          </button>
          <AnimatePresence>
            {codeOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close"
                  className="fixed inset-0 z-40"
                  onClick={() => setCodeOpen(false)}
                />
                <motion.ul
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute bottom-full left-0 z-50 mb-1 max-h-48 w-36 overflow-y-auto rounded-xl border border-white/[0.1] bg-[#0c0c14]/98 py-1 shadow-xl backdrop-blur-2xl"
                >
                  {DIAL_CODE_OPTIONS.map((option) => (
                    <li key={`${option.countryCode}-${option.dialCode}`}>
                      <button
                        type="button"
                        onClick={() => {
                          onCountryCodeChange(option.dialCode);
                          setCodeOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/[0.06] ${
                          countryCode === option.dialCode ? "text-cyan-300" : "text-white/70"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </AnimatePresence>
        </div>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="Phone number"
          className={`min-h-[48px] flex-1 rounded-xl border bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/[0.06] ${
            error ? "border-rose-500/40" : "border-white/[0.1]"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-400">{error}</p>}
    </div>
  );
}
