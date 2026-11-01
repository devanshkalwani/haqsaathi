import { isDbConfigured, publicDb } from "@/lib/supabase";

/**
 * POST /api/report  { schemeId: string, message: string }
 * Saves a "Report a mistake" message so the team can fix wrong information.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { schemeId?: string; message?: string };
  const schemeId = String(body.schemeId ?? "").slice(0, 100);
  const message = String(body.message ?? "").trim().slice(0, 1000);
  if (!schemeId || !message) return Response.json({ ok: false, error: "Missing scheme or message" }, { status: 400 });

  if (!isDbConfigured) {
    // No database yet: just print it so you can see it works.
    console.log(`[report] ${schemeId}: ${message}`);
    return Response.json({ ok: true });
  }

  const { error } = await publicDb().from("error_reports").insert({ scheme_id: schemeId, message });
  if (error) {
    console.error("Could not save report:", error.message);
    return Response.json({ ok: false, error: "Could not save" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
