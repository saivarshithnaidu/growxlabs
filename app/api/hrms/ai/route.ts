import { NextResponse } from "next/server";
import { AiHrmsService } from "@/services/ai-hrms";

export async function POST(request: Request) {
  try {
    const { action, requirements, resume_text, feedback_text } = await request.json();

    if (action === "score_resume") {
      if (!requirements || !resume_text) throw new Error("Missing requirements or resume_text");
      const result = await AiHrmsService.scoreCandidateResume(requirements, resume_text);
      return NextResponse.json({ result });
    }

    if (action === "analyze_sentiment") {
      if (!feedback_text) throw new Error("Missing feedback_text");
      const result = await AiHrmsService.auditFeedbackSentiment(feedback_text);
      return NextResponse.json({ result });
    }

    throw new Error("Invalid action. Use 'score_resume' or 'analyze_sentiment'.");
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "AI HRMS operation failed" }, { status: 400 });
  }
}
