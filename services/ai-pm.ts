import { GoogleGenerativeAI } from "@google/generative-ai";

// Load configuration
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export class AiPmService {
  /**
   * Prompts the AI model to generate a sprint plan breakdown based on project specifications.
   */
  static async generateSprintBacklog(reqDescription: string) {
    if (!ai) {
      // Mock local fallback when Gemini credentials are not supplied
      return {
        goal: "Seed baseline MVP functionality",
        tasks: [
          { title: "Design database user models and schemas", points: 3 },
          { title: "Develop API backend routes and routers", points: 5 },
          { title: "Build visual layout dashboard screen", points: 2 }
        ],
        sprintWeeks: 2
      };
    }

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are an expert Agile Scrum Product Owner. 
      Analyze the project requirement description below and generate:
      1. An overall Sprint Goal.
      2. A structured array list of 4-6 specific developer tasks with description, suggested story points.
      
      Requirements:
      "${reqDescription}"
      
      Return results strictly as a JSON object matching this TypeScript model:
      {
        "goal": "...",
        "tasks": [{ "title": "...", "description": "...", "points": number }]
      }`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      // Parse JSON from code block
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e: any) {
      console.error("Sprint planner error:", e);
      throw e;
    }
  }

  /**
   * Scans project parameters and predicts potential delivery risks.
   */
  static async detectDeliveryRisks(projectDetails: any, taskLogs: any[]) {
    if (!ai) {
      return {
        risks: [
          { title: "Scope Creep Warning", severity: "HIGH", mitigation: "Establish rigid change approval workflows." },
          { title: "Resource Constriction", severity: "MEDIUM", mitigation: "Balance workload logs across multiple developers." }
        ]
      };
    }

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Analyze this project parameters details and team task logs. 
      Identify 2-3 potential delivery risks, delay risks, or resource bottlenecks.
      
      Project: ${JSON.stringify(projectDetails)}
      Task logs: ${JSON.stringify(taskLogs)}
      
      Return as a JSON matching this model:
      {
        "risks": [{ "title": "...", "severity": "LOW|MEDIUM|HIGH", "mitigation": "..." }]
      }`;

      const response = await model.generateContent(prompt);
      const cleanJson = response.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
