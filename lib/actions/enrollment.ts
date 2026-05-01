"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function enrollInCourse(courseId: string, firstLessonUrl: string) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session?.user) {
    // Redirect to login with the correct locale
    redirect(`/${locale}/login`);
  }

  const userId = (session.user as any).id;

  // Check if already enrolled
  const { data: existing } = await supabaseAdmin
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (!existing) {
    const { error } = await supabaseAdmin
      .from("enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        status: "active"
      });

    if (error) {
      console.error("Enrollment error:", error);
      return { error: "Failed to enroll in course." };
    }
  }

  revalidatePath("/dashboard");
  // The firstLessonUrl already contains the locale prefix if constructed in the component
  redirect(firstLessonUrl);
}
