"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { courses } from "@/lib/data/courses";
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  PlayCircle,
  ChevronDown,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { enrollInCourse } from "@/lib/actions/enrollment";
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CertificatePreview } from "@/components/marketing/CertificatePreview";
import { getAbsoluteUrl } from "@/lib/subdomains";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CourseDetailsPage() {
  const params = useParams();
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [openModule, setOpenModule] = useState<string | null>(course.modules[0]?.id || null);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const locale = params.locale as string;
      const firstLesson = `/${locale}/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`;
      await enrollInCourse(course.id, firstLesson);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#020202] min-h-screen text-white pt-32 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center">
           <span 
             className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs font-mono tracking-widest uppercase flex items-center gap-2" 
             onClick={() => window.history.back()}
           >
             &larr; Back to Catalog
           </span>
        </div>

        {/* ================= SECTION 1: DYNAMIC HERO LAYOUT ================= */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#C0F0FB]/10 rounded-full text-[9px] font-mono font-bold uppercase text-[#C0F0FB] border border-[#C0F0FB]/20">
              {course.difficulty}
            </span>
            <span className="text-zinc-500 text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-2">
               <Clock size={12} className="text-[#C0F0FB]" /> {course.duration}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-none text-white">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* ================= SECTION 2: DYNAMIC OUTCOMES BLUEPRINT GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-3 h-full">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">01 // TARGET ROLE</span>
            <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{course.become || "Master Specialist"}</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-3 h-full">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">02 // CORE RESOLUTION</span>
            <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{course.problemSolved || "Deep domain automation integration."}</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-3 h-full">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">03 // CAPSTONE PROJECT</span>
            <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{course.willBuild || "Production level enterprise module build."}</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 space-y-3 h-full">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">04 // TARGET AUDIENCE</span>
            <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{course.forWho || "Senior engineers & team leads."}</p>
          </div>
        </div>

        {/* ================= SECTION 3: SPLIT BODY CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8">
          
          {/* Left Column: Interactive Curriculum Tree & Capstone */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <h2 className="text-white font-serif font-bold text-2xl mb-8 flex items-center gap-3">
                <PlayCircle className="text-[#C0F0FB]" /> Detailed Curriculum
              </h2>

              <div className="space-y-4">
                {course.modules.map((module, mIdx) => (
                  <div 
                    key={module.id} 
                    className="bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden hover:border-zinc-700/50 transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenModule(openModule === module.id ? null : module.id)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-zinc-900/10 transition-colors group"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#C0F0FB] tracking-widest block">MODULE 0{mIdx + 1}</span>
                        <span className="text-base font-serif font-bold text-zinc-300 group-hover:text-[#C0F0FB] transition-colors">
                          {module.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "text-zinc-500 transition-transform group-hover:text-white",
                          openModule === module.id && "rotate-180 text-white"
                        )}
                        size={18}
                      />
                    </button>
                    
                    {openModule === module.id && (
                      <div className="p-6 bg-[#040404] border-t border-white/5 space-y-6 animate-fade-in">
                        <p className="text-sm text-zinc-400 leading-relaxed font-sans font-light">
                          {module.description}
                        </p>
                        
                        <div className="space-y-2 border-t border-white/5 pt-4">
                          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mb-3">CURRICULUM LESSONS</span>
                          {module.lessons.map((lesson, lIdx) => (
                            <div 
                              key={lesson.id} 
                              className="flex items-center justify-between p-4 bg-black/40 rounded-none border border-white/5 group hover:border-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-zinc-600 font-mono text-xs">0{lIdx + 1}</span>
                                <span className="text-zinc-300 group-hover:text-white transition-colors font-medium text-sm">{lesson.title}</span>
                              </div>
                              <CheckCircle2 size={16} className="text-[#C0F0FB]/20 group-hover:text-[#C0F0FB] transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Evaluation Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-none p-10 md:p-14 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-none bg-[#C0F0FB] flex items-center justify-center">
                      <Award className="text-black" size={24} />
                   </div>
                   <h2 className="text-white font-serif font-bold text-3xl tracking-tight">Capstone Evaluation</h2>
                </div>
                <h3 className="text-white font-serif font-bold text-xl italic">"{course.finalProject.title}"</h3>
                <p className="text-zinc-400 leading-relaxed font-light text-sm md:text-base">
                  {course.finalProject.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  {course.finalProject.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                       <CheckCircle2 size={16} className="text-[#C0F0FB] shrink-0" /> {req}
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* Right Column: Checkout Details & Certificate Preview */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              {/* Enrollment card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-none p-8 space-y-6">
                 <div className="relative aspect-video rounded-none overflow-hidden border border-zinc-900">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <PlayCircle size={48} className="text-white/80 hover:text-white cursor-pointer transition-all" />
                    </div>
                 </div>

                 <div className="space-y-4 border-t border-zinc-900 pt-4">
                    <div className="flex items-center justify-between text-xs py-1.5">
                       <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Modules</span>
                       <span className="text-white font-bold text-xs">{course.modules.length} Full Sections</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5">
                       <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Assessment</span>
                       <span className="text-white font-bold text-xs">Standardized Evaluation</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5">
                       <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Validation</span>
                       <span className="text-white font-bold text-xs flex items-center gap-1.5">
                          Verifiable <ShieldCheck size={14} className="text-[#C0F0FB]" />
                       </span>
                    </div>
                 </div>

                 <Button 
                   onClick={handleEnroll}
                   isLoading={isLoading}
                   className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 hover:text-[#C0F0FB] transition-all rounded-none text-xs uppercase tracking-widest"
                 >
                   Enroll In Course <ChevronRight size={14} className="ml-1.5" />
                 </Button>
              </div>

              {/* Certificate Preview Card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-none p-6 text-center space-y-6">
                <div className="w-full flex items-center justify-between">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">CREDENTIAL ENGINE</span>
                  <span className="text-[9px] text-[#C0F0FB] font-mono uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    VERIFIED
                  </span>
                </div>

                <div className="w-full transform hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
                  <CertificatePreview />
                </div>

                <p className="text-[10px] text-zinc-500 leading-relaxed font-sans max-w-[260px] mx-auto">
                  Every graduate is issued a cryptographically verifiable certificate of mastership tied directly to the GrowX Trust Protocol.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
