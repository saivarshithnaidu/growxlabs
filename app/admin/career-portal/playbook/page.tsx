"use client";

import { useState } from "react";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";
import { Phone, Mail, Briefcase, FileText, Clipboard, Check } from "lucide-react";

const PLAYBOOK = {
  screening: {
    title: "01 // Screening Call",
    description: "15-minute introductory Zoom/Google Meet to assess voice energy, articulation, and background fit.",
    opening: `Hi [Candidate Name], thanks for jumping on. The goal of this call is simple: I want to hear a bit about your background, understand what drives you, and share what we are building at GrowX Labs. If it sounds like a fit, we’ll move to a quick sales assessment. Let’s start with you—walk me through your story.`,
    questions: [
      {
        q: "What specifically drew you to outbound B2B sales instead of other business or marketing roles?",
        listen: "Confidence, fluency, clarity of speech. Outbound SDRs cannot be hesitant to speak on calls."
      },
      {
        q: "If you had to pitch GrowX Labs Tech to a legacy business owner in a traditional industry like manufacturing, how would you explain what we do in 30 seconds?",
        listen: "Checks if they researched growxlabs.tech. Look for focus on problem-solving (saving time, reducing errors) rather than generic AI slop."
      },
      {
        q: "This is a founding role with performance incentives rather than a fixed salary. Traditional B2B sales cycles take time and require persistent follow-ups. Why does this commission-based model excite you, and how do you handle rejection?",
        listen: "Filters for self-motivated hunger, resilience, and alignment with the startup model."
      }
    ]
  },
  assessment: {
    title: "02 // Sales Task",
    description: "Copy-paste email to send candidates who pass the introductory screening call.",
    emailSubject: "Next Steps: Sales Assessment Task | GrowX Labs Careers",
    emailBody: `Hi [Candidate Name],

Great speaking with you today. As discussed, the next step in our process is a brief sales assessment task. This helps us evaluate your copywriting, research skills, and overall sales logic.

Please complete the following task within 48 hours:

1. Identify 2 traditional, non-tech companies in India or globally (e.g., manufacturing plants, logistics firms, packaging suppliers, warehousing, or chemical distribution).
2. For each company, find a key decision-maker on LinkedIn (e.g., VP of Operations, Founder, Managing Director, or Supply Chain Head).
3. Write a personalized 3-sentence outreach message (LinkedIn InMail style) pitching GrowX Labs' automation services to them. 

Avoid generic pitches. Focus on a specific business problem (e.g., automated invoice processing, inventory tracking, or CRM syncing) and make a clear call-to-action to book a brief discovery call.

Reply directly to this email with your choices and scripts.

Best regards,
GrowX Labs HR`
  },
  roleplay: {
    title: "03 // Live Roleplay",
    description: "15-minute mock outreach call. You play a busy traditional business owner (e.g., Mr. Sharma, MD of Sharma Packaging); candidate plays GrowX Labs SDR calling you to book a slot.",
    objections: [
      {
        obj: "I am busy right now, send me an email.",
        ans: "I completely understand you're busy, Mr. Sharma. I can certainly send an email, but it's usually easier to determine if this is even relevant in a quick 2-minute chat. Do you have 2 minutes now, or should we schedule a time tomorrow morning?"
      },
      {
        obj: "We don't need AI or custom systems. Our Excel spreadsheets work fine.",
        ans: "Excel is great, and many of our clients start there. The reason they switch is because manual entry costs their team 10 hours a week and leads to inventory errors. If we could automate that entry and save your team 40 hours a month, would it be worth a 10-minute look?"
      },
      {
        obj: "How much does this cost?",
        ans: "Because we build custom systems tailored to your exact operations, there is no flat fee. However, our typical solution yields a return on investment within the first 60 days. Our founder can walk you through exact pricing once we understand your bottlenecks. Are you open to a 10-minute chat with him this Thursday?"
      }
    ]
  },
  scorecard: {
    title: "04 // Scorecard",
    description: "Copy-paste this template directly into the 'Internal Hiring Notes' box in the candidate detail drawer of the Career Portal.",
    template: `// Candidate Evaluation
- Written Communication (Assessment Task): /5
- Verbal Clarity & Energy (Screening Call): /5
- Objection Handling (Mock Call): /5
- Research & Preparation: /5
- Incentives & Grit Alignment: /5

Hiring Decision: [Shortlist / Reject]
Next Action: [Send Stage 2 Task / Send Rejection]`
  }
};

