import { GoogleGenAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export class AiHrmsService {
  /**
   * AI candidate scoring based on resume text vs job description.
   */
  static async scoreCandidateResume(requirements: string[], resumeText: string) {
    if (!ai) {
      // Mock local fallback
      return {
        score: 85,
        match_summary: "Strong candidate matching React Native and Typescript parameters.",
        missing_skills: ["TailwindCSS"],
        interview_suggested_questions: [
          "Describe your experience with server-side rendering in Next.js.",
          "How do you profile memory leaks in React Native applications?"
        ]
      };
    }

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are an AI Tech Recruiter. Evaluate this resume:
      "${resumeText}"
      
      Against these job requirements:
      ${JSON.stringify(requirements)}
      
      Provide a match score from 0 to 100, list missing skills, and suggest 2 interview questions.
      Return results strictly as a JSON object matching this model:
      {
        "score": number,
        "match_summary": "...",
        "missing_skills": ["..."],
        "interview_suggested_questions": ["..."]
      }`;

      const response = await model.generateContent(prompt);
      const cleanJson = response.response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * AI employee feedback sentiment trends and attrition flags.
   */
  static async auditFeedbackSentiment(feedbackText: string) {
    if (!ai) {
      return {
        sentiment: "Neutral",
        attrition_risk: "Low",
        key_themes: ["Wants remote flexible hours", "Happy with team support"]
      };
    }

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Analyze employee feedback: "${feedbackText}"
      Identify sentiment (Positive/Neutral/Negative), attrition risk level (High/Medium/Low), and key themes.
      
      Return as a JSON matching this model:
      {
        "sentiment": "Positive|Neutral|Negative",
        "attrition_risk": "High|Medium|Low",
        "key_themes": ["..."]
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
