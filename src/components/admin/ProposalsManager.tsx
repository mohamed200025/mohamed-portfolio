"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PricingProposal, PricingProposalStatus } from "@/types/cms";
import { ExternalLink, FileText, Mail, MailOpen } from "lucide-react";

const STATUS_OPTIONS: PricingProposalStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "completed",
];

const STATUS_STYLES: Record<PricingProposalStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  reviewing: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  rejected: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  completed: "bg-violet-500/15 text-violet-300 border-violet-500/25",
};

export function ProposalsManager() {
  const [proposals, setProposals] = useState<PricingProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PricingProposalStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("pricing_proposals")
      .select("*")
      .order("created_at", { ascending: false });
    setProposals((data ?? []) as PricingProposal[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return proposals;
    return proposals.filter((p) => p.status === statusFilter);
  }, [proposals, statusFilter]);

  const updateStatus = async (proposal: PricingProposal, status: PricingProposalStatus) => {
    const supabase = createClient();
    await supabase.from("pricing_proposals").update({ status }).eq("id", proposal.id);
    load();
  };

  const toggleRead = async (proposal: PricingProposal) => {
    const supabase = createClient();
    await supabase
      .from("pricing_proposals")
      .update({ read: !proposal.read })
      .eq("id", proposal.id);
    load();
  };

  if (loading) return <p className="text-white/50">Loading quote requests...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
            statusFilter === "all"
              ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
              : "border-white/10 text-white/50"
          }`}
        >
          All ({proposals.length})
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize ${
              statusFilter === status
                ? STATUS_STYLES[status]
                : "border-white/10 text-white/50"
            }`}
          >
            {status} ({proposals.filter((p) => p.status === status).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/40">No quote requests yet</p>
      ) : (
        filtered.map((proposal) => (
          <div
            key={proposal.id}
            className={`rounded-xl border p-4 ${
              proposal.read
                ? "border-white/5 bg-white/[0.02]"
                : "border-cyan-500/20 bg-cyan-500/5"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-bold text-cyan-300">
                    {proposal.proposal_id}
                  </p>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[proposal.status]}`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <p className="mt-2 font-medium text-white">{proposal.client_full_name}</p>
                <p className="text-xs text-white/40">
                  {[proposal.email, proposal.phone_number].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {proposal.project_name || "Untitled project"} · {proposal.final_price}{" "}
                  {proposal.currency}
                </p>
                {expanded === proposal.id && (
                  <div className="mt-3 space-y-2 text-xs text-white/55">
                    <p>{proposal.project_description || "No description"}</p>
                    <p>
                      Pages: {proposal.number_of_pages ?? "—"} · Complexity:{" "}
                      {proposal.complexity_level} · Timeline: {proposal.timeline}
                    </p>
                    <p>Duration: {proposal.estimated_duration}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === proposal.id ? null : proposal.id)}
                  className="mt-2 text-xs text-cyan-400 hover:underline"
                >
                  {expanded === proposal.id ? "Hide details" : "View details"}
                </button>
                <p className="mt-2 text-xs text-white/30">
                  {new Date(proposal.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <select
                  value={proposal.status}
                  onChange={(e) =>
                    updateStatus(proposal, e.target.value as PricingProposalStatus)
                  }
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {proposal.pdf_public_url && (
                  <a
                    href={proposal.pdf_public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                    title="Open PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </a>
                )}
                {proposal.email && (
                  <a
                    href={`mailto:${proposal.email}`}
                    className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => toggleRead(proposal)}
                  className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                >
                  {proposal.read ? (
                    <MailOpen className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4 text-cyan-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
