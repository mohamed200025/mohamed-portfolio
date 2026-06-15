export type DeviceType = "Desktop" | "Mobile" | "Tablet";

export function parseDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export function parseBrowser(userAgent: string): string {
  const ua = userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Other";
}

export function getCountryFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code") ??
    null
  );
}

export function getCityFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-vercel-ip-city") ??
    headers.get("cf-ipcity") ??
    null
  );
}
