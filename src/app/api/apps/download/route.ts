import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug?.trim()) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, offline: true });
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc("increment_app_downloads", { app_slug: slug.trim() });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
