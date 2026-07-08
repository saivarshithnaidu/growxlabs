"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courseTests } from "@/lib/data/tests";
import { Timer, AlertCircle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isFinishing, setIsFinishing] = useState(false);

  const questions = courseTests[params.course as string] || [];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    setIsFinishing(true);
    
    // Calculate Score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    // Grading Logic
    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';
    else if (score >= 40) grade = 'E';

    // In a real app, send to API here
    // For now, simulate redirect with state
    setTimeout(() => {
      router.push(`/result/${params.course}?score=${score}&grade=${grade}`);
    }, 1500);
  };

  if (!questions.length) return <div className="p-20 text-white">Test not found.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 relative">
      
      {/* Test Header */}
      <div className="max-w-4xl mx-auto mb-16 flex justify-between items-end border-b border-white/5 pb-8">
         <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B]">Assessment Protocol</span>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">Skill Validation.</h1>
         </div>
         <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
            <Timer className="text-[#00A86B]" size={20} />
            <span className="text-xl font-mono text-white font-bold">{formatTime(timeLeft)}</span>
         </div>
      </div>

      <div className="max-w-4xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Progress Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Question Navigator</p>
              <div className="grid grid-cols-4 gap-2">
                 {questions.map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                      i === currentQuestionIndex ? "bg-white text-black border-white" : (answers[i] !== undefined ? "bg-[#00A86B]/20 text-[#00A86B] border-[#00A86B]/40" : "bg-black text-white/20 border-white/10")
                    }`}
                   >
                     {i + 1}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Question Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 lg:p-16"
            >
               <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Question {currentQuestionIndex + 1} of {questions.length}</span>
               <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-12">
                 {currentQuestion.text}
               </h2>

               <div className="space-y-4">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        answers[currentQuestionIndex] === idx 
                          ? "bg-[#00A86B] border-[#00A86B] text-black font-bold" 
                          : "bg-black/40 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{option}</span>
                      {answers[currentQuestionIndex] === idx && <CheckCircle2 size={20} />}
                    </button>
                  ))}
               </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center">
             <Button 
               variant="ghost" 
               disabled={currentQuestionIndex === 0}
               onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
               className="text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest h-12 px-8"
             >
               Previous
             </Button>

             {currentQuestionIndex < questions.length - 1 ? (
               <Button 
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="bg-white text-black hover:bg-neutral-200 h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-white/5"
               >
                 Next Question <ChevronRight size={16} className="ml-2" />
               </Button>
             ) : (
               <Button 
                disabled={isFinishing}
                onClick={handleSubmit}
                className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#00A86B]/10"
               >
                 {isFinishing ? "Finalizing Protocol..." : "Complete Evaluation"}
               </Button>
             )}
          </div>
        </div>
      </div>

      {/* Security Monitoring */}
      <div className="fixed bottom-6 right-6 hidden md:flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
         <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Cheating Prevention Mode: Active</span>
      </div>
    </div>
  );
}
