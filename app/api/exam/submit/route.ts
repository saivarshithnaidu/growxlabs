import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendCertificateEmail } from "@/lib/mail/certificate-mailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, answers } = await req.json(); // answers: { qId: string, choice: number }[]
    const userId = (session.user as any).id;

    // 1. Check attempt limit (max 3)
    const { data: attempts } = await supabaseAdmin
      .from("exam_attempts")
      .select("id, status")
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (attempts && attempts.length >= 3) {
      const hasPassed = attempts.some(a => a.status === 'passed');
      if (!hasPassed) {
        return NextResponse.json({ error: "Maximum attempts reached. Exam locked." }, { status: 403 });
      }
    }

    // 2. Fetch correct answers
    const { data: questions } = await supabaseAdmin
      .from("questions")
      .select("id, correct_answer")
      .eq("course_id", courseId);

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Exam questions not found" }, { status: 404 });
    }

    // 3. Calculate Score
    let correctCount = 0;
    answers.forEach((ans: any) => {
      const q = questions.find(q => q.id === ans.qId);
      if (q && q.correct_answer === ans.choice) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // 4. Assign Grade
    let grade = "F";
    let status = "failed";

    if (scorePercentage >= 90) grade = "A";
    else if (scorePercentage >= 80) grade = "B";
    else if (scorePercentage >= 70) grade = "C";
    else if (scorePercentage >= 60) grade = "D";
    else if (scorePercentage >= 50) grade = "E";

    if (scorePercentage >= 60) status = "passed";

    // 5. Save Attempt
    const { error: attemptError } = await supabaseAdmin
      .from("exam_attempts")
      .insert({
        user_id: userId,
        course_id: courseId,
        score: scorePercentage,
        grade: grade,
        attempt_number: (attempts?.length || 0) + 1,
        status: status
      });

    if (attemptError) throw attemptError;

    // 6. If Passed, Generate Certificate and Email
    if (status === "passed") {
      // Get student details (from users table since we simplified it)
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("name, email")
        .eq("id", userId)
        .single();

      // Get course display name (assuming we have a courses table or data lib)
      // For now we'll use a placeholder or lookup in data
      const courseName = courseId.replace(/-/g, ' ').toUpperCase(); 

      const certId = `GXL-${courseId.toUpperCase().slice(0, 4)}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const verificationCode = `VER-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await supabaseAdmin.from("certificates").insert({
        id: certId,
        user_id: userId,
        course_id: courseId,
        grade: grade,
        issued_at: new Date().toISOString(),
        verification_code: verificationCode
      });

      // Send Email
      if (userData?.email) {
        await sendCertificateEmail(
          userData.email,
          userData.name,
          courseName,
          grade,
          certId
        );
      }

      return NextResponse.json({ 
        passed: true, 
        score: scorePercentage, 
        grade, 
        certId,
        message: "Congratulations! Your certificate has been generated and emailed to you." 
      });
    }

    return NextResponse.json({ 
      passed: false, 
      score: scorePercentage, 
      grade, 
      message: "You did not meet the passing criteria. Please try again." 
    });

  } catch (error: any) {
    console.error("Exam Submission Error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
