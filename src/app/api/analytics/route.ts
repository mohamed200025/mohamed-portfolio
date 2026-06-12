import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, offline: true });
    }

    const body = await request.json();
    const supabase = await createClient();

    await supabase.from("page_analytics").insert({
      path: body.path ?? "/",
      referrer: body.referrer ?? null,
      user_agent: body.userAgent ?? null,
      session_id: body.sessionId ?? null,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, offline: true });
  }
}
