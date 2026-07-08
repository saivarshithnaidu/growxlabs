"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Menu, X, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface LessonData {
  id: string;
  title: string;
  slug: string;
  explanation: string;
  keyPoints: string[];
  codeExample: string;
  expectedOutput: string;
  useCase: string;
  practiceTask: string;
}

interface SidebarModule {
  id: string;
  title: string;
  slug: string;
  lessons: { id: string; title: string; slug: string }[];
}

interface LessonResponse {
  lesson: LessonData;
  course: { title: string; slug: string };
  modules: SidebarModule[];
  currentIndex: number;
  totalLessons: number;
  prevLesson: { slug: string; moduleSlug: string } | null;
  nextLesson: { slug: string; moduleSlug: string } | null;
}

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/courses/${params.course}/lessons/${params.lesson}`);
        if (res.status === 401) {
          router.push(`/${params.locale}/login`);
          return;
        }
        if (res.status === 403) {
          router.push(`/${params.locale}/courses/${params.course}`);
          return;
        }
        if (res.status === 404) {
          setError("not_found");
          return;
        }
        if (!res.ok) {
          setError("Failed to load lesson");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [params.course, params.lesson, params.locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00A86B] animate-spin" />
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error === "not_found" || !data) {
    return notFound();
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const { lesson: currentLesson, course, modules, currentIndex, totalLessons, prevLesson, nextLesson } = data;
  const progress = Math.round(((currentIndex + 1) / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-black text-[#A0A0A0] flex pt-20">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#00A86B] rounded-full flex items-center justify-center text-black shadow-2xl transition-transform active:scale-95"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Simplified Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static pt-20",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col pt-10">
          <div className="px-8 mb-8">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Learning Progress</div>
             <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div style={{ width: `${progress}%` }} className="h-full bg-[#00A86B] transition-all duration-500" />
                </div>
                <span className="text-[10px] font-black text-[#00A86B]">{progress}%</span>
             </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 custom-scrollbar">
            {modules.map((module) => (
              <div key={module.id} className="space-y-1">
                <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">{module.title}</h4>
                {module.lessons.map((lesson) => {
                  const isActive = lesson.slug === params.lesson;
                  return (
                    <Link 
                      key={lesson.id}
                      href={`/${params.locale}/learn/${course.slug}/${module.slug}/${lesson.slug}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                        isActive ? "bg-[#00A86B]/10 text-white" : "hover:bg-white/[0.02] text-[#A0A0A0]"
                      )}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isActive ? "bg-[#00A86B]" : "bg-white/10 group-hover:bg-white/20"
                      )} />
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Simplified Documentation-style Content Area */}
      <main className="flex-1 overflow-y-auto px-6 md:px-10 py-16 custom-scrollbar">
         <div className="max-w-[800px] mx-auto">
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-20 pb-20"
            >
               {/* 1. What is this concept? */}
               <header className="space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A86B]">Lesson {currentIndex + 1}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    {currentLesson.title}
                  </h1>
                  <p className="text-xl text-[#A0A0A0] leading-relaxed font-light">
                    {currentLesson.explanation}
                  </p>
               </header>

               {/* 2. Why it matters */}
               <section className="space-y-4 border-l-2 border-[#00A86B]/20 pl-8">
                  <h2 className="text-white font-bold text-lg uppercase tracking-widest text-white/40">Why it matters</h2>
                  <p className="text-lg leading-relaxed text-[#D4D4D4] font-light">
                    {currentLesson.useCase}
                  </p>
               </section>

               {/* 3. How it works */}
               <section className="space-y-6">
                  <h2 className="text-white font-bold text-2xl tracking-tight">How it works</h2>
                  <div className="space-y-4">
                     {currentLesson.keyPoints.map((point, i) => (
                       <div key={i} className="flex items-start gap-4">
                          <CheckCircle2 size={20} className="text-[#00A86B] mt-0.5 shrink-0" />
                          <span className="text-lg text-[#A0A0A0] font-light leading-snug">{point}</span>
                       </div>
                     ))}
                  </div>
               </section>

               {/* 4. Code Example */}
               <section className="space-y-6">
                  <h2 className="text-white font-bold text-2xl tracking-tight">Code implementation</h2>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                     <div className="px-6 py-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">source</span>
                     </div>
                     <pre className="p-8 text-sm sm:text-base leading-relaxed overflow-x-auto font-mono text-[#D4D4D4]">
                        <code>{currentLesson.codeExample}</code>
                     </pre>
                  </div>
               </section>

               {/* 5. Output */}
               <section className="space-y-6">
                  <h2 className="text-white font-bold text-2xl tracking-tight text-white/40 uppercase text-xs tracking-widest">Expected output</h2>
                  <div className="bg-black border border-white/5 rounded-xl p-8 font-mono text-sm text-[#00A86B] shadow-inner">
                     <code className="block whitespace-pre-wrap">{currentLesson.expectedOutput}</code>
                  </div>
               </section>

               {/* 6. Try it yourself */}
               <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 md:p-14 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-[#00A86B] flex items-center justify-center">
                        <FileText size={20} className="text-black" />
                     </div>
                     <h3 className="text-2xl font-bold text-white tracking-tight italic">Try it yourself</h3>
                  </div>
                  <p className="text-[#D4D4D4] text-lg font-light leading-relaxed">
                     {currentLesson.practiceTask}
                  </p>
                  <Button className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-14 font-black uppercase text-xs tracking-widest transition-transform active:scale-95 shadow-xl">
                     Submit Solution
                  </Button>
               </section>

               {/* Sequential Navigation */}
               <footer className="pt-20 flex items-center justify-between border-t border-white/5">
                  {prevLesson ? (
                    <Link href={`/${params.locale}/learn/${course.slug}/${prevLesson.moduleSlug}/${prevLesson.slug}`}>
                      <button className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Previous Lesson</span>
                      </button>
                    </Link>
                  ) : <div />}

                  {nextLesson ? (
                    <Link href={`/${params.locale}/learn/${course.slug}/${nextLesson.moduleSlug}/${nextLesson.slug}`}>
                      <button className="flex items-center gap-4 bg-[#00A86B] text-black h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-[#00A86B]/20 transition-all hover:scale-[1.02] active:scale-95 group">
                        Next Lesson
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/${params.locale}/courses/${course.slug}/assessment`}>
                      <button className="flex items-center gap-4 bg-white text-black h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-95 group">
                        Start Final Assessment
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  )}
               </footer>
            </motion.div>
         </div>
      </main>
    </div>
  );
}
