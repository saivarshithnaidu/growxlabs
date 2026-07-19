"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, Brain, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function AiRecruiterPage() {
  const [activeTab, setActiveTab] = useState<"resume" | "sentiment">("resume");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Resume scoring state
  const [resumeText, setResumeText] = useState("");
  const [requirements, setRequirements] = useState("");

  // Sentiment state
  const [feedbackText, setFeedbackText] = useState("");

  const handleScoreResume = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await fetch("/api/hrms/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "score_resume",
          requirements: requirements.split(",").map(r => r.trim()).filter(Boolean),
          resume_text: resumeText
        })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAnalyzeSentiment = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await fetch("/api/hrms/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze_sentiment", feedback_text: feedbackText })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">AI Recruiter Assistant</h1>
        <p className="text-neutral-500 text-xs">AI-powered resume scoring, candidate matching, and employee sentiment analysis.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-1 w-fit border border-neutral-200">
        <button
          onClick={() => { setActiveTab("resume"); setResult(null); }}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
            activeTab === "resume"
              ? "bg-white shadow-sm text-[#0075de] border border-neutral-200"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" /> Resume Scoring
        </button>
        <button
          onClick={() => { setActiveTab("sentiment"); setResult(null); }}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
            activeTab === "sentiment"
              ? "bg-white shadow-sm text-[#0075de] border border-neutral-200"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" /> Sentiment Analysis
        </button>
      </div>

      {/* Resume Scoring Tab */}
      {activeTab === "resume" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Job Requirements</h4>
            <input
              type="text"
              placeholder="React, TypeScript, Next.js, Node.js (comma-separated)"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-3"
            />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Resume Text</h4>
            <textarea
              placeholder="Paste candidate's resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-48 resize-none"
            />
            <button
              onClick={handleScoreResume}
              disabled={loading || !resumeText || !requirements}
              className="mt-3 w-full bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><Brain className="h-3.5 w-3.5" /> Analyze Resume</>}
            </button>
          </Card>

          {/* Results */}
          <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">AI Analysis Results</h4>
            {!result ? (
              <div className="h-48 flex items-center justify-center text-neutral-300">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Submit a resume to see AI analysis</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center font-mono text-lg font-black",
                    result.score >= 80 ? "bg-green-100 text-green-700 border border-green-200" :
                    result.score >= 60 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                    "bg-red-100 text-red-700 border border-red-200"
                  )}>{result.score}</div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Match Score</p>
                    <p className="text-[9px] text-neutral-400">{result.match_summary}</p>
                  </div>
                </div>

                {result.missing_skills?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Missing Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_skills.map((skill: string, i: number) => (
                        <span key={i} className="text-[8px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded border border-red-200">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.interview_suggested_questions?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Suggested Interview Questions</p>
                    <ol className="space-y-1.5">
                      {result.interview_suggested_questions.map((q: string, i: number) => (
                        <li key={i} className="text-xs text-neutral-600 pl-3 border-l-2 border-blue-300">{q}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Sentiment Analysis Tab */}
      {activeTab === "sentiment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Employee Feedback</h4>
            <textarea
              placeholder="Paste employee feedback, survey response, or review text..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-48 resize-none"
            />
            <button
              onClick={handleAnalyzeSentiment}
              disabled={loading || !feedbackText}
              className="mt-3 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><MessageSquare className="h-3.5 w-3.5" /> Analyze Sentiment</>}
            </button>
          </Card>

          <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Sentiment Results</h4>
            {!result ? (
              <div className="h-48 flex items-center justify-center text-neutral-300">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Submit feedback to analyze sentiment</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Sentiment</p>
                    <span className={cn("px-3 py-1 rounded-lg text-xs font-bold",
                      result.sentiment === "Positive" ? "bg-green-100 text-green-700 border border-green-200" :
                      result.sentiment === "Negative" ? "bg-red-100 text-red-700 border border-red-200" :
                      "bg-neutral-100 text-neutral-700 border border-neutral-200"
                    )}>{result.sentiment}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Attrition Risk</p>
                    <span className={cn("px-3 py-1 rounded-lg text-xs font-bold",
                      result.attrition_risk === "High" ? "bg-red-100 text-red-700 border border-red-200" :
                      result.attrition_risk === "Medium" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-green-100 text-green-700 border border-green-200"
                    )}>{result.attrition_risk}</span>
                  </div>
                </div>

                {result.key_themes?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Themes</p>
                    <div className="space-y-1.5">
                      {result.key_themes.map((theme: string, i: number) => (
                        <div key={i} className="text-xs text-neutral-600 pl-3 border-l-2 border-violet-300">{theme}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
