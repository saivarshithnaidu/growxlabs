import { NextResponse } from "next/server";
import { AiPmService } from "@/services/ai-pm";

export async function POST(request: Request) {
  try {
    const { action, description, projectDetails, taskLogs } = await request.json();
    
    if (action === "plan_sprint") {
      const plan = await AiPmService.generateSprintBacklog(description);
      return NextResponse.json({ plan });
    } else if (action === "detect_risks") {
      const risks = await AiPmService.detectDeliveryRisks(projectDetails, taskLogs || []);
      return NextResponse.json({ risks });
    } else {
      throw new Error("Invalid PM action parameter");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "AI PM generation error" }, { status: 400 });
  }
}
