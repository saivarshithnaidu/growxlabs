"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, CheckCircle2, Phone, Globe, HelpCircle, Mail, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const QUESTIONS = [
  {
    key: "business_city",
    question: "Welcome to GrowX Labs! To get started, what is your Business Name and City?",
    placeholder: "e.g. Acme Corp, New York",
    icon: Building2
  },
  {
    key: "has_website",
    question: "Do you have an existing website?",
    options: ["Yes", "No"],
    icon: Globe
  },
  {
    key: "problem",
    question: "What is your biggest business challenge right now?",
    options: ["Getting more customers", "Saving time / Automation", "Looking professional"],
    icon: HelpCircle
  },
  {
    key: "phone",
    question: "What is your WhatsApp number? We'll send the strategy there.",
    placeholder: "e.g. +1 234 567 890",
    icon: Phone
  },
  {
    key: "email",
    question: "And finally, what is your professional email address?",
    placeholder: "e.g. name@business.com",
    icon: Mail
  }
];

export function GrowXChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: QUESTIONS[0].question }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pitch, setPitch] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (value: string) => {
    if (!value.trim() || isSubmitting || isCompleted) return;

    const currentQuestion = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(newAnswers);

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: value }]);
    setInputValue("");

    if (currentStep < QUESTIONS.length - 1) {
      // Move to next question
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: QUESTIONS[nextStep].question }]);
      }, 600);
    } else {
      // Final Step: Submit
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/leads/inbound", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: newAnswers.business_city.includes(",") 
              ? newAnswers.business_city.split(",")[0].trim() 
              : newAnswers.business_city.trim(),
            city: newAnswers.business_city.includes(",") 
              ? newAnswers.business_city.split(",")[1].trim() 
              : "Not Specified",
            has_website: newAnswers.has_website.toLowerCase(),
            problem: newAnswers.problem,
            phone: newAnswers.phone,
            email: newAnswers.email,
            source: "inbound_ai"
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setPitch(data.pitch);
          setIsCompleted(true);
          setTimeout(() => {
             setMessages(prev => [
               ...prev, 
               { role: "assistant", content: data.pitch },
               { role: "assistant", content: "Our team will contact you within 1 hour." }
             ]);
          }, 800);
        }
      } catch (error) {
        setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong, but we've captured your interest. Our team will reach out!" }]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-4 w-[min(calc(100vw-2rem),400px)] h-[600px] border border-white/10 bg-[#0A0F1E] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[#0E1528] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold leading-none">GrowX Sales Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Expert Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-primary text-black font-semibold rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isSubmitting && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl animate-pulse">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="flex justify-center pt-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Lead Captured Successfully
                  </motion.div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0E1528] border-t border-white/10">
              {!isCompleted ? (
                <div className="space-y-3">
                  {QUESTIONS[currentStep]?.options ? (
                    <div className="grid grid-cols-1 gap-2">
                      {QUESTIONS[currentStep].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-zinc-300 hover:text-white transition-all transform active:scale-[0.98]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                        placeholder={QUESTIONS[currentStep]?.placeholder || "Type your message..."}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-600"
                      />
                      <button
                        disabled={!inputValue.trim() || isSubmitting}
                        onClick={() => handleSend(inputValue)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:grayscale text-black rounded-lg flex items-center justify-center transition-all active:scale-95"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-zinc-500 font-medium tracking-tight">Window will close automatically soon</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#0E1528] border border-white/10 rounded-full flex items-center justify-center shadow-2xl relative transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X size={28} className="text-white relative z-10" />
        ) : (
          <div className="relative z-10">
             <MessageCircle size={28} className="text-white" />
             <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0A0F1E] rounded-full" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
