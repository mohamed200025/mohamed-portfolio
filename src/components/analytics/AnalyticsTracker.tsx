"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sessionId =
      sessionStorage.getItem("portfolio_session") ??
      (() => {
        const id = crypto.randomUUID();
        sessionStorage.setItem("portfolio_session", id);
        return id;
      })();

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        sessionId,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
