import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { getAbsoluteUrl } from "@/lib/subdomains";
import { 
  BookOpen, 
  PlayCircle, 
  Award, 
  ChevronRight, 
  Clock, 
  BarChart2,
  Lock,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const hostHeader = (await headers()).get("host") || "";
  const coursesUrl = getAbsoluteUrl("/courses", hostHeader);

  if (!session) {
    redirect("/login");
  }

  // Fetch student specific data
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("user_id", session.user.id);

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", session.user.id);

  const { data: progress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", session.user.id);

  const completedLessons = progress?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
               Student Portal
             </span>
             <span className="text-white/20 text-xs font-medium">Session ID: {session.user.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none">
            Welcome back, <br/>
            <span className="text-primary italic">{session.user.email?.split('@')[0]}</span>
          </h1>
        </div>
        
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[32px] flex items-center gap-8 px-10">
           <div className="text-center">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">XP Points</p>
              <h4 className="text-2xl font-black text-white italic">{completedLessons * 150}</h4>
           </div>
           <div className="h-10 w-[1px] bg-white/5" />
           <div className="text-center">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Pass Rate</p>
              <h4 className="text-2xl font-black text-white italic">--</h4>
           </div>
           <div className="h-10 w-[1px] bg-white/5" />
           <div className="text-center">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Certificates</p>
              <h4 className="text-2xl font-black text-white italic">{certificates?.length || 0}</h4>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Course Progress Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight italic">My Learning Tracks.</h2>
              <a href={coursesUrl} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Browse All</a>
           </div>

           <div className="grid grid-cols-1 gap-6">
              {enrollments?.map((enrollment) => (
                <div key={enrollment.id} className="group relative bg-[#0A0A0A] border border-white/10 p-8 rounded-[40px] hover:border-primary/30 transition-all duration-500 overflow-hidden">
                   <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      {/* Course Image */}
                      <div className="relative h-24 w-32 rounded-2xl overflow-hidden bg-white/5 shrink-0">
                         {enrollment.courses.image_url && <Image src={enrollment.courses.image_url} alt="" fill className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="text-white opacity-40 group-hover:opacity-100 transition-opacity" size={32} />
                         </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">{enrollment.courses.title}</h3>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#00A86B] bg-[#00A86B]/10 px-2 py-0.5 rounded-full border border-[#00A86B]/20">Active</span>
                         </div>
                         <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {enrollment.courses.duration}</span>
                            <span className="flex items-center gap-1.5"><BarChart2 size={12} /> {enrollment.courses.difficulty}</span>
                         </div>
                         
                         {/* Progress Bar */}
                         <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                               <span className="text-white/20">Overall Progress</span>
                               <span className="text-primary italic">25%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-primary w-[25%] rounded-full shadow-[0_0_10px_rgba(0,168,107,0.5)]" />
                            </div>
                         </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/learn/${enrollment.course_id}`}>
                        <Button className="bg-white text-black font-black px-8 py-6 h-auto rounded-3xl group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                           CONTINUE LEARNING
                        </Button>
                      </Link>
                   </div>
                </div>
              ))}

              {!enrollments?.length && (
                 <div className="bg-[#0A0A0A] border border-white/5 p-16 rounded-[40px] text-center space-y-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Lock size={24} className="text-white/10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No active enrollments found.</h3>
                    <p className="text-white/20 text-sm max-w-sm mx-auto">Start your engineering journey by enrolling in our expert-led courses.</p>
                    <a href={coursesUrl}>
                       <Button className="bg-[#00A86B] text-white font-bold px-10 h-14 rounded-2xl shadow-none">DISCOVER COURSES</Button>
                    </a>
                 </div>
              )}
           </div>
        </div>

        {/* Sidebar / Profile Section */}
        <div className="space-y-12">
           {/* Achievement / Certificate Card */}
           <div className="bg-primary/5 border border-primary/10 p-10 rounded-[48px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Award size={120} className="text-primary" />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <h4 className="text-xl font-black text-white italic tracking-tight">Certification Center.</h4>
                 <p className="text-white/40 text-sm leading-relaxed">Complete your track, solve the technical matrix, and download your globally verified engineering certificate.</p>
                 
                 <div className="space-y-4">
                    {certificates?.slice(0, 2).map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div className="flex items-center gap-3">
                            <Award className="text-primary" size={16} />
                            <span className="text-[11px] font-bold text-white truncate max-w-[120px]">{cert.id}</span>
                         </div>
                         <button className="text-xs font-black text-primary hover:underline italic">DOWNLOAD</button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-white/10 py-6 h-auto rounded-3xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
                       VIEW ALL BADGES
                    </Button>
                 </div>
              </div>
           </div>

           {/* Quick Actions / Newsletter / Resources */}
           <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] space-y-8">
              <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Laboratory Resources</h4>
              <ul className="space-y-4">
                 {[
                   { name: "Documentation", href: "#" },
                   { name: "Join Discord Community", href: "#" },
                   { name: "Live Workshops", href: "#" },
                   { name: "Career Services", href: "#" }
                 ].map((link, i) => (
                   <li key={i}>
                      <Link href={link.href} className="flex items-center justify-between text-xs font-semibold text-white/40 hover:text-primary transition-all group">
                         {link.name}
                         <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
