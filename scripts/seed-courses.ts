import "dotenv/config";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { courses } from "../lib/data/courses";
import { javaAssessment } from "../lib/data/assessments/java";
import { nextjsAssessment } from "../lib/data/assessments/nextjs";
import { pythonAssessment } from "../lib/data/assessments/python";

// Load .env.local for local development
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables:");
  if (!supabaseUrl) console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseServiceKey) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// Course pricing map
const COURSE_PRICES: Record<string, number> = {
  "ai-engineering": 1999,
  "java-mastery": 799,
  "python-mastery": 499,
  "nextjs-fullstack": 899,
};

// Assessment map (keyed by course ID)
const ASSESSMENT_MAP: Record<string, typeof javaAssessment> = {
  "java-mastery": javaAssessment,
  "nextjs-fullstack": nextjsAssessment,
  "python-mastery": pythonAssessment,
};

async function seed() {
  console.log("🌱 Starting GrowX Labs course seed...\n");

  for (const course of courses) {
    // ── 1. Insert Course ──────────────────────────────────────
    const courseRow = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.image,
      difficulty: course.difficulty,
      duration: course.duration,
      become: course.become ?? null,
      problem_solved: course.problemSolved ?? null,
      will_build: course.willBuild ?? null,
      for_who: course.forWho ?? null,
      price_inr: COURSE_PRICES[course.id] ?? 0,
      final_project_title: course.finalProject?.title ?? null,
      final_project_description: course.finalProject?.description ?? null,
      final_project_requirements: course.finalProject?.requirements ?? null,
    };

    const { error: courseError } = await supabase
      .from("courses")
      .upsert(courseRow, { onConflict: "id" });

    if (courseError) {
      console.error(`❌ Failed to insert course "${course.title}":`, courseError.message);
      continue;
    }
    console.log(`✅ Course: ${course.title}`);

    // ── 2. Insert Modules & Lessons ───────────────────────────
    for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
      const mod = course.modules[moduleIndex];

      // Build a unique module ID scoped to the course
      const moduleId = `${course.id}_${mod.id}`;

      const moduleRow = {
        id: moduleId,
        course_id: course.id,
        title: mod.title,
        slug: mod.slug,
        description: mod.description,
        sort_order: moduleIndex,
      };

      const { error: modError } = await supabase
        .from("course_modules")
        .upsert(moduleRow, { onConflict: "id" });

      if (modError) {
        console.error(`   ❌ Module "${mod.title}":`, modError.message);
        continue;
      }
      console.log(`   📦 Module ${moduleIndex + 1}: ${mod.title}`);

      // ── 3. Insert Lessons ─────────────────────────────────
      for (let lessonIndex = 0; lessonIndex < mod.lessons.length; lessonIndex++) {
        const lesson = mod.lessons[lessonIndex];

        // Build a unique lesson ID scoped to the course
        const lessonId = `${course.id}_${lesson.id}`;

        const lessonRow = {
          id: lessonId,
          module_id: moduleId,
          title: lesson.title,
          slug: lesson.slug,
          explanation: lesson.explanation,
          key_points: lesson.keyPoints,
          code_example: lesson.codeExample,
          expected_output: lesson.expectedOutput,
          use_case: lesson.useCase,
          practice_task: lesson.practiceTask,
          sort_order: lessonIndex,
        };

        const { error: lessonError } = await supabase
          .from("lessons")
          .upsert(lessonRow, { onConflict: "id" });

        if (lessonError) {
          console.error(`      ❌ Lesson "${lesson.title}":`, lessonError.message);
        } else {
          console.log(`      📝 Lesson ${lessonIndex + 1}: ${lesson.title}`);
        }
      }
    }

    // ── 4. Insert Assessment Questions ────────────────────────
    const assessment = ASSESSMENT_MAP[course.id];
    if (assessment && assessment.length > 0) {
      console.log(`   🧪 Seeding ${assessment.length} assessment questions...`);

      for (let qIndex = 0; qIndex < assessment.length; qIndex++) {
        const q = assessment[qIndex];

        // Build a unique question ID scoped to the course
        const questionId = `${course.id}_${q.id}`;

        const questionRow = {
          id: questionId,
          course_id: course.id,
          type: q.type,
          difficulty: q.difficulty,
          text: q.text,
          code_snippet: q.codeSnippet ?? null,
          options: q.options,
          correct_option_index: q.correctOptionIndex ?? null,
          correct_option_indices: q.correctOptionIndices ?? null,
          explanation: q.explanation,
          sort_order: qIndex,
        };

        const { error: qError } = await supabase
          .from("assessment_questions")
          .upsert(questionRow, { onConflict: "id" });

        if (qError) {
          console.error(`      ❌ Question "${q.id}":`, qError.message);
        }
      }
      console.log(`   ✅ ${assessment.length} questions seeded for ${course.id}`);
    } else {
      console.log(`   ⏭️  No assessment data for ${course.id}, skipping.`);
    }

    console.log(""); // spacing between courses
  }

  console.log("🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("💥 Fatal seed error:", err);
  process.exit(1);
});
