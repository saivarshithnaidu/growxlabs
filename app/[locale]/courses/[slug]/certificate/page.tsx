"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Download, ShieldCheck, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CourseData {
  title: string;
  slug: string;
}

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number, grade: string } | null>(null);
  const [issueDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  });

  // Mock certificate ID
  const certId = `GXL-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${new Date().getFullYear()}`;

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${params.slug}`);
        if (res.status === 401) {
          router.push(`/${params.locale}/login`);
          return;
        }
        if (res.status === 404) {
          setError("not_found");
          return;
        }
        if (!res.ok) {
          setError("Failed to load certificate");
          return;
        }
        const data = await res.json();
        setCourse({
          title: data.title,
          slug: data.slug,
        });

        const savedResult = localStorage.getItem(`result_${data.slug}`);
        if (savedResult) {
          setResult(JSON.parse(savedResult));
        }
      } catch (e) {
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [params.slug, params.locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00A86B] animate-spin" />
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error === "not_found" || !course || !result || result.grade === 'F') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
         <h1 className="text-2xl font-bold mb-4">Certificate Not Available</h1>
         <p className="text-[#A0A0A0]">You must pass the assessment to view your certificate.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-4 overflow-hidden relative selection:bg-[#00A86B]/30">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A86B]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden gap-4">
            <div>
               <h1 className="text-2xl font-bold">Credential Issued</h1>
               <p className="text-[#A0A0A0] text-sm">Your technical competency has been verified.</p>
            </div>
            <Button 
               onClick={handlePrint}
               className="bg-[#00A86B] text-black hover:bg-[#00A86B]/90 font-black uppercase text-xs tracking-widest px-8 rounded-xl h-12 shadow-[0_0_20px_rgba(0,168,107,0.2)]"
            >
               <Download size={16} className="mr-2" /> Download PDF
            </Button>
         </div>

         {/* The Certificate UI (Print Target) */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           ref={printRef}
           className="w-full aspect-[1.414/1] md:aspect-[1.6/1] bg-black border border-white/10 rounded-sm shadow-2xl relative overflow-hidden group print:m-0 print:border-none print:shadow-none print:w-full"
         >
            {/* Border Accents */}
            <div className="absolute inset-2 border border-[#00A86B]/20 rounded-sm pointer-events-none" />
            <div className="absolute inset-4 border border-white/5 rounded-sm pointer-events-none" />
            
            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#00A86B]" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#00A86B]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#00A86B]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#00A86B]" />

            {/* Glowing Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60%] bg-gradient-to-r from-transparent via-[#00A86B]/5 to-transparent skew-y-[-15deg] pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16">
               
               {/* Brand Header */}
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-10 h-10 border-2 border-[#00A86B] rounded-sm transform rotate-45 flex items-center justify-center">
                     <div className="w-4 h-4 bg-[#00A86B] rounded-sm" />
                  </div>
                  <span className="text-2xl font-black tracking-[0.3em] uppercase text-white">
                     GrowX<span className="text-[#00A86B] ml-2">Labs</span>
                  </span>
               </div>

               {/* Title */}
               <div className="space-y-4 mb-12">
                  <div className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-white/50">
                     Certificate of Technical Proficiency
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#A0A0A0] uppercase tracking-tight">
                     Verified Engineer
                  </h2>
               </div>

               {/* Recipient Area (Mocked User) */}
               <div className="mb-12 border-b border-white/10 pb-4 inline-block px-12">
                  <p className="text-[#00A86B] font-mono text-xs uppercase tracking-widest mb-4">This acknowledges that</p>
                  <h3 className="text-3xl md:text-4xl font-light text-white tracking-wide font-serif italic">
                     Student Developer
                  </h3>
               </div>

               {/* Verification Reason */}
               <div className="max-w-2xl px-6 mb-16">
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                     Has successfully completed the final rigorous evaluation for <strong className="text-white">{course.title}</strong>, demonstrating a technical proficiency rating of <strong className="text-[#00A86B]">{result.score}%</strong>. This individual possesses validated structural logic and engineering mechanics required for production systems.
                  </p>
               </div>

               {/* Footer Details */}
               <div className="w-full flex justify-between items-end mt-auto px-8 md:px-16 pb-8 border-t border-white/5 pt-8">
                  {/* Left Signature */}
                  <div className="text-left space-y-2">
                     <div className="text-[#00A86B] font-mono text-xs tracking-widest uppercase">Issue Date</div>
                     <div className="text-white font-bold">{issueDate}</div>
                  </div>

                  {/* Center Emblem */}
                  <div className="flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-[#00A86B]/10 rounded-full border border-[#00A86B]/30 flex items-center justify-center mb-2">
                        <CheckCircle2 size={32} className="text-[#00A86B]" />
                     </div>
                     <div className="text-[8px] uppercase tracking-[0.3em] text-[#00A86B] font-bold">Passed Eval</div>
                  </div>

                  {/* Right ID */}
                  <div className="text-right space-y-2 flex flex-col items-end">
                     <QrCode size={24} className="text-white/40 mb-1" />
                     <div className="text-[#00A86B] font-mono text-[10px] tracking-widest uppercase">Verification ID</div>
                     <div className="text-white font-mono text-xs">{certId}</div>
                  </div>
               </div>

            </div>
         </motion.div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Hide everything except certificate */
          body > *:not(.print-container) {
            display: none !important;
          }
          /* This approach handles full page printing if wrapper logic allows it, but standard Tailwind print works too */
        }
      `}</style>
    </div>
  );
}
