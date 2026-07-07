import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // 1. Authenticate
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Fetch course by slug
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id, title")
      .eq("slug", slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // 3. Verify active enrollment
    const { data: enrollment } = await supabaseAdmin
      .from("enrollments")
      .select("status")
      .eq("user_id", session.user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .single();

    if (!enrollment) {
      return NextResponse.json(
        { error: "Active enrollment required to access assessments" },
        { status: 403 }
      );
    }

    // 4. Fetch assessment questions
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("assessment_questions")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });

    if (questionsError) {
      console.error(
        "Failed to fetch assessment questions:",
        questionsError.message
      );
      return NextResponse.json(
        { error: "Failed to fetch assessment questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      courseTitle: course.title,
      questions: questions ?? [],
    });
  } catch (err) {
    console.error(
      "Unexpected error in GET /api/courses/[slug]/assessment:",
      err
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
