"use client";

import { useCallback, useState } from "react";
import { saveAs } from "file-saver";
import { proposalDownloadFilename } from "./proposal-pdf/generate-proposal-pdf";
import { buildQuoteWhatsAppUrl } from "@/lib/pricing/whatsapp-quote";
import type { PricingFlowState } from "./types";

export interface ProposalSubmitSuccess {
  proposalId: string;
  pdfUrl: string | null;
  pdfBase64: string | null;
}

export function useProposalSubmission(flow: PricingFlowState) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ProposalSubmitSuccess | null>(null);

  const filename = proposalDownloadFilename(flow.client.fullName);

  const handleRequestQuote = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/pricing-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit quote request.");
      }

      setSuccess({
        proposalId: data.proposalId,
        pdfUrl: data.pdfUrl ?? null,
        pdfBase64: data.pdfBase64 ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quote request.");
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [flow]);

  const handleDownload = useCallback(() => {
    if (!success) return;

    if (success.pdfUrl) {
      window.open(success.pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (success.pdfBase64) {
      const binary = atob(success.pdfBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      saveAs(blob, filename);
    }
  }, [filename, success]);

  const whatsAppUrl =
    success &&
    buildQuoteWhatsAppUrl({
      proposalId: success.proposalId,
      clientName: flow.client.fullName.trim(),
      projectName: flow.projectName.trim(),
      finalPriceUsd: flow.finalEstimatedTotal,
      currency: flow.currency,
    });

  return {
    isSubmitting,
    error,
    success,
    handleRequestQuote,
    handleDownload,
    whatsAppUrl,
  };
}
