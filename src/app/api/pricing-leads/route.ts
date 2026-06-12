import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      whatsapp,
      project_type,
      estimated_min,
      estimated_max,
      currency,
      message,
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, offline: true });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("pricing_leads").insert({
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp?.trim() || null,
      project_type: project_type ?? "",
      estimated_min: Number(estimated_min) || 0,
      estimated_max: Number(estimated_max) || 0,
      currency: currency ?? "EUR",
      message: message?.trim() || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
