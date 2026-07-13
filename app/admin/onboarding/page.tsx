"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, FileText, User, Briefcase, Calendar, Mail, XCircle } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function AdminOnboardingPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Email Outreach States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [senderName, setSenderName] = useState("GrowX Labs");
  const [senderEmail, setSenderEmail] = useState("hello@growxlabs.tech");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/onboarding/list");
      const data = await res.json();
      setSubmissions(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDynamicEmail = async () => {
    if (!selectedSub?.email) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/send-email/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: selectedSub.email,
          fromName: senderName,
          fromEmail: senderEmail,
          subject: emailSubject,
          body: emailBody
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }
      alert("Email sent successfully!");
      setShowEmailModal(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Onboarding Submissions</h1>
            <p className="text-[var(--text-secondary)] text-sm">Review potential client project details.</p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6">
        {submissions.length > 0 ? (
          submissions.map((sub, i) => (
            <Reveal key={sub.id} delay={i * 0.05}>
              <div className="p-8 border border-[var(--border-subtle)] bg-[var(--surface-1)] hover:border-[var(--border-hover)] transition-all rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="grid md:grid-cols-4 gap-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><User size={12} /> Client</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.full_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.email}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Briefcase size={12} /> Business</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.business_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.business_type}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{sub.city}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Calendar size={12} /> Project</p>
                    <p className="font-bold text-white text-lg tracking-tight">{sub.plan}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Budget: {sub.budget}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Timeline: {sub.timeline}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-2">
                     <div className="text-right w-full mb-1">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Submitted On</p>
                       <p className="text-xs text-[var(--text-secondary)] font-medium">{new Date(sub.created_at).toLocaleDateString()}</p>
                     </div>
                     <button 
                       onClick={() => window.location.href = `/admin/agreements/preview?from_onboarding=${sub.id}`}
                       className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
                     >
                       <FileText size={14} />
                       Create Agreement
                     </button>
                     <button 
                       onClick={() => {
                         setSelectedSub(sub);
                         setSenderName("GrowX Labs");
                         setSenderEmail("hello@growxlabs.tech");
                         setEmailSubject(`Update regarding your GrowX Labs ${sub.plan || 'Growth'} Project Request`);
                         setEmailBody(`Hi ${sub.full_name},\n\nWe received your details regarding the ${sub.plan} project for ${sub.business_name || 'your business'}.\n\nOur team is currently preparing your project proposal and agreement. We will send it over shortly!\n\nBest regards,\nGrowX Labs Team`);
                         setShowEmailModal(true);
                       }}
                       className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all"
                     >
                       <Mail size={14} />
                       Send Email
                     </button>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] grid md:grid-cols-2 gap-8 relative z-10">
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Description</p>
                     <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">{sub.description || "No description provided."}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Features Requested</p>
                     <div className="flex flex-wrap gap-2">
                       {sub.features?.map((f: string) => (
                         <span key={f} className="text-[10px] font-bold uppercase tracking-widest bg-[var(--surface-2)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-[var(--text-secondary)]">
                           {f}
                         </span>
                       )) || <span className="text-xs text-[var(--text-muted)]">None</span>}
                     </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[var(--border-subtle)] border-dashed rounded-2xl bg-[var(--surface-1)]">
               <FileText className="text-[var(--text-muted)] mb-4" size={48} />
               <p className="text-[var(--text-secondary)] text-sm font-medium">No onboarding submissions found.</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* Dynamic Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="text-blue-500" size={18} /> Send Outreach to Client
                </h3>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Sender Name</label>
                    <input 
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Sender Email</label>
                    <input 
                      type="text"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Recipient Email</label>
                  <input 
                    type="text"
                    value={selectedSub?.email || ""}
                    disabled
                    className="w-full h-11 bg-white/[0.01] border border-white/5 rounded-lg px-4 text-white/40 text-sm focus:outline-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Subject</label>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Email Body (Plain Text or HTML)</label>
                  <textarea 
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg p-4 text-white text-sm font-medium focus:outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                <Button 
                  onClick={() => setShowEmailModal(false)}
                  variant="outline"
                  className="border-white/10 text-white/60 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendDynamicEmail}
                  disabled={emailSending}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6"
                >
                  {emailSending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
