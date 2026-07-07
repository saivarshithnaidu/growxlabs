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

    // 1. Fetch course by slug
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // 2. Check enrollment status if user is authenticated
    let isEnrolled = false;
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      const { data: enrollment } = await supabaseAdmin
        .from("enrollments")
        .select("status")
        .eq("user_id", session.user.id)
        .eq("course_id", course.id)
        .eq("status", "active")
        .single();

      isEnrolled = !!enrollment;
    }

    // 3. Fetch modules ordered by sort_order
    const { data: modules, error: modulesError } = await supabaseAdmin
      .from("course_modules")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });

    if (modulesError) {
      console.error("Failed to fetch modules:", modulesError.message);
      return NextResponse.json(
        { error: "Failed to fetch course modules" },
        { status: 500 }
      );
    }

    // 4. For each module, fetch lessons
    const modulesWithLessons = await Promise.all(
      (modules ?? []).map(async (mod) => {
        const lessonFields = isEnrolled
          ? "*"
          : "title, slug";

        const { data: lessons, error: lessonsError } = await supabaseAdmin
          .from("lessons")
          .select(lessonFields)
          .eq("module_id", mod.id)
          .order("sort_order", { ascending: true });

        if (lessonsError) {
          console.error(
            `Failed to fetch lessons for module ${mod.id}:`,
            lessonsError.message
          );
          return { ...mod, lessons: [] };
        }

        return { ...mod, lessons: lessons ?? [] };
      })
    );

    // 5. Build response — include final project details only for enrolled users
    const responseData: Record<string, unknown> = {
      ...course,
      modules: modulesWithLessons,
      isEnrolled,
    };

    if (!isEnrolled) {
      delete responseData.final_project_title;
      delete responseData.final_project_description;
      delete responseData.final_project_requirements;
    }

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Unexpected error in GET /api/courses/[slug]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
