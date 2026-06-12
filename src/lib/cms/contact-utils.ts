import type { ContactMethod, ContactSettings } from "@/types/cms";

export function normalizeContactSettings(row: Record<string, unknown>): ContactSettings {
  return {
    id: (row.id as number) ?? 1,
    whatsapp: (row.whatsapp as string) ?? "",
    email: (row.email as string) ?? "",
    linkedin_url: (row.linkedin_url as string) ?? "",
    linkedin_username: (row.linkedin_username as string) ?? "",
    github_url: (row.github_url as string) ?? "",
    github_username: (row.github_username as string) ?? "",
    contact_title: (row.contact_title as string) ?? "Let's Work Together",
    contact_subtitle: (row.contact_subtitle as string) ?? "",
    calendly_url: (row.calendly_url as string) ?? "",
  };
}

export function splitContactTitle(title: string): { prefix: string; highlight: string } {
  const trimmed = title.trim();
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx === -1) return { prefix: "", highlight: trimmed };
  return {
    prefix: trimmed.slice(0, spaceIdx),
    highlight: trimmed.slice(spaceIdx + 1),
  };
}

function buildWhatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "https://wa.me/";
}

export function contactSettingsToMethods(settings: ContactSettings): ContactMethod[] {
  return [
    {
      id: "whatsapp",
      type: "whatsapp",
      label: "WhatsApp",
      value: settings.whatsapp,
      subtext: "Available 24/7",
      href: buildWhatsappHref(settings.whatsapp),
      sort_order: 0,
      published: true,
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      value: settings.email,
      subtext: "I reply within 24h",
      href: settings.email ? `mailto:${settings.email}` : "#",
      sort_order: 1,
      published: true,
    },
    {
      id: "linkedin",
      type: "linkedin",
      label: "LinkedIn",
      value: settings.linkedin_username,
      subtext: "Let's connect",
      href: settings.linkedin_url || "#",
      sort_order: 2,
      published: true,
    },
    {
      id: "github",
      type: "github",
      label: "GitHub",
      value: settings.github_username,
      subtext: "View my code",
      href: settings.github_url || "#",
      sort_order: 3,
      published: true,
    },
  ];
}
