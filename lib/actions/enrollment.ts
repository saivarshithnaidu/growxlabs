"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function enrollInCourse(courseId: string, firstLessonUrl: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!existing) {
    const { error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: "active"
      });

    if (error) {
      console.error("Enrollment error:", error);
      return { error: "Failed to enroll in course." };
    }
  }

  revalidatePath("/dashboard");
  redirect(firstLessonUrl);
}
