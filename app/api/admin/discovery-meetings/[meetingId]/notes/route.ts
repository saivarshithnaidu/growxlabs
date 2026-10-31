import { z } from "zod";
import { discoveryError, requireDiscoveryAdmin } from "@/lib/discovery/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const NOTE_SECTIONS = ["discussion", "risks", "opportunities", "next_action"] as const;
const putSchema = z.object({ notes: z.array(z.object({ sectionKey: z.enum(NOTE_SECTIONS), text: z.string().max(20000) })).min(1) });

// Consultant notes are internal; one row per section (version 1), overwritten on save.
export async function PUT(request: Request, { params }: { params: Promise<{ meetingId: string }> }) {
  try {
    const admin = await requireDiscoveryAdmin();
    const { meetingId } = await params;
    const parsed = putSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid notes update." }, { status: 400 });
    const now = new Date().toISOString();
    const rows = parsed.data.notes.map((n) => ({ meeting_id: meetingId, section_key: n.sectionKey, version: 1, visibility: "Internal", content: { text: n.text }, created_by: admin.userId, updated_at: now }));
    const { data, error } = await supabaseAdmin.from("discovery_meeting_notes").upsert(rows, { onConflict: "meeting_id,section_key,version" }).select("*");
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("discovery_activity").insert({ meeting_id: meetingId, actor_id: admin.userId, actor_type: "admin", event_type: "notes_updated", metadata: { sections: rows.map((r) => r.section_key) } });
    return Response.json({ notes: data });
  } catch (error) {
    return discoveryError(error);
  }
}
