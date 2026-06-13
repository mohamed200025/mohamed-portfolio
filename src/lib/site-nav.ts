export type SiteNavActive = "projects" | "apps";

export interface SiteNavLink {
  label: string;
  href: string;
  hashHref: string;
  activeKey?: SiteNavActive;
}

export const siteNavLinks: SiteNavLink[] = [
  { label: "Home", href: "/#home", hashHref: "#home" },
  { label: "About", href: "/#about", hashHref: "#about" },
  { label: "Projects", href: "/#projects", hashHref: "#projects", activeKey: "projects" },
  { label: "Apps", href: "/apps", hashHref: "/apps", activeKey: "apps" },
  { label: "Services", href: "/#services", hashHref: "#services" },
  { label: "Technologies", href: "/#technologies", hashHref: "#technologies" },
  { label: "Calculator", href: "/#calculator", hashHref: "#calculator" },
  { label: "Contact", href: "/#contact", hashHref: "#contact" },
];

export const homeNavLinks = siteNavLinks.map((link) => ({
  label: link.label,
  href: link.label === "Apps" ? "/apps" : link.hashHref,
  active: link.hashHref === "#home",
}));
