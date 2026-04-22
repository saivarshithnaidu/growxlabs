"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { courses } from "@/lib/data/courses";
import { CheckCircle2, ChevronLeft, Code2, Globe, Send, Lightbulb, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ProjectPage() {
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Project submitted successfully for evaluation!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Learning</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Content Area */}
          <div className="lg:col-span-7 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1 bg-[#00A86B]/10 rounded-full text-[10px] font-black uppercase text-[#00A86B] border border-[#00A86B]/20 tracking-widest">
                    Final Capstone
                 </span>
                 <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Phase 10: Submission</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-8 italic">
                {course.finalProject.title}.
              </h1>
              <p className="text-[#A0A0A0] text-xl font-light leading-relaxed">
                {course.finalProject.description}
              </p>
            </motion.div>

            {/* Requirements */}
            <div className="space-y-8">
               <h2 className="text-white font-bold text-2xl tracking-tight flex items-center gap-3">
                  <Lightbulb className="text-[#00A86B]" size={24} /> Technical Requirements
               </h2>
               <div className="grid grid-cols-1 gap-4">
                  {course.finalProject.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                       <CheckCircle2 size={18} className="text-[#00A86B]" />
                       <span className="text-[#A0A0A0] group-hover:text-white transition-colors text-sm font-medium">{req}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Submission Guidelines */}
            <div className="p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-3">
                   <ShieldAlert size={20} className="text-yellow-500" /> Validation Guidelines
                </h3>
                <ul className="space-y-4 text-sm text-[#A0A0A0] font-light leading-relaxed">
                   <li>• Ensure your GitHub repository is public or invite 'growx-evaluator'.</li>
                   <li>• Include a README.md with setup instructions and environment variables.</li>
                   <li>• All API endpoints must be documented (Swagger/Postman).</li>
                   <li>• Use clean code practices and meaningful commit messages.</li>
                </ul>
            </div>
          </div>

          {/* Submission Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="bg-white/[0.03] border border-white/10 rounded-[44px] p-10 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A86B] blur-[100px] opacity-10" />
                
                <h2 className="text-white font-black text-2xl mb-8 tracking-tight italic">Submit Project</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0A0A0] ml-1">GitHub Repository URL</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                            <Code2 size={18} />
                         </div>
                         <input 
                           type="url" 
                           required
                           value={githubUrl}
                           onChange={(e) => setGithubUrl(e.target.value)}
                           placeholder="https://github.com/user/repo"
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:border-[#00A86B]/50 transition-all outline-none" 
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0A0A0] ml-1">Live Demo URL (Optional)</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                            <Globe size={18} />
                         </div>
                         <input 
                           type="url" 
                           value={demoUrl}
                           onChange={(e) => setDemoUrl(e.target.value)}
                           placeholder="https://your-demo.vercel.app"
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:border-[#00A86B]/50 transition-all outline-none" 
                         />
                      </div>
                   </div>

                   <div className="pt-4">
                      <Button 
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full bg-[#00A86B] hover:bg-[#00A86B]/90 text-white rounded-2xl h-16 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#00A86B]/10"
                      >
                         Deliver Final Project <Send size={16} />
                      </Button>
                   </div>
                </form>

                <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest mt-8">
                   Evaluated by GrowX Engineering
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
