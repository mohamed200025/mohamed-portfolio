"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultSections } from "@/lib/cms/defaults";
import { adminTextareaClass } from "./AdminFormField";
import { Save } from "lucide-react";

const sectionKeys = ["about", "projects_header", "services", "technologies", "contact", "footer"] as const;

export function SectionsEditor() {
  const [sections, setSections] = useState<Record<string, string>>({});
  const [activeKey, setActiveKey] = useState<string>("about");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("section_content").select("*");
      const merged: Record<string, string> = {};
      sectionKeys.forEach((key) => {
        const row = data?.find((r) => r.section_key === key);
        merged[key] = JSON.stringify(row?.content ?? defaultSections[key], null, 2);
      });
      setSections(merged);
    };
    load();
  }, []);

  const save = async () => {
    try {
      const content = JSON.parse(sections[activeKey]);
      const supabase = createClient();
      const { error } = await supabase.from("section_content").upsert({
        section_key: activeKey,
        content,
        updated_at: new Date().toISOString(),
      });
      setMessage(error ? error.message : "Section saved!");
    } catch {
      setMessage("Invalid JSON — please fix syntax errors");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
              activeKey === key
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {key.replace("_", " ")}
          </button>
        ))}
      </div>

      <textarea
        className={`${adminTextareaClass} font-mono text-xs`}
        rows={20}
        value={sections[activeKey] ?? ""}
        onChange={(e) => setSections({ ...sections, [activeKey]: e.target.value })}
      />

      <button onClick={save} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white">
        <Save className="h-4 w-4" /> Save Section
      </button>
      {message && <p className="mt-2 text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
