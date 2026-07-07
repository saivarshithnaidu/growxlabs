import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PUBLIC_FIELDS = [
  "id",
  "title",
  "slug",
  "description",
  "image",
  "difficulty",
  "duration",
  "price_inr",
  "become",
  "problem_solved",
  "will_build",
  "for_who",
] as const;

export async function GET() {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from("courses")
      .select(`
        id,
        title,
        slug,
        description,
        image,
        difficulty,
        duration,
        price_inr,
        become,
        problem_solved,
        will_build,
        for_who,
        course_modules ( id )
      `);

    if (error) {
      console.error("Failed to fetch courses:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch courses" },
        { status: 500 }
      );
    }

    const formattedCourses = (courses ?? []).map((c: any) => {
      const { course_modules, ...rest } = c;
      return {
        ...rest,
        modules: course_modules ?? [],
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (err) {
    console.error("Unexpected error in GET /api/courses:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
