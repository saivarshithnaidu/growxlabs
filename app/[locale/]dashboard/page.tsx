"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  BarChart, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { courses } from "@/lib/data/courses";

export default function DashboardPage() {
  // Simulation: Enrolled courses and progress
  const enrolledCourses = [
    { ...courses[0], progress: 65, lastLesson: "The Power of Polymorphism" },
    { ...courses[1], progress: 20, lastLesson: "React Server Components" }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-2">
              <div className="flex items-center gap-3 text-[#00A86B] font-black uppercase text-[10px] tracking-widest mb-4">
                 <LayoutDashboard size={14} /> Global Control Center
              </div>
              <h1 className="text-white font-bold text-5xl tracking-tighter italic leading-none">Your Trajectory.</h1>
              <p className="text-[#A0A0A0] text-lg font-light">Credentializing your career in the AI-native era.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-3xl text-center min-w-[140px]">
                 <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Active Courses</p>
                 <p className="text-2xl font-black text-white">{enrolledCourses.length}</p>
              </div>
              <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-3xl text-center min-w-[140px]">
                 <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Certificates</p>
                 <p className="text-2xl font-black text-[#00A86B]">0</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Primary: Progress Tracking */}
           <div className="lg:col-span-8 space-y-8">
              <h2 className="text-white font-bold text-xl flex items-center gap-3 mb-6">
                 <TrendingUp size={20} className="text-[#00A86B]" /> Current Performance
              </h2>

              <div className="space-y-6">
                 {enrolledCourses.map((course, idx) => (
                   <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 lg:p-10 hover:bg-white/[0.03] transition-all group"
                   >
                      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                         <div className="relative w-full md:w-48 aspect-video rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                            <Image src={course.image} alt={course.title} fill className="object-cover" />
                         </div>
                         <div className="flex-1 space-y-6">
                            <div>
                               <h3 className="text-xl font-bold text-white mb-2 leading-tight">{course.title}</h3>
                               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">
                                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#00A86B]" /> 25% Time Remaining</span>
                                  <span className="flex items-center gap-1.5"><PlayCircle size={12} className="text-[#00A86B]" /> Next: {course.lastLesson}</span>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                  <span className="text-white">Course Integrity</span>
                                  <span className="text-[#00A86B]">{course.progress}% Validated</span>
                               </div>
                               <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-[#00A86B] to-[#00A86B]/40" 
                                  />
                               </div>
                            </div>
                         </div>
                         <div className="hidden md:block">
                            <Link href={`/learn/${course.slug}/core-foundations/jvm-basics`}>
                               <Button className="h-16 w-16 rounded-3xl bg-white text-black hover:bg-[#00A86B] hover:text-white transition-all shadow-none">
                                  <ChevronRight size={24} />
                               </Button>
                            </Link>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>

              {/* Course Catalog Link */}
              <div className="pt-8">
                 <Link href="/courses">
                    <div className="border border-dashed border-white/10 rounded-[40px] p-10 flex flex-col items-center justify-center gap-4 hover:border-[#00A86B]/30 hover:bg-[#00A86B]/5 transition-all text-center group">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="text-white/20 group-hover:text-[#00A86B]" />
                       </div>
                       <div>
                          <p className="text-white font-bold">Enroll in New Mastery Tier</p>
                          <p className="text-white/40 text-xs">Architect your skills across our ecosystem</p>
                       </div>
                    </div>
                 </Link>
              </div>
           </div>

           {/* Sidebar: Status & Certificates */}
           <div className="lg:col-span-4 space-y-8">
              <div>
                 <h2 className="text-white font-bold text-xl flex items-center gap-3 mb-6">
                    <Award size={20} className="text-[#00A86B]" /> Validated Credentials
                 </h2>
                 <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-center">
                    <div className="mb-8">
                       <ShieldCheck className="text-white/10 mx-auto" size={80} />
                       <p className="text-[#A0A0A0] text-sm mt-4 font-light">No certificates issued yet. <br /> Complete an assessment to qualify.</p>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 text-white/40 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest disabled:opacity-50" disabled>
                      View Cert Registry
                    </Button>
                 </div>
              </div>

              <div>
                 <h2 className="text-white font-bold text-xl flex items-center gap-3 mb-6">
                    <BarChart size={20} className="text-[#00A86B]" /> Verification Metrics
                 </h2>
                 <div className="bg-[#00A86B]/5 border border-[#00A86B]/10 rounded-[40px] p-8 space-y-6">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Skill Multiplier</span>
                          <span className="text-[#00A86B] font-bold">2.4x</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-[24%] bg-[#00A86B]" />
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[10px] font-bold text-white/30 italic">Career trajectory based on completed curriculum units and validation scores.</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
