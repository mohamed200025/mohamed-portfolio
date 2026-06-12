"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types/cms";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Plus, Save, Trash2 } from "lucide-react";

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Partial<Testimonial>>({ published: true, sort_order: 0, rating: 5 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    const supabase = createClient();
    if (form.id) {
      await supabase.from("testimonials").update(form).eq("id", form.id);
    } else {
      await supabase.from("testimonials").insert({
        name: form.name ?? "",
        role: form.role,
        company: form.company,
        content: form.content ?? "",
        avatar_url: form.avatar_url,
        rating: form.rating,
        published: form.published ?? true,
        sort_order: form.sort_order ?? 0,
      });
    }
    setForm({ published: true, sort_order: 0, rating: 5 });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-white">{t.name}</p>
                <p className="text-xs text-white/40">{t.role} {t.company && `· ${t.company}`}</p>
                <p className="mt-2 text-sm text-white/60">{t.content}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setForm(t)} className="text-xs text-cyan-400">Edit</button>
                <button onClick={() => remove(t.id)} className="text-xs text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-medium text-white">{form.id ? "Edit" : "Add"} Testimonial</h3>
        <AdminFormField label="Name"><input className={adminInputClass} value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></AdminFormField>
        <AdminFormField label="Role"><input className={adminInputClass} value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} /></AdminFormField>
        <AdminFormField label="Company"><input className={adminInputClass} value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></AdminFormField>
        <AdminFormField label="Content"><textarea className={adminTextareaClass} rows={4} value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })} /></AdminFormField>
        <AdminFormField label="Avatar URL"><input className={adminInputClass} value={form.avatar_url ?? ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} /></AdminFormField>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
        </label>
        <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white">
          <Save className="h-4 w-4" /> Save
        </button>
        {!form.id && (
          <button onClick={() => setForm({ published: true, sort_order: 0, rating: 5 })} className="ml-2 text-sm text-white/50">
            <Plus className="inline h-3 w-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
