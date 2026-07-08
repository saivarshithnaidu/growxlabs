"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    course_name: "AI Engineering — From Scratch to Production",
    issue_date: new Date().toISOString().split("T")[0],
    completion_date: new Date().toISOString().split("T")[0],
    grade: "Distinction",
    cert_id: `GXL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificates")
        .insert([formData]);

      if (error) throw error;

      toast.success("Certificate generated successfully!");
      router.push(`/certificate/${formData.cert_id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Generate New Certificate</h1>
        
        <Card className="p-8 bg-white/[0.02] border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Student Name</label>
                <Input 
                  value={formData.student_name}
                  onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                  required
                  placeholder="e.g. Hemanth Kumar"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Student Email</label>
                <Input 
                  type="email"
                  value={formData.student_email}
                  onChange={(e) => setFormData({...formData, student_email: e.target.value})}
                  required
                  placeholder="student@example.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-white/40 uppercase">Course Name</label>
                <Input 
                  value={formData.course_name}
                  onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Issue Date</label>
                <Input 
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Grade / Distinction</label>
                <Input 
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  placeholder="e.g. Distinction"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Certificate ID</label>
                <Input 
                  value={formData.cert_id}
                  onChange={(e) => setFormData({...formData, cert_id: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#00A86B] hover:bg-[#00A86B]/90 text-white h-12"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate & Save Certificate"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
