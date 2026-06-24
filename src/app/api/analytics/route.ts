import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getCityFromHeaders,
  getCountryFromHeaders,
  parseBrowser,
  parseDeviceType,
} from "@/lib/analytics/parse";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    console.error("[analytics] Supabase not configured — missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.json(
      { error: "Analytics storage is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const userAgent = body.userAgent ?? request.headers.get("user-agent") ?? "";
    const deviceType =
      body.deviceType && ["Desktop", "Mobile", "Tablet"].includes(body.deviceType)
        ? body.deviceType
        : parseDeviceType(userAgent);
    const browser = parseBrowser(userAgent);
    const visitorId = body.visitorId ?? body.sessionId ?? "anonymous";

    const supabase = createPublicClient();

    // Production table may not include device_type, browser, timezone yet.
    // Insert only columns confirmed in the live schema; enrich user_agent for now.
    const enrichedUserAgent = userAgent
      ? `${userAgent} | device=${deviceType}; browser=${browser}${body.timezone ? `; tz=${body.timezone}` : ""}`
      : `device=${deviceType}; browser=${browser}${body.timezone ? `; tz=${body.timezone}` : ""}`;

    const row = {
      page_path: body.path ?? "/",
      visitor_id: visitorId,
      session_id: visitorId,
      referrer: body.referrer ?? null,
      user_agent: enrichedUserAgent || null,
      country: getCountryFromHeaders(request.headers),
      city: getCityFromHeaders(request.headers),
    };

    const { error } = await supabase.from("analytics_visits").insert(row);

    if (error) {
      console.error("[analytics] Supabase insert failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        page_path: row.page_path,
        visitor_id: row.visitor_id,
      });
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[analytics] Request failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
