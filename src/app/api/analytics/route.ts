import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getCityFromHeaders,
  getCountryFromHeaders,
  parseBrowser,
  parseDeviceType,
} from "@/lib/analytics/parse";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, offline: true });
    }

    const body = await request.json();
    const userAgent = body.userAgent ?? request.headers.get("user-agent") ?? "";
    const deviceType =
      body.deviceType && ["Desktop", "Mobile", "Tablet"].includes(body.deviceType)
        ? body.deviceType
        : parseDeviceType(userAgent);

    const supabase = await createClient();

    await supabase.from("analytics_visits").insert({
      page_path: body.path ?? "/",
      visitor_id: body.visitorId ?? body.sessionId ?? "anonymous",
      referrer: body.referrer ?? null,
      user_agent: userAgent || null,
      device_type: deviceType,
      browser: parseBrowser(userAgent),
      country: getCountryFromHeaders(request.headers),
      city: getCityFromHeaders(request.headers),
      timezone: body.timezone ?? null,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, offline: true });
  }
}
