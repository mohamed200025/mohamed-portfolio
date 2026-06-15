"use client";

import { techCategories, tools as defaultTools } from "@/lib/technologies-data";
import { defaultSections } from "@/lib/cms/defaults";

interface MobileTechnologiesPanelProps {
  technologies?: Record<string, unknown>;
}

export function MobileTechnologiesPanel({
  technologies = defaultSections.technologies,
}: MobileTechnologiesPanelProps) {
  const tools = (technologies.tools as typeof defaultTools) ?? defaultTools;

  return (
    <div className="space-y-4 px-5 pb-6">
      {techCategories.map((category) => {
        const Icon = category.icon;
        return (
          <article
            key={category.title}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
          >
            <div className={`flex items-center gap-3 border-b border-white/[0.06] bg-gradient-to-r px-4 py-3 ${category.accent}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                <Icon className="h-4 w-4 text-white/80" />
              </div>
              <h3 className="font-semibold text-white">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              {category.items.map((item) => (
                <span
                  key={item.name}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${item.color}`}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </article>
        );
      })}

      <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-semibold text-white/70">Tools & Workflow</h3>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <span
              key={tool.name}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/60"
            >
              <span className={tool.color}>{tool.name}</span>
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
