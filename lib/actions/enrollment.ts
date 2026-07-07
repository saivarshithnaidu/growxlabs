"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getAbsoluteUrl } from "@/lib/subdomains";
const COURSE_PRICES: Record<string, number> = {
  "ai-engineering": 1999,
  "java-mastery": 799,
  "python-mastery": 499,
  "nextjs-fullstack": 899,
};

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
    // Redirect to checkout since user hasn't paid/enrolled yet
    const price = COURSE_PRICES[courseId] || 1999;
    
    // Fetch course details from DB
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .single();
      
    const title = course?.title || courseId.replace(/-/g, " ").toUpperCase();
    const checkoutUrl = getAbsoluteUrl(`/checkout?productId=${courseId}&type=course&price=${price}&title=${encodeURIComponent(title)}`);
    redirect(checkoutUrl);
  }

  revalidatePath("/dashboard");
  // The firstLessonUrl already contains the locale prefix if constructed in the component
  redirect(firstLessonUrl);
}
