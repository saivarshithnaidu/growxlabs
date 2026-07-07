import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug, lessonSlug } = await params;

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
      .select("id, title, slug")
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
        { error: "Active enrollment required to access lesson content" },
        { status: 403 }
      );
    }

    // 4. Fetch all modules with their lessons for sidebar + navigation
    const { data: modules, error: modulesError } = await supabaseAdmin
      .from("course_modules")
      .select("id, title, sort_order")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });

    if (modulesError || !modules) {
      console.error("Failed to fetch modules:", modulesError?.message);
      return NextResponse.json(
        { error: "Failed to fetch course structure" },
        { status: 500 }
      );
    }

    // Build a flat list of all lessons (for indexing) and the sidebar structure
    const sidebar: Array<{
      id: string;
      title: string;
      lessons: Array<{ title: string; slug: string }>;
    }> = [];
    const allLessons: Array<{ title: string; slug: string; moduleTitle: string }> = [];

    for (const mod of modules) {
      const { data: lessons, error: lessonsError } = await supabaseAdmin
        .from("lessons")
        .select("title, slug")
        .eq("module_id", mod.id)
        .order("sort_order", { ascending: true });

      if (lessonsError) {
        console.error(
          `Failed to fetch lessons for module ${mod.id}:`,
          lessonsError.message
        );
        continue;
      }

      const moduleLessons = lessons ?? [];
      sidebar.push({
        id: mod.id,
        title: mod.title,
        lessons: moduleLessons,
      });

      for (const lesson of moduleLessons) {
        allLessons.push({ ...lesson, moduleTitle: mod.title });
      }
    }

    // 5. Fetch the requested lesson with full content via join
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from("lessons")
      .select(
        "*, course_modules!inner(course_id)"
      )
      .eq("slug", lessonSlug)
      .eq("course_modules.course_id", course.id)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // 6. Calculate navigation metadata
    const totalLessons = allLessons.length;
    const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);

    const prevLesson =
      currentIndex > 0
        ? { title: allLessons[currentIndex - 1].title, slug: allLessons[currentIndex - 1].slug }
        : null;

    const nextLesson =
      currentIndex < totalLessons - 1
        ? { title: allLessons[currentIndex + 1].title, slug: allLessons[currentIndex + 1].slug }
        : null;

    // Remove the join artifact from the lesson object
    const { course_modules: _joinData, ...lessonData } = lesson;

    return NextResponse.json({
      lesson: lessonData,
      sidebar,
      navigation: {
        currentIndex,
        totalLessons,
        prevLesson,
        nextLesson,
      },
    });
  } catch (err) {
    console.error(
      "Unexpected error in GET /api/courses/[slug]/lessons/[lessonSlug]:",
      err
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
