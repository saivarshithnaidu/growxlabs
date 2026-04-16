"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Search, UserPlus, Filter, MoreHorizontal, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name?: string;
  email?: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  }
}

export default function ClientsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify active session signature
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else if (storedRole !== "Admin" && storedRole !== "Co-Admin") {
      router.push("/dashboard"); // Only admins can see clients
    } else {
      setRole(storedRole);
      fetchClients();
    }
  }, [router]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/client/list");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setClients(data || []);
    } catch (e) {
      console.error("Fetch Clients Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Client Management.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Architecting permissions and overseeing digital operations for our partners.
          </p>
        </div>
        <div className="flex gap-4">
           <Button 
            variant="outline" 
            onClick={fetchClients}
            className="h-14 w-14 p-0 rounded-2xl border-white/5 text-white/40 hover:text-white"
           >
             <RefreshCcw className={cn("h-5 w-5", loading && "animate-spin")} />
           </Button>
           <Button className="h-14 px-8 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 transition-all">
             <UserPlus className="mr-2 h-5 w-5" /> Onboard Partner
           </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5" />
          <input 
            placeholder="Filter partners by name, email, or vertical..." 
            className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 text-white font-medium focus:outline-none focus:border-white/20 transition-all font-sans"
          />
        </div>
        <Button variant="outline" className="h-16 w-16 p-0 rounded-2xl border-white/5 text-white/40 hover:text-white">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-0 overflow-hidden glass border-white/5 rounded-3xl min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-white/30">Organization / Partner</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-white/30">Email Contact</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-white/30">Status</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-white/30">Start Date</th>
                  <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-white/30 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2 className="animate-spin h-10 w-10 text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 font-light italic">Syncing partner records...</p>
                      </td>
                    </tr>
                  ) : clients.length > 0 ? (
                    clients.map((client) => {
                      const name = client.profiles?.full_name || client.name || "Unknown Organization";
                      const email = client.profiles?.email || client.email || "No direct email";
                      
                      return (
                        <motion.tr 
                          key={client.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="px-8 py-6 font-bold text-white tracking-tight">{name}</td>
                          <td className="px-8 py-6 text-white/60 font-medium">{email}</td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              client.status === 'Active' || client.status === 'ACTIVE' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-yellow-500/10 text-yellow-500'
                            )}>
                              {client.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-white/40 font-light">
                            {new Date(client.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="text-white/20 hover:text-white transition-colors">
                              <MoreHorizontal size={20} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <p className="text-white/20 font-light italic">No partner records found in the database.</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