export default function PlaybookPage() {
  const [playbookSubTab, setPlaybookSubTab] = useState<"screening" | "assessment" | "roleplay" | "scorecard">("screening");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadPlaybook = () => {
    const text = `# GrowX Labs SDR Hiring Playbook

## 01 // SCREENING CALL
Description: ${PLAYBOOK.screening.description}

Opening Script:
"${PLAYBOOK.screening.opening}"

Questions:
${PLAYBOOK.screening.questions.map((q, i) => `Q${i+1}: ${q.q}\nWhat to listen for: ${q.listen}`).join('\n\n')}

--------------------------------------------------

## 02 // SALES TASK (STAGE 2)
Description: ${PLAYBOOK.assessment.description}

Subject: ${PLAYBOOK.assessment.emailSubject}
Body:
${PLAYBOOK.assessment.emailBody}

--------------------------------------------------

## 03 // LIVE ROLEPLAY OBJECTIONS (STAGE 3)
Description: ${PLAYBOOK.roleplay.description}

Objections:
${PLAYBOOK.roleplay.objections.map((o, i) => `Objection ${i+1}: "${o.obj}"\nHandler: "${o.ans}"`).join('\n\n')}

--------------------------------------------------

## 04 // EVALUATION SCORECARD
Description: ${PLAYBOOK.scorecard.description}

Scorecard Template:
${PLAYBOOK.scorecard.template}
`;

    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "growxlabs_sdr_hiring_playbook.md");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 relative">
      <Reveal y={-20}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight font-sans">Interviewer Playbook</h1>
            <p className="text-neutral-500 text-sm font-medium">Outbound Sales Development Representative (SDR) Hiring Guide</p>
          </div>
          <button
            onClick={downloadPlaybook}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-sm"
          >
            <FileText size={13} className="text-primary" />
            Download Playbook (.md)
          </button>
        </div>
      </Reveal>

      <Reveal y={10}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Playbook Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { key: "screening", label: "01 // Intro Screen", icon: Phone },
              { key: "assessment", label: "02 // Sales Task", icon: Mail },
              { key: "roleplay", label: "03 // Live Roleplay", icon: Briefcase },
              { key: "scorecard", label: "04 // Scorecard", icon: FileText }
            ].map(sub => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.key}
                  onClick={() => setPlaybookSubTab(sub.key as any)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer",
                    playbookSubTab === sub.key
                      ? "bg-white border-neutral-300 text-neutral-900 font-bold shadow-sm"
                      : "bg-neutral-50 border-neutral-200/60 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                  )}
                >
                  <Icon size={14} className={playbookSubTab === sub.key ? "text-primary" : "text-neutral-400"} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Playbook Panel Content */}
          <div className="lg:col-span-3 border border-neutral-200 bg-white rounded-2xl p-8 shadow-sm">
            {/* Screening Call Tab */}
            {playbookSubTab === "screening" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 uppercase tracking-wider font-mono">// 01 // Screening Call Prompts</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{PLAYBOOK.screening.description}</p>
                </div>

                <div className="border border-neutral-200 bg-neutral-50 rounded-xl overflow-hidden">
                  <div className="bg-neutral-100/70 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">Opening Script</span>
                    <button
                      onClick={() => handleCopy(PLAYBOOK.screening.opening, "screening_opening")}
                      className="px-2.5 py-1 border border-neutral-250 hover:border-neutral-300 bg-white rounded text-[9px] font-mono font-bold tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedKey === "screening_opening" ? <Check size={10} className="text-emerald-500" /> : <Clipboard size={10} />}
                      {copiedKey === "screening_opening" ? "COPIED" : "COPY SCRIPT"}
                    </button>
                  </div>
                  <div className="p-6 text-xs text-neutral-700 select-text leading-relaxed italic">
                    "{PLAYBOOK.screening.opening}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">// Evaluation Questions</h4>
                  {PLAYBOOK.screening.questions.map((item, idx) => (
                    <div key={idx} className="p-5 border border-neutral-200 bg-neutral-50 rounded-xl space-y-2.5">
                      <p className="text-xs font-bold text-neutral-900 leading-relaxed"><span className="font-mono text-primary mr-2">Q{idx + 1}:</span> {item.q}</p>
                      <div className="pt-2.5 border-t border-neutral-200 flex items-start gap-2">
                        <span className="text-[8px] font-mono font-black uppercase bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded tracking-wider shrink-0 mt-0.5">What to listen for</span>
                        <p className="text-xs text-neutral-650 leading-relaxed font-sans">{item.listen}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales Task Tab */}
            {playbookSubTab === "assessment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 uppercase tracking-wider font-mono">// 02 // Out-of-Office Sales Assessment</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{PLAYBOOK.assessment.description}</p>
                </div>

                <div className="border border-neutral-200 bg-neutral-50 rounded-xl overflow-hidden">
                  <div className="bg-neutral-100/70 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">Email Template</span>
                    <button
                      onClick={() => handleCopy(`Subject: ${PLAYBOOK.assessment.emailSubject}\n\n${PLAYBOOK.assessment.emailBody}`, "assessment_email")}
                      className="px-2.5 py-1 border border-neutral-250 hover:border-neutral-300 bg-white rounded text-[9px] font-mono font-bold tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedKey === "assessment_email" ? <Check size={10} className="text-emerald-500" /> : <Clipboard size={10} />}
                      {copiedKey === "assessment_email" ? "COPIED" : "COPY EMAIL"}
                    </button>
                  </div>
                  <div className="p-6 space-y-4 font-sans text-xs text-neutral-700 select-text leading-relaxed">
                    <p><strong className="text-neutral-900">Subject:</strong> {PLAYBOOK.assessment.emailSubject}</p>
                    <hr className="border-neutral-200" />
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-neutral-600">{PLAYBOOK.assessment.emailBody}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Live Roleplay Tab */}
            {playbookSubTab === "roleplay" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 uppercase tracking-wider font-mono">// 03 // Live Mock Call Objection Handling</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{PLAYBOOK.roleplay.description}</p>
                </div>

                <div className="space-y-4">
                  {PLAYBOOK.roleplay.objections.map((item, idx) => (
                    <div key={idx} className="p-5 border border-neutral-200 bg-neutral-50 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-red-600 leading-relaxed"><span className="font-mono mr-2">OBJECTION:</span> "{item.obj}"</p>
                      <div className="pt-3 border-t border-neutral-200 relative">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider block">Recommended Objection Handler</span>
                          <button
                            onClick={() => handleCopy(item.ans, `objection_${idx}`)}
                            className="px-2.5 py-0.5 border border-neutral-250 hover:border-neutral-300 bg-white rounded text-[8.5px] font-mono font-bold tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            {copiedKey === `objection_${idx}` ? <Check size={8} className="text-emerald-500" /> : <Clipboard size={8} />}
                            {copiedKey === `objection_${idx}` ? "COPIED" : "COPY SCRIPT"}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed italic">"{item.ans}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scorecard Tab */}
            {playbookSubTab === "scorecard" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 uppercase tracking-wider font-mono">// 04 // Candidate Review Scorecard</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{PLAYBOOK.scorecard.description}</p>
                </div>

                <div className="border border-neutral-200 bg-neutral-50 rounded-xl overflow-hidden">
                  <div className="bg-neutral-100/70 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">Scorecard Template</span>
                    <button
                      onClick={() => handleCopy(PLAYBOOK.scorecard.template, "scorecard_template")}
                      className="px-2.5 py-1 border border-neutral-250 hover:border-neutral-300 bg-white rounded text-[9px] font-mono font-bold tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      {copiedKey === "scorecard_template" ? <Check size={10} className="text-emerald-500" /> : <Clipboard size={10} />}
                      {copiedKey === "scorecard_template" ? "COPIED" : "COPY SCORECARD"}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-xs text-neutral-650 select-text leading-relaxed bg-neutral-900 text-neutral-200 border border-neutral-950 rounded-b-xl">
                    <pre className="whitespace-pre-wrap leading-relaxed">{PLAYBOOK.scorecard.template}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono text-neutral-450 uppercase tracking-widest">GrowX Labs HR Playbook v1.0.0</span>
      </div>
    </div>
  );
}
