"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, Award, RefreshCcw, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CourseData {
  title: string;
  slug: string;
}

export default function AssessmentResultPage() {
  const params = useParams();
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number, grade: string } | null>(null);

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
          setError("Failed to load result");
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
        setError("Failed to load result");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [params.slug, params.locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#00A86B] animate-spin" />
      </div>
    );
  }

  if (error === "not_found" || !course || !result) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
         <h1 className="text-2xl font-bold mb-4">No Assessment Found</h1>
         <p className="text-[#A0A0A0] mb-8">It seems you haven't completed the assessment yet.</p>
         <Link href={`/${params.locale}/courses/${params.slug}/assessment`}>
           <Button className="bg-[#00A86B] text-black hover:bg-[#00A86B]/90">
             Take Assessment
           </Button>
         </Link>
      </div>
    );
  }

  const { score, grade } = result;
  const isFail = grade === 'F';
  const isLowPass = grade === 'D';

  const handleRetake = () => {
    localStorage.removeItem(`result_${course.slug}`);
    localStorage.removeItem(`assessment_${course.slug}`);
    router.push(`/${params.locale}/courses/${course.slug}/assessment`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-20 px-6">
      <div className="max-w-xl mx-auto w-full relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 p-10 md:p-14 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden"
        >
           {/* Decorative Blur */}
           <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-20 pointer-events-none ${isFail ? 'bg-red-500' : 'bg-[#00A86B]'}`} />

           <div className="text-center space-y-4 mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-2">
                 {isFail ? (
                   <XCircle size={40} className="text-red-500" />
                 ) : (
                   <CheckCircle2 size={40} className="text-[#00A86B]" />
                 )}
              </div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                 Evaluation Result
              </h1>
              <h2 className="text-3xl font-black text-white tracking-tight">
                 {isFail ? "Assessment Failed" : "Assessment Passed"}
              </h2>
           </div>

           {/* Stats Ribbon */}
           <div className="grid grid-cols-2 gap-4 mb-12 relative z-10">
              <div className="bg-black border border-white/5 rounded-2xl p-6 text-center">
                 <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Final Score</div>
                 <div className={`text-4xl font-black ${isFail ? 'text-red-500' : 'text-[#00A86B]'}`}>
                    {score}%
                 </div>
              </div>
              <div className="bg-black border border-white/5 rounded-2xl p-6 text-center">
                 <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Performance Grade</div>
                 <div className="text-4xl font-black text-white">
                    {grade}
                 </div>
              </div>
           </div>

           {/* Status Message */}
           <div className="mb-12 text-center space-y-2 relative z-10 px-4">
              {isFail ? (
                <>
                  <div className="text-red-500 font-bold uppercase text-xs tracking-widest mb-4">Status: Failed</div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed">
                    You did not meet the minimum passing criteria (50%). Certification requires a full understanding of the curriculum. Please review the course material and attempt the evaluation again.
                  </p>
                </>
              ) : isLowPass ? (
                <>
                  <div className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-4">Status: Passed (Low)</div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed">
                    You have passed the assessment, but your performance places you in a lower percentile. You are eligible for certification, but we recommend further review.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-[#00A86B] font-bold uppercase text-xs tracking-widest mb-4">Status: Passed (Excellent)</div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed">
                    Congratulations. You have successfully demonstrated technical mastery of this module. You are now authorized to generate your institutional credential.
                  </p>
                </>
              )}
           </div>

           {/* Actions */}
           <div className="relative z-10 space-y-4">
              {isFail ? (
                 <Button 
                   onClick={handleRetake}
                   className="w-full h-16 bg-white text-black hover:bg-white/90 font-black uppercase text-xs tracking-widest rounded-2xl"
                 >
                    <RefreshCcw size={16} className="mr-2" /> Retake Test
                 </Button>
              ) : (
                 <div className="space-y-3">
                   <Link href={`/${params.locale}/courses/${course.slug}/certificate`} className="block">
                      <Button className="w-full h-16 bg-transparent border-2 border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 font-black uppercase text-xs tracking-widest rounded-2xl transition-colors">
                         <ShieldCheck size={18} className="mr-2" /> View Certificate
                      </Button>
                   </Link>
                   <Link href={`/${params.locale}/project/${course.slug}`} className="block">
                      <Button className="w-full h-16 bg-[#00A86B] text-black hover:bg-[#00A86B]/90 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-[#00A86B]/20">
                         <Award size={18} className="mr-2" /> Proceed to Project Phase
                      </Button>
                   </Link>
                 </div>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/20 pt-6">
                 <ShieldCheck size={14} /> Certified by GrowX Engineering
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
