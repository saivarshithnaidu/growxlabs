"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, User, BookOpen, Calendar, Award, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Simulation of a verified certificate lookup
const MOCK_CERTIFICATES: Record<string, any> = {
  "GXL-JAVA-2026-00023": {
    name: "Aarav Sharma",
    course: "Java Mastery: From Core to Microservices",
    grade: "A",
    date: "April 22, 2026",
    status: "VALID"
  },
  "GXL-NEXTJS-2026-00142": {
    name: "Sarah Miller",
    course: "Next.js 15: Production-Ready Full Stack",
    grade: "B+",
    date: "March 15, 2026",
    status: "VALID"
  }
};

export default function VerificationPage() {
  const params = useParams();
  const certId = params.id as string;
  const cert = MOCK_CERTIFICATES[certId];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        
        {/* Certificate Verification Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-black border border-white/10 rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative"
        >
           {/* Header Area */}
           <div className={`p-8 lg:p-10 ${cert ? "bg-[#00A86B]" : "bg-red-500"} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-white" size={24} />
                 <span className="text-white font-black uppercase text-xs tracking-widest">GrowX Credential Registry</span>
              </div>
              <span className="text-white/60 font-mono text-[10px]">{certId}</span>
           </div>

           <div className="p-10 lg:p-14 space-y-12">
              {cert ? (
                <>
                  <div className="text-center space-y-4">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00A86B]/10 text-[#00A86B] rounded-full border border-[#00A86B]/20 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Status: {cert.status}
                     </div>
                     <h1 className="text-4xl font-black text-white italic tracking-tighter">Verified Graduate.</h1>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                           <User size={20} className="text-white/40" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Credential Participant</p>
                           <p className="text-xl font-bold text-white text-glow">{cert.name}</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                           <BookOpen size={20} className="text-white/40" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Authenticated Course</p>
                           <p className="text-xl font-bold text-white leading-tight">{cert.course}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8 pt-4">
                        <div className="flex items-start gap-6">
                           <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                              <Award size={20} className="text-white/40" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Grade</p>
                              <p className="text-xl font-bold text-[#00A86B]">{cert.grade}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-6">
                           <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                              <Calendar size={20} className="text-white/40" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Issue Date</p>
                              <p className="text-xl font-bold text-white">{cert.date}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 flex flex-col gap-4">
                     <Button className="w-full h-16 bg-white text-black hover:bg-neutral-200 rounded-3xl font-black uppercase text-xs tracking-widest">
                        Download Master PDF <FileCheck size={18} className="ml-3" />
                     </Button>
                     <p className="text-[10px] text-center text-white/20 font-medium uppercase tracking-[0.3em]">Institutional Verification Completed</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 space-y-8">
                   <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                      <XCircle size={40} className="text-red-500" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-3xl font-black text-white italic tracking-tighter">Credential Not Found.</h2>
                      <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-xs mx-auto">
                        The provided Certificate ID is invalid or has been revoked. If you believe this is an error, please contact GrowX Labs Support.
                      </p>
                   </div>
                   <Link href="/courses">
                      <Button variant="outline" className="h-12 px-8 border-white/10 text-white rounded-xl">Back to Courses</Button>
                   </Link>
                </div>
              )}
           </div>
        </motion.div>

        {/* Footer Trust */}
        <div className="mt-12 text-center opacity-20">
           <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-4">GrowX Labs Secure Registry</p>
           <div className="flex justify-center gap-8 grayscale">
              <span className="text-xl font-black italic text-white tracking-tighter">GXL</span>
              <span className="text-xl font-black italic text-white tracking-tighter">VERIFIED</span>
           </div>
        </div>

      </div>
    </div>
  );
}

function XCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
