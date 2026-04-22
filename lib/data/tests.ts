import { Question } from "@/types/courses";
import { javaAssessment } from "./assessments/java";
import { nextjsAssessment } from "./assessments/nextjs";
import { pythonAssessment } from "./assessments/python";

export const courseTests: Record<string, Question[]> = {
  "java-mastery": javaAssessment,
  "nextjs-fullstack": nextjsAssessment,
  "python-mastery": pythonAssessment
};
