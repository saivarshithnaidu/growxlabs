"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Plus, LayoutGrid, List, MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

// Active Production Cycles Data
const mockProjects = [
  { id: 1, title: "Next-Gen Fintech UI", client: "Goldman Sachs", status: "In Progress", progress: 65, category: "UI/UX" },
  { id: 2, title: "Warehouse AI Sync", client: "Amazon", status: "Active", progress: 30, category: "Automation" },
  { id: 3, title: "E-Commerce Pipeline", client: "Nike", status: "Completed", progress: 100, category: "Web Engineering" },
  { id: 4, title: "Global Logi Portal", client: "FedEx", status: "Testing", progress: 85, category: "Enterprise" },
];

export default function ProjectsDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  if (!role) return null;

  const isAdmin = role === "Admin" || role === "Co-Admin";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Production Cycles.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Real-time tracking of engineering sprints and automation deployments.
          </p>
        </div>
        {isAdmin && (
          <Button className="h-14 px-8 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 transition-all">
            <Plus className="mr-2 h-5 w-5" /> Initialize Cycle
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-10 glass border-white/5 rounded-[2rem] flex flex-col lg:flex-row lg:items-center justify-between gap-10 group hover:border-white/20 transition-all">
              <div className="space-y-3">
                 <div className="flex items-center space-x-3 mb-2">
                   <span className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/5">
                     {project.category}
                   </span>
                 </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{project.title}</h3>
                <p className="text-white/40 font-medium text-sm flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  {isAdmin ? project.client : "Proprietary Project"}
                </p>
              </div>
              
              <div className="flex-1 max-w-lg space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} className="mr-2" /> Current Progress
                  </div>
                  <span className="text-white font-black text-lg">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white transition-all duration-500" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  project.status === 'Completed' ? 'bg-white text-black' : 'bg-white/10 text-white/60'
                }`}>
                  {project.status}
                </div>
                <button className="text-white/20 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
