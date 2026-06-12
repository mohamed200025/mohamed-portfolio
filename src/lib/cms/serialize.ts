import type { PortfolioData } from "@/types/cms";

const SECTION_TEXT_KEYS: Record<string, string[]> = {
  projects_header: ["badge", "title", "subtitle"],
  services: ["badge", "title_prefix", "title_highlight", "subtitle", "cta"],
  technologies: ["badge", "title_prefix", "title_highlight", "subtitle"],
  contact: ["badge", "title_prefix", "title_highlight", "subtitle"],
  footer: ["links"],
};

function pickFields(
  section: Record<string, unknown> | undefined,
  keys: string[]
): Record<string, unknown> {
  if (!section) return {};
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (section[key] !== undefined) result[key] = section[key];
  }
  return result;
}

/** Strip React components / functions before passing CMS data to client components. */
export function serializePortfolioData(data: PortfolioData): PortfolioData {
  const sections: Record<string, Record<string, unknown>> = {};

  for (const [key, allowedKeys] of Object.entries(SECTION_TEXT_KEYS)) {
    sections[key] = pickFields(data.sections[key], allowedKeys);
  }

  const headerStats = data.sections.projects_header?.stats;
  if (Array.isArray(headerStats) && headerStats.every((s) => typeof (s as { icon?: unknown }).icon === "string")) {
    sections.projects_header = { ...sections.projects_header, stats: headerStats };
  } else if (data.projectStats.length > 0) {
    sections.projects_header = { ...sections.projects_header, stats: data.projectStats };
  }

  const tools = data.sections.technologies?.tools;
  if (Array.isArray(tools)) {
    sections.technologies = { ...sections.technologies, tools };
  }

  return { ...data, sections };
}
