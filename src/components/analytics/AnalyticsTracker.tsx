"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "portfolio_visitor_id";
const DEDUP_KEY = "portfolio_last_visit";
const DEDUP_MS = 30_000;

function getVisitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function shouldSkipVisit(path: string): boolean {
  const raw = sessionStorage.getItem(DEDUP_KEY);
  if (!raw) return false;

  try {
    const last = JSON.parse(raw) as { path: string; timestamp: number };
    return last.path === path && Date.now() - last.timestamp < DEDUP_MS;
  } catch {
    return false;
  }
}

function markVisit(path: string): void {
  sessionStorage.setItem(
    DEDUP_KEY,
    JSON.stringify({ path, timestamp: Date.now() })
  );
}

function detectDeviceType(): "Desktop" | "Mobile" | "Tablet" {
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (shouldSkipVisit(pathname)) return;

    const visitorId = getVisitorId();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    markVisit(pathname);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        visitorId,
        deviceType: detectDeviceType(),
        timezone,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
