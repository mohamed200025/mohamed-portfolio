"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JourneyEntry } from "@/types/cms";
import { JOURNEY_ICON_OPTIONS, JOURNEY_NODE_COLORS } from "@/lib/cms/about-utils";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { AdminSelect } from "./AdminSelect";
import { Plus, Save, Trash2 } from "lucide-react";

const emptyEntry = (): Partial<JourneyEntry> => ({
  year: "",
  title: "",
  description: "",
  icon_name: "Building2",
  node_color: JOURNEY_NODE_COLORS[0].value,
  sort_order: 0,
  published: true,
});

export function JourneyManager() {
  const [items, setItems] = useState<JourneyEntry[]>([]);
  const [form, setForm] = useState<Partial<JourneyEntry>>(emptyEntry());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("journey_entries").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      year: form.year ?? "",
      title: form.title ?? "",
      description: form.description ?? "",
      icon_name: form.icon_name ?? "Building2",
      node_color: form.node_color ?? JOURNEY_NODE_COLORS[0].value,
      sort_order: form.sort_order ?? 0,
      published: form.published ?? true,
    };
    if (form.id) {
      await supabase.from("journey_entries").update(payload).eq("id", form.id);
    } else {
      await supabase.from("journey_entries").insert(payload);
    }
    setForm(emptyEntry());
    setSaving(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this journey entry?")) return;
    const supabase = createClient();
    await supabase.from("journey_entries").delete().eq("id", id);
    load();
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {items.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-cyan-400">{entry.year}</p>
                <p className="font-medium text-white">{entry.title}</p>
                <p className="mt-1 text-sm text-white/50 line-clamp-2">{entry.description}</p>
                <p className="mt-2 text-[10px] text-white/30">
                  Icon: {entry.icon_name} · Order: {entry.sort_order}
                  {!entry.published && " · Draft"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setForm(entry)} className="text-xs text-cyan-400 hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(entry.id)} className="text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setForm({ ...emptyEntry(), sort_order: items.length })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-white/50 hover:border-cyan-500/40 hover:text-cyan-400"
        >
          <Plus className="h-4 w-4" /> Add Entry
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-medium text-white">{form.id ? "Edit Entry" : "New Entry"}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AdminFormField label="Year">
            <input className={adminInputClass} value={form.year ?? ""} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </AdminFormField>
          <AdminFormField label="Sort Order">
            <input type="number" className={adminInputClass} value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </AdminFormField>
        </div>
        <AdminFormField label="Title">
          <input className={adminInputClass} value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Description">
          <textarea className={adminTextareaClass} rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Icon">
          <AdminSelect
            value={form.icon_name ?? "Building2"}
            onChange={(icon_name) => setForm({ ...form, icon_name })}
            options={JOURNEY_ICON_OPTIONS.map((icon) => ({ value: icon, label: icon }))}
          />
        </AdminFormField>
        <AdminFormField label="Node Color">
          <AdminSelect
            value={form.node_color ?? JOURNEY_NODE_COLORS[0].value}
            onChange={(node_color) => setForm({ ...form, node_color })}
            options={JOURNEY_NODE_COLORS.map((c) => ({ value: c.value, label: c.label }))}
          />
        </AdminFormField>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </div>
  );
}
