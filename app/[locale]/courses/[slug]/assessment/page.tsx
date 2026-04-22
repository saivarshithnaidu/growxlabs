"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { courses } from "@/lib/data/courses";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertTriangle, Clock, ChevronRight, ChevronLeft, CheckSquare, Square, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/courses";

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface AssessmentState {
  questions: Question[];
  answers: Record<number, any>;
  currentIdx: number;
  timeLeft: number;
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  
  const course = courses.find(c => c.slug === params.slug);
  const baseQuestions = course?.assessment || [];

  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!course) return;
    
    // Load from localStorage to prevent refresh exploit
    const savedStateStr = localStorage.getItem(`assessment_${course.slug}`);
    if (savedStateStr) {
      try {
        const parsed: AssessmentState = JSON.parse(savedStateStr);
        // Ensure the saved state contains the active questions (new format support)
        if (parsed.questions && parsed.questions.length > 0) {
          setActiveQuestions(parsed.questions);
          setAnswers(parsed.answers || {});
          setCurrentIdx(parsed.currentIdx || 0);
          if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
          setMounted(true);
          return;
        }
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    
    // Initialize Anti-Cheat: Shuffle Questions and Options
    let rawQs = [...baseQuestions];
    rawQs = shuffleArray(rawQs);
    
    const shuffledQs = rawQs.map(q => {
      const newOptions = shuffleArray(q.options);
      let newCorrectIndex, newCorrectIndices;
      
      if (q.type === 'multi_select' && q.correctOptionIndices) {
        const correctTexts = q.correctOptionIndices.map(i => q.options[i]);
        newCorrectIndices = correctTexts.map(t => newOptions.indexOf(t));
      } else if (q.correctOptionIndex !== undefined) {
        const correctText = q.options[q.correctOptionIndex];
        newCorrectIndex = newOptions.indexOf(correctText);
      }
      
      return {
        ...q,
        options: newOptions,
        correctOptionIndex: newCorrectIndex,
        correctOptionIndices: newCorrectIndices
      };
    });

    setActiveQuestions(shuffledQs);
    setMounted(true);
  }, [course, baseQuestions]);

  // Save state
  useEffect(() => {
    if (mounted && course && !isSubmitted && activeQuestions.length > 0) {
      localStorage.setItem(`assessment_${course.slug}`, JSON.stringify({
        questions: activeQuestions,
        answers, 
        currentIdx, 
        timeLeft
      }));
    }
  }, [answers, currentIdx, timeLeft, course, mounted, isSubmitted, activeQuestions]);

  // Timer
  useEffect(() => {
    if (!mounted || timeLeft <= 0 || isSubmitted) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(t);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mounted, timeLeft, isSubmitted]);

  const handleSelect = (qIdx: number, oIdx: number, qType: string) => {
    if (qType === 'multi_select') {
      setAnswers(prev => {
        const currentArr = (prev[qIdx] as number[]) || [];
        if (currentArr.includes(oIdx)) {
          return { ...prev, [qIdx]: currentArr.filter(i => i !== oIdx) };
        } else {
          return { ...prev, [qIdx]: [...currentArr, oIdx] };
        }
      });
    } else {
      setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    }
  };

  const handleFinalSubmit = useCallback(() => {
    setIsSubmitted(true);
    let correctCount = 0;
    
    activeQuestions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (q.type === 'multi_select' && q.correctOptionIndices && Array.isArray(userAns)) {
        const sortedUser = [...userAns].sort();
        const sortedCorrect = [...q.correctOptionIndices].sort();
        if (JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect)) {
          correctCount++;
        }
      } else if (userAns === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeQuestions.length) * 100);
    
    let grade = 'F';
    if (scorePct >= 90) grade = 'A';
    else if (scorePct >= 75) grade = 'B';
    else if (scorePct >= 60) grade = 'C';
    else if (scorePct >= 50) grade = 'D';

    localStorage.setItem(`result_${course?.slug}`, JSON.stringify({
      score: scorePct,
      grade
    }));

    localStorage.removeItem(`assessment_${course?.slug}`);
    router.push(`/${params.locale}/courses/${course?.slug}/result`);
  }, [answers, activeQuestions, course?.slug, params.locale, router]);

  if (!course || baseQuestions.length === 0) {
    return <div className="min-h-screen bg-black text-white p-20">Assessment is missing or currently being updated.</div>;
  }

  if (!mounted || activeQuestions.length === 0) return <div className="min-h-screen bg-black" />;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = activeQuestions[currentIdx];

  const difficultyColors = {
    easy: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    medium: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
    hard: "text-red-400 border-red-400/20 bg-red-400/10"
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B]">Final Evaluation [PRO]</span>
              <h1 className="text-xl font-bold mt-1 text-white">{course.title}</h1>
           </div>
           <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Clock size={16} className={timeLeft < 600 ? "text-red-500 animate-pulse" : "text-[#A0A0A0]"} />
              <span className={`text-sm font-bold font-mono tracking-widest ${timeLeft < 600 ? "text-red-500" : "text-white"}`}>
                 {formatTime(timeLeft)}
              </span>
           </div>
        </div>

        {/* Warning Alert */}
        <div className="bg-[#0A0A0A] border border-[#00A86B]/20 p-4 rounded-xl flex items-start gap-4 mb-8">
           <AlertTriangle size={20} className="text-[#00A86B] mt-0.5 shrink-0" />
           <div>
              <h3 className="text-sm font-bold text-[#00A86B] mb-1">Strict Anti-Cheat Enforced</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                 Questions and options have been uniquely randomized. Do not exit this session. Tab switching or refreshing may force submission.
              </p>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col">
           {/* Progress Bar */}
           <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                animate={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                className="h-full bg-[#00A86B]"
              />
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={currentIdx}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8 flex-1"
             >
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-[#00A86B]">
                      Question {currentIdx + 1} of {activeQuestions.length}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60">
                         {currentQ.type.replace('_', ' ')}
                      </div>
                      <div className={`px-3 py-1 rounded-md border text-[10px] font-bold tracking-widest uppercase ${difficultyColors[currentQ.difficulty]}`}>
                         {currentQ.difficulty}
                      </div>
                   </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white leading-snug">
                   {currentQ.text}
                </h2>

                {currentQ.codeSnippet && (
                   <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 font-mono text-sm text-[#00A86B] overflow-x-auto my-6 shadow-inner">
                      <code className="whitespace-pre-wrap">{currentQ.codeSnippet}</code>
                   </div>
                )}

                {currentQ.type === 'multi_select' && (
                   <div className="text-xs text-yellow-500/80 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                     <AlertTriangle size={14} /> Select multiple correct answers
                   </div>
                )}

                <div className="grid grid-cols-1 gap-4 mt-6">
                   {currentQ.options.map((opt, oIdx) => {
                     const isMulti = currentQ.type === 'multi_select';
                     const isSelected = isMulti 
                           ? ((answers[currentIdx] as number[]) || []).includes(oIdx)
                           : answers[currentIdx] === oIdx;

                     return (
                       <button
                         key={oIdx}
                         onClick={() => handleSelect(currentIdx, oIdx, currentQ.type)}
                         className={`text-left p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                           isSelected 
                             ? "bg-[#00A86B]/10 border-[#00A86B] shadow-[0_0_20px_rgba(0,168,107,0.1)]" 
                             : "bg-black border-white/10 hover:border-white/30 hover:bg-white/5"
                         }`}
                       >
                          <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#A0A0A0] group-hover:text-white"}`}>
                            {opt}
                          </span>
                          <div className={`w-5 h-5 flex items-center justify-center transition-all ${
                            isSelected ? "text-[#00A86B]" : "text-white/20"
                          }`}>
                             {isMulti ? (
                               isSelected ? <CheckSquare size={18} /> : <Square size={18} />
                             ) : (
                               <div className={`w-full h-full rounded-full border flex items-center justify-center ${isSelected ? "border-[#00A86B] bg-[#00A86B]" : "border-white/20"}`}>
                                  {isSelected && <CheckCircle2 size={12} className="text-black" />}
                               </div>
                             )}
                          </div>
                       </button>
                     );
                   })}
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="mt-8 flex items-center justify-between pl-2">
           <Button 
             variant="outline"
             onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
             disabled={currentIdx === 0}
             className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent px-6 rounded-xl"
           >
              <ChevronLeft size={16} className="mr-2" /> Previous
           </Button>

           {currentIdx === activeQuestions.length - 1 ? (
             <Button
               onClick={handleFinalSubmit}
               disabled={Object.keys(answers).length < activeQuestions.length * 0.5} // Allow submitting even if not 100% complete
               className="bg-[#00A86B] text-black hover:bg-[#00A86B]/90 font-black uppercase text-xs tracking-widest px-8 rounded-xl h-12 shadow-[0_0_30px_rgba(0,168,107,0.3)]"
             >
                Submit Validation
             </Button>
           ) : (
             <Button
               onClick={() => setCurrentIdx(Math.min(activeQuestions.length - 1, currentIdx + 1))}
               className="bg-white text-black hover:bg-white/90 font-black uppercase text-xs tracking-widest px-8 rounded-xl h-12 shadow-xl shadow-white/10 transition-transform active:scale-95"
             >
                Next <ChevronRight size={16} className="ml-2" />
             </Button>
           )}
        </div>
      </div>
    </div>
  );
}
