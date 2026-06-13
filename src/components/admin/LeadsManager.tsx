"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PricingLead } from "@/types/cms";
import { Mail, MailOpen } from "lucide-react";

export function LeadsManager() {
  const [leads, setLeads] = useState<PricingLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("pricing_leads").select("*").order("created_at", { ascending: false });
    setLeads((data ?? []) as PricingLead[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (lead: PricingLead) => {
    const supabase = createClient();
    await supabase.from("pricing_leads").update({ read: !lead.read }).eq("id", lead.id);
    load();
  };

  const formatEstimate = (lead: PricingLead) => {
    const sym = lead.currency === "USD" ? "$" : lead.currency === "DZD" ? "DA" : "€";
    const min = Number(lead.estimated_min).toLocaleString();
    const max = Number(lead.estimated_max).toLocaleString();
    return lead.currency === "DZD" ? `${min} - ${max} ${sym}` : `${sym}${min} - ${sym}${max}`;
  };

  if (loading) return <p className="text-white/50">Loading leads...</p>;

  return (
    <div className="space-y-3">
      {leads.length === 0 ? (
        <p className="text-white/40">No quote requests yet</p>
      ) : (
        leads.map((lead) => (
          <div key={lead.id} className={`rounded-xl border p-4 ${lead.read ? "border-white/5 bg-white/[0.02]" : "border-cyan-500/20 bg-cyan-500/5"}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{lead.name}</p>
                  <span className="text-xs text-white/40">{lead.email}</span>
                  {lead.whatsapp && <span className="text-xs text-white/40">{lead.whatsapp}</span>}
                </div>
                <p className="mt-2 text-sm font-medium text-cyan-400">
                  {lead.project_type} · {formatEstimate(lead)} ({lead.currency})
                </p>
                {expanded === lead.id && lead.message && (
                  <p className="mt-3 text-sm text-white/60">{lead.message}</p>
                )}
                {lead.message && (
                  <button type="button" onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} className="mt-2 text-xs text-cyan-400 hover:underline">
                    {expanded === lead.id ? "Hide message" : "View message"}
                  </button>
                )}
                <p className="mt-2 text-xs text-white/30">{new Date(lead.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => toggleRead(lead)} className="shrink-0 rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5">
                {lead.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-cyan-400" />}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
