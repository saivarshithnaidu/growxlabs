"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Architecture confirmed. I am GrowX AI. How can I assist your business growth today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentMessages = [...messages, { role: "user", content: userMessage } as Message];
    
    setInput("");
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.isLeadSaved && data.leadData) {
        try {
          await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.leadData),
          });
        } catch (leadError) {
          console.error("Failed to sync lead:", leadError);
        }
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.message || "I encountered a minor logic misalignment. Please re-state your inquiry." 
      }]);

    } catch (error) {
      console.error("Chat failure:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Uplink unstable. Please check your network or API configuration." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-6 w-[90vw] md:w-[450px] h-[600px] glass rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
               <div className="flex items-center space-x-4">
                 <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center">
                    <Bot className="text-black h-5 w-5" />
                 </div>
                 <div>
                   <h3 className="text-white font-black text-lg tracking-tighter leading-none">GrowX AI</h3>
                   <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-primary mt-1">
                     <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse mr-2" />
                     Live Intel
                   </span>
                 </div>
               </div>
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="h-8 w-8 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
            >
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex flex-col",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-6 rounded-[1.5rem] text-[15px] leading-relaxed",
                    m.role === "user" 
                      ? "bg-white text-black font-bold rounded-tr-none shadow-xl" 
                      : "bg-white/[0.03] text-white/80 font-normal border border-white/5 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex space-x-2">
                     <div className="flex space-x-1 pt-1">
                       <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                     </div>
                   </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <form onSubmit={handleSendMessage} className="p-8 pt-0 shrink-0">
              <div className="relative group">
                <input 
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about architecture..."
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-7 pr-16 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all font-light"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:scale-110"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/10">
                GrowX Intelligent Protocol v2.1
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] text-black relative group"
      >
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-10 group-hover:opacity-20 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
               <X size={32} />
             </motion.div>
          ) : (
             <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
               <MessageCircle size={32} />
             </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
