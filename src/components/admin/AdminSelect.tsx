"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { adminInputClass } from "./AdminFormField";

export interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  className?: string;
}

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const menu = document.getElementById(listId);
      if (menu?.contains(target)) return;
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, listId, updateMenuPosition]);

  const menu = open && mounted ? (
    <ul
      id={listId}
      role="listbox"
      aria-activedescendant={value}
      style={menuStyle}
      className="max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#0d1117] py-1 shadow-2xl shadow-black/60"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <li key={option.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                isSelected
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-white hover:bg-cyan-500/10 hover:text-cyan-300"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-cyan-400" />}
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${adminInputClass} flex w-full items-center justify-between gap-2 text-left`}
      >
        <span className={`truncate ${selected ? "text-white" : "text-white/40"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {menu && createPortal(menu, document.body)}
    </div>
  );
}
