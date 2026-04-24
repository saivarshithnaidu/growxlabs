import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const certId = searchParams.get("id");

  if (!certId) {
    return NextResponse.json({ error: "Missing certificate ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select("student_name, course_name, issue_date, grade, verified")
    .eq("cert_id", certId)
    .single();

  if (error || !data) {
    return NextResponse.json({ verified: false, error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json({
    verified: data.verified,
    student_name: data.student_name,
    course_name: data.course_name,
    issue_date: data.issue_date,
    grade: data.grade,
  });
}
