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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Course Library</h1>
          <p className="text-white/40 font-medium">Curate and manage your high-performance curriculum.</p>
        </div>
        <Link href="/admin/academy/courses/new">
          <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 h-11 font-medium rounded-md flex items-center gap-2">
            <Plus size={18} />
            Build New Course
          </Button>
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search core courses or slugs..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-white/20 outline-none transition-all placeholder:text-white/40"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
           <button className="px-4 py-2 bg-white/10 text-white text-xs font-medium rounded-lg">All Tracks</button>
           <button className="px-4 py-2 text-white/40 text-xs font-medium hover:text-white transition-all">Published</button>
           <button className="px-4 py-2 text-white/40 text-xs font-medium hover:text-white transition-all">Drafts</button>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {courses?.map((course) => (
          <div key={course.id} className="group bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.04] transition-all duration-300 gap-4">
            <div className="flex items-center gap-6">
              {/* Thumbnail */}
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                {course.image_url ? (
                   <Image src={course.image_url} alt={course.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-300" />
                ) : (
                   <BookOpen size={24} className="text-white/20" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                 <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{course.title}</h3>
                    <span className="px-2 py-0.5 bg-white/10 text-white/80 text-[10px] font-medium uppercase tracking-wider rounded-md border border-white/10">
                      {course.difficulty}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                    <div className="flex items-center gap-1.5">
                       <Clock size={14} className="text-white/20" />
                       {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Layers size={14} className="text-white/20" />
                       12 Modules
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Tag size={14} className="text-white/20" />
                       ID: {course.id.slice(0, 8)}
                    </div>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
               <Link href={`/admin/academy/courses/edit/${course.id}`}>
                 <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/40 hover:text-white hover:bg-white/10">
                    <Edit3 size={16} />
                 </Button>
               </Link>
               <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/40 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 size={16} />
               </Button>
               <div className="h-6 w-[1px] bg-white/10 mx-2" />
               <Link href={`/courses/${course.slug}`}>
                 <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-medium text-white/80 border-white/10 hover:bg-white/10 hover:text-white flex items-center gap-2">
                    <ExternalLink size={14} /> 
                    Preview
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
