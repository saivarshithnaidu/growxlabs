import { createClient } from "@/lib/supabase/server";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Layers, 
  Clock, 
  Tag, 
  Edit3, 
  Trash2,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";

export default async function CourseManagement() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Course Library.</h1>
          <p className="text-white/40 font-medium">Curate and manage your high-performance curriculum.</p>
        </div>
        <Link href="/admin/academy/courses/new">
          <Button className="bg-primary text-black font-black h-14 px-8 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-primary/10">
            <Plus size={20} strokeWidth={3} />
            BUILD NEW COURSE
          </Button>
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search core courses or slugs..." 
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-sm text-white focus:border-primary/40 focus:bg-primary/[0.02] outline-none transition-all placeholder:text-white/10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-[#0A0A0A] border border-white/5 rounded-2xl">
           <button className="px-6 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">All Tracks</button>
           <button className="px-6 py-4 text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Published</button>
           <button className="px-6 py-4 text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Drafts</button>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {courses?.map((course) => (
          <div key={course.id} className="group bg-[#0A0A0A] border border-white/10 p-4 pl-6 rounded-[32px] flex items-center justify-between hover:border-primary/30 transition-all duration-500">
            <div className="flex items-center gap-8">
              {/* Thumbnail */}
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center">
                {course.image_url ? (
                   <Image src={course.image_url} alt={course.title} fill className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                ) : (
                   <BookOpen size={24} className="text-white/10 group-hover:text-primary transition-colors" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">{course.title}</h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                      {course.difficulty}
                    </span>
                 </div>
                 <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-primary/40" />
                       {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                       <Layers size={12} className="text-primary/40" />
                       12 Modules
                    </div>
                    <div className="flex items-center gap-2">
                       <Tag size={12} className="text-primary/40" />
                       ID: {course.id}
                    </div>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pr-4">
               <Link href={`/admin/academy/courses/edit/${course.id}`}>
                 <button className="p-4 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all group-hover:bg-primary/5 group-hover:text-primary">
                    <Edit3 size={18} />
                 </button>
               </Link>
               <button className="p-4 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all">
                  <Trash2 size={18} />
               </button>
               <div className="h-10 w-[1px] bg-white/5 mx-2" />
               <Link href={`/courses/${course.slug}`}>
                 <Button variant="ghost" size="lg" className="h-14 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-white/20 hover:text-white group-hover:text-white/60">
                    <ExternalLink className="mr-2" size={14} /> 
                    Live Preview
                 </Button>
               </Link>
            </div>
          </div>
        ))}

        {!courses?.length && (
           <div className="py-24 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                 <BookOpen className="text-white/10" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Courses Initialized</h3>
              <p className="text-white/20 text-sm max-w-xs">Start your academy by engineering your first learning track.</p>
           </div>
        )}
      </div>
    </div>
  );
}
