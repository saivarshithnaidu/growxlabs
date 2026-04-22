"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { courses } from "@/lib/data/courses";
import { CheckCircle2, Clock, Award, ShieldCheck, ChevronRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

import { useState } from "react";
import { enrollInCourse } from "@/lib/actions/enrollment";

export default function CourseDetailsPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const course = courses.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const firstLesson = `/learn/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`;
      await enrollInCourse(course.id, firstLesson);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back */}
        <div className="mb-12">
           <span className="text-[#A0A0A0] text-sm hover:text-white transition-colors cursor-pointer" onClick={() => window.history.back()}>
             &larr; Back to Catalog
           </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Info & Curriculum */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#00A86B]/10 rounded-full text-[10px] font-bold uppercase text-[#00A86B] border border-[#00A86B]/20">
                  {course.difficulty}
                </span>
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                   <Clock size={12} /> {course.duration}
                </span>
              </div>
              <h1 className="text-white font-bold text-5xl md:text-6xl tracking-tighter leading-tight mb-8">
                {course.title}
              </h1>
              <p className="text-[#A0A0A0] text-xl font-light leading-relaxed mb-12">
                {course.description}
              </p>
            </motion.div>

            {/* Curriculum Sections */}
            <div className="space-y-4 mb-20">
              <h2 className="text-white font-bold text-2xl mb-8 flex items-center gap-3">
                <PlayCircle className="text-[#00A86B]" /> Detailed Curriculum
              </h2>
              {course.modules.map((module, mIdx) => (
                <div key={module.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-[0.2em] block mb-2">Module 0{mIdx + 1}</span>
                        <h3 className="text-white font-bold text-xl">{module.title}</h3>
                        <p className="text-[#A0A0A0] text-sm mt-1">{module.description}</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                      {module.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <span className="text-white/20 font-black text-xs">0{lIdx + 1}</span>
                              <span className="text-[#A0A0A0] group-hover:text-white transition-colors font-medium text-sm">{lesson.title}</span>
                           </div>
                           <CheckCircle2 size={16} className="text-white/5" />
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>

            {/* Final Project Details */}
            <div className="bg-[#00A86B]/5 border border-[#00A86B]/20 rounded-[40px] p-10 md:p-14">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#00A86B] flex items-center justify-center">
                      <Award className="text-white" size={24} />
                   </div>
                   <h2 className="text-white font-bold text-3xl tracking-tight">Capstone Evaluation</h2>
                </div>
                <h3 className="text-white font-bold text-xl mb-4 italic">"{course.finalProject.title}"</h3>
                <p className="text-[#A0A0A0] leading-relaxed mb-8">
                  {course.finalProject.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.finalProject.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                       <CheckCircle2 size={16} className="text-[#00A86B]" /> {req}
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* Right Column: Enrollment Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 backdrop-blur-xl">
                 <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-white/5">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <PlayCircle size={64} className="text-white/80 hover:text-white cursor-pointer transition-all" />
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                       <span className="text-[#A0A0A0]">Modules</span>
                       <span className="text-white font-bold">{course.modules.length} Full Sections</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                       <span className="text-[#A0A0A0]">Assessment</span>
                       <span className="text-white font-bold">Standardized Test</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                       <span className="text-[#A0A0A0]">Validation</span>
                        <span className="text-white font-bold flex items-center gap-2">
                           Verifiable <ShieldCheck size={14} className="text-[#00A86B]" />
                        </span>
                    </div>
                 </div>

                 <Button 
                   onClick={handleEnroll}
                   isLoading={isLoading}
                   className="w-full bg-[#00A86B] hover:bg-[#00A86B]/90 text-white rounded-[20px] h-16 font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00A86B]/10"
                 >
                   Enroll In Course <ChevronRight size={18} className="ml-2" />
                 </Button>

                 <p className="text-center text-[10px] uppercase font-bold tracking-widest text-[#A0A0A0] mt-6">
                   Secure Institutional Credentialing
                 </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
