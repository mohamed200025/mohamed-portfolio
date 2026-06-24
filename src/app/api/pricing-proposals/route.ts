export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildProposalRecord } from "@/lib/pricing/build-proposal-record";
import { generateProposalPdfServer } from "@/lib/pricing/generate-proposal-pdf-server";
import { generateProposalIdCandidate } from "@/lib/pricing/proposal-id";
import { createPublicClient } from "@/lib/supabase/public";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { PricingFlowState } from "@/components/pricing/types";

const MAX_ID_ATTEMPTS = 8;

function isValidFlow(body: unknown): body is { flow: PricingFlowState } {
  if (!body || typeof body !== "object") return false;
  const { flow } = body as { flow?: PricingFlowState };
  if (!flow || typeof flow !== "object") return false;
  if (!flow.client?.fullName?.trim()) return false;
  if (!flow.client?.email?.trim()) return false;
  if (!flow.proposalConfirmed) return false;
  return true;
}

async function allocateProposalId(
  supabase: ReturnType<typeof createPublicClient>,
): Promise<string> {
  for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
    const candidate = generateProposalIdCandidate();
    const { data } = await supabase
      .from("pricing_proposals")
      .select("id")
      .eq("proposal_id", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  throw new Error("Failed to allocate a unique proposal ID.");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidFlow(body)) {
      return NextResponse.json(
        { error: "Invalid proposal data. Confirm your details and try again." },
        { status: 400 },
      );
    }

    const { flow } = body;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Quote submission is temporarily unavailable." },
        { status: 503 },
      );
    }

    const pdfBytes = await generateProposalPdfServer(flow);

    const supabase = createPublicClient();
    const serviceClient = createServiceClient();
    const proposalId = await allocateProposalId(serviceClient ?? supabase);

    const storagePath = `proposals/${proposalId}.pdf`;
    let pdfPublicUrl: string | null = null;

    const storageClient = serviceClient ?? supabase;

    const { error: uploadError } = await storageClient.storage
      .from("proposal-pdfs")
      .upload(storagePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      const { data: urlData } = storageClient.storage
        .from("proposal-pdfs")
        .getPublicUrl(storagePath);
      pdfPublicUrl = urlData.publicUrl;
    }

    const record = buildProposalRecord(flow, proposalId, storagePath, pdfPublicUrl);

    const { error: insertError } = await supabase
      .from("pricing_proposals")
      .insert(record);

    if (insertError) {
      console.error("[pricing-proposals] Supabase insert error:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const response: Record<string, unknown> = {
      success: true,
      proposalId,
      pdfUrl: pdfPublicUrl,
      pdfStoragePath: storagePath,
    };

    if (!pdfPublicUrl) {
      response.pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
