"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Mail, RefreshCw, Send, Eye, Edit3, CheckCircle2, AlertCircle, Phone, Award } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OnboardingState {
  offerSent: boolean;
  credentialsCreated: boolean;
  day1Checked: boolean;
  day2Checked: boolean;
  day3Checked: boolean;
  day4Checked: boolean;
  day5Checked: boolean;
}

export default function AdminEmployeeOnboardingPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // onboarding Custom Progress states stored locally
  const [onboardingData, setOnboardingData] = useState<Record<string, OnboardingState>>({});

  // Email Modal & Template States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  
  const [senderName, setSenderName] = useState("Sai Varshith");
  const [senderEmail, setSenderEmail] = useState("hello@growxlabs.tech");
  const [emailSubject, setEmailSubject] = useState("Offer of Founding SDR Internship - GrowX Labs");

  // Editable Offer Details
  const [roleTitle, setRoleTitle] = useState("Founding Sales Development Representative (SDR) Intern");
  const [incentiveValue, setIncentiveValue] = useState("₹1,000");
  const [commissionValue, setCommissionValue] = useState("10% to 15%");
  const [durationValue, setDurationValue] = useState("3 Months");
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/team?t=${Date.now()}`);
      const data = await res.json();
      const teamList = data.team || [];
      
      // Filter out only agent roles (SDRs/CRM Agents) for onboarding management
      const agents = teamList.filter((m: any) => m.role === "crm_agent" || m.role === "agent");
      setEmployees(agents);

      // Load onboarding checkbox states from local storage
      const saved = localStorage.getItem("growx_employee_onboarding_states");
      if (saved) {
        setOnboardingData(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingState = (id: string): OnboardingState => {
    return onboardingData[id] || {
      offerSent: false,
      credentialsCreated: false,
      day1Checked: false,
      day2Checked: false,
      day3Checked: false,
      day4Checked: false,
      day5Checked: false
    };
  };

  const updateOnboardingState = (id: string, updates: Partial<OnboardingState>) => {
    const currentState = getOnboardingState(id);
    const updatedState = { ...currentState, ...updates };
    const newData = { ...onboardingData, [id]: updatedState };
    setOnboardingData(newData);
    localStorage.setItem("growx_employee_onboarding_states", JSON.stringify(newData));
  };

  const calculateProgress = (state: OnboardingState) => {
    let checkedCount = 0;
    if (state.day1Checked) checkedCount += 20;
    if (state.day2Checked) checkedCount += 20;
    if (state.day3Checked) checkedCount += 20;
    if (state.day4Checked) checkedCount += 20;
    if (state.day5Checked) checkedCount += 20;
    return checkedCount;
  };

  // Generate beautiful branded HTML offer letter body
  const generateHTMLBody = (empName: string, empEmail: string) => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e6e6e6; border-radius: 8px; background-color: #ffffff; color: #31302e; line-height: 1.6; text-align: left;">
        <div style="display: flex; align-items: center; border-bottom: 2px solid #0075de; padding-bottom: 16px; margin-bottom: 24px; justify-content: space-between;">
          <div style="font-size: 18px; font-weight: 800; color: #000000; letter-spacing: -0.5px; text-transform: uppercase;">GrowX Labs</div>
          <div style="font-size: 10px; font-weight: 700; color: #0075de; text-transform: uppercase; letter-spacing: 0.5px;">Offer Contract</div>
        </div>
        
        <h2 style="font-size: 16px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 16px; line-height: 1.3;">Offer of Appointment: ${roleTitle}</h2>
        
        <p style="font-size: 13px; color: #31302e; margin-bottom: 16px;">Dear <strong>${empName}</strong>,</p>
        
        <p style="font-size: 13px; color: #615d59; margin-bottom: 16px;">On behalf of <strong>GrowX Labs</strong>, we are delighted to extend you an offer to join our team as a <strong>${roleTitle}</strong>. We were incredibly impressed by your interviews, and we believe you will represent our organization with excellence.</p>
        
        <h3 style="font-size: 11px; font-weight: 700; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; letter-spacing: 0.5px;">Summary of Terms</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; font-weight: 600; font-size: 12px; color: #615d59;">Title / Designation</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; text-align: right; font-size: 12px; color: #31302e; font-weight: 700;">${roleTitle}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; font-weight: 600; font-size: 12px; color: #615d59;">Duration</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; text-align: right; font-size: 12px; color: #31302e; font-weight: 700;">${durationValue}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; font-weight: 600; font-size: 12px; color: #615d59;">Location</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e6e6e6; text-align: right; font-size: 12px; color: #31302e; font-weight: 700;">Remote</td>
          </tr>
        </table>
        
        <h3 style="font-size: 11px; font-weight: 700; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; letter-spacing: 0.5px;">Compensation & Incentives</h3>
        <div style="background-color: #f6f5f4; border: 1px solid #e6e6e6; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #615d59; line-height: 1.7;">
            <li><strong>Discovery Call Bonus:</strong> You will be paid <strong>${incentiveValue}</strong> for every qualified discovery call successfully scheduled and conducted.</li>
            <li><strong>Closed Revenue Bonus:</strong> You will receive a <strong>${commissionValue}</strong> commission of the contract value for any lead you source that converts to a closed partner client.</li>
          </ul>
        </div>
        
        <h3 style="font-size: 11px; font-weight: 700; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; letter-spacing: 0.5px;">Day 1 Onboarding Setup</h3>
        <p style="font-size: 12px; color: #615d59; margin-bottom: 16px;">To activate your sales credentials and begin your 5-day structured training roadmap, please click the button below to register/login with your official email <strong>${empEmail}</strong>:</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:3000/login" style="display: inline-block; background-color: #0075de; color: #ffffff; padding: 12px 28px; font-weight: 700; text-decoration: none; border-radius: 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 6px -1px rgba(0, 117, 222, 0.15);">Accept & Get Credentials</a>
        </div>
        
        <div style="margin-top: 32px; border-top: 1px solid #e6e6e6; padding-top: 20px; font-size: 12px; color: #615d59;">
          Sincerely,<br>
          <strong>${senderName}</strong><br>
          <span style="font-size: 11px; color: #a39e98;">Founder & MD, GrowX Labs</span>
        </div>
      </div>
    `;
  };

  const handleOpenEmailModal = (emp: any) => {
    setSelectedEmp(emp);
    setActiveTab("preview");
    setShowEmailModal(true);
  };

  const handleSendOnboardingEmail = async () => {
    if (!selectedEmp?.email) return;
    setEmailSending(true);
    
    // Generate final HTML content
    const htmlContent = generateHTMLBody(selectedEmp.name, selectedEmp.email);

    try {
      const res = await fetch("/api/send-email/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: selectedEmp.email,
          fromName: senderName,
          fromEmail: senderEmail,
          subject: emailSubject,
          body: htmlContent // send HTML formatted content
        })
      });
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }
      
      // Update local storage state
      updateOnboardingState(selectedEmp.id, { offerSent: true });
      alert(`Branded HTML Offer letter successfully sent to ${selectedEmp.name}!`);
      setShowEmailModal(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setEmailSending(false);
    }
  };

  const toggleTermsAcceptance = async (emp: any, currentVal: boolean) => {
    const confirmed = confirm(`Are you sure you want to mark ${emp.name}'s Offer Contract as ${!currentVal ? 'Signed' : 'Unsigned'}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/team?id=${emp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted_terms: !currentVal })
      });
      if (!res.ok) throw new Error("Failed to update signature state");
      
      fetchEmployees();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#0075de]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 bg-white text-[#31302e]">
      
      {/* HEADER SECTION */}
      <Reveal y={-10}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-[#e6e6e6]">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon-logo.png" 
              className="w-9 h-9 rounded-lg object-contain bg-[#f6f5f4] p-1.5 border border-[#e6e6e6]" 
              alt="GrowX Labs Logo" 
            />
            <div className="space-y-0.5">
              <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">Employee Onboarding Control</h1>
              <p className="text-[#615d59] text-xs">Manage B2B Sales Development Representatives (SDRs) onboarding, offer letters, and training checklists.</p>
            </div>
          </div>
          <button 
            onClick={fetchEmployees}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-[#31302e] text-xs font-semibold rounded-md transition-colors"
          >
            <RefreshCw size={12} /> Refresh List
          </button>
        </div>
      </Reveal>

      {/* NEW HIRE ONBOARDING PIPELINE */}
      <div className="grid gap-5">
        {employees.length > 0 ? (
          employees.map((emp, i) => {
            const state = getOnboardingState(emp.id);
            const progress = calculateProgress(state);
            return (
              <Reveal key={emp.id} delay={i * 0.05}>
                <div className="p-6 border border-[#e6e6e6] bg-white rounded-lg hover:shadow-md transition-all duration-200 group relative">
                  
                  {/* Basic employee header */}
                  <div className="grid md:grid-cols-4 gap-6 items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0075de] flex items-center gap-1.5">
                        <User size={10} /> SDR Agent
                      </p>
                      <h3 className="font-bold text-[#000000] text-base tracking-tight">{emp.name}</h3>
                      <p className="text-xs text-[#615d59] font-medium">{emp.email}</p>
                      {emp.phone && <p className="text-[11px] text-neutral-400 font-medium flex items-center gap-1"><Phone size={10} /> {emp.phone}</p>}
                    </div>

                    {/* Offer & Credentials setup checklist */}
                    <div className="space-y-2 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a39e98]">Compliance & Access</p>
                      
                      {/* Offer letter status */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { offerSent: !state.offerSent })}
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${state.offerSent ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {state.offerSent && <span className="text-[8px]">✓</span>}
                        </button>
                        <span className={state.offerSent ? "text-[#31302e] font-semibold" : "text-[#615d59]"}>Offer Sent</span>
                      </div>

                      {/* Terms Acceptance Signature */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => toggleTermsAcceptance(emp, !!emp.accepted_terms)}
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${emp.accepted_terms ? 'bg-[#1aae39] border-[#1aae39] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {emp.accepted_terms && <span className="text-[8px]">✓</span>}
                        </button>
                        <span className={emp.accepted_terms ? "text-[#1aae39] font-bold" : "text-[#615d59]"}>
                          Offer Signed {emp.accepted_terms && "✍️"}
                        </span>
                      </div>

                      {/* Access Credentials check */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { credentialsCreated: !state.credentialsCreated })}
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${state.credentialsCreated ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {state.credentialsCreated && <span className="text-[8px]">✓</span>}
                        </button>
                        <span className={state.credentialsCreated ? "text-[#31302e] font-semibold" : "text-[#615d59]"}>Access Credentials Created</span>
                      </div>
                    </div>

                    {/* Progress tracking */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#a39e98]">Training Progress</span>
                        <span className="text-xs font-black text-[#0075de]">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#f6f5f4] rounded-full h-1.5 overflow-hidden border border-[#e6e6e6]">
                        <div 
                          className="bg-[#0075de] h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#615d59] italic">
                        {progress === 100 ? "🎉 Training Complete - Fully Active" : "Ramping up through training tasks"}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 justify-center h-full">
                      <Button 
                        onClick={() => handleOpenEmailModal(emp)}
                        className="w-full bg-[#0075de] hover:bg-[#005bab] text-white text-[10px] font-bold uppercase tracking-widest h-9 rounded-md flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Mail size={12} /> Send Offer Email
                      </Button>
                    </div>
                  </div>

                  {/* Onboarding Checklist Details */}
                  <div className="mt-6 pt-5 border-t border-[#e6e6e6]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#615d59] mb-3">5-Day Training Checklist</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { key: "day1Checked" as const, label: "Day 1: Setups" },
                        { key: "day2Checked" as const, label: "Day 2: Lead List" },
                        { key: "day3Checked" as const, label: "Day 3: Scripts" },
                        { key: "day4Checked" as const, label: "Day 4: Warm dials" },
                        { key: "day5Checked" as const, label: "Day 5: Launch" }
                      ].map((day) => (
                        <label 
                          key={day.key}
                          className={cn(
                            "flex items-center gap-2 p-2.5 border rounded-md cursor-pointer transition-all select-none",
                            state[day.key] 
                              ? 'bg-[#0075de]/5 border-[#0075de]/20 text-[#0075de] font-semibold' 
                              : 'border-[#e6e6e6] bg-[#f6f5f4]/50 text-[#615d59] hover:bg-[#f6f5f4]'
                          )}
                        >
                          <input 
                            type="checkbox"
                            checked={state[day.key]}
                            onChange={() => updateOnboardingState(emp.id, { [day.key]: !state[day.key] })}
                            className="rounded border-[#e6e6e6] bg-white text-[#0075de] focus:ring-0 w-3.5 h-3.5"
                          />
                          <span className="text-[10px] tracking-tight">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </Reveal>
            );
          })
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[#e6e6e6] border-dashed rounded-lg bg-[#f6f5f4]/35">
              <AlertCircle className="text-[#a39e98] mb-3" size={32} />
              <p className="text-[#615d59] text-sm font-semibold">No SDR team members found</p>
              <p className="text-[#a39e98] text-xs mt-1">Add agents under the Team Management section first.</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Premium Offer Letter Modal ── */}
      <AnimatePresence>
        {showEmailModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Frosted backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowEmailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] flex flex-col max-h-[92vh] overflow-hidden border border-[#e0e0e0]"
            >
              {/* ── Modal Top Bar ── */}
              <div className="shrink-0 bg-gradient-to-r from-white via-white to-[#fafafa] border-b border-[#e6e6e6]">
                {/* Header row */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0075de] to-[#0060b8] flex items-center justify-center shadow-md shadow-[#0075de]/20">
                      <Mail className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-extrabold text-[#000] tracking-tight leading-tight">
                        Offer Letter Composer
                      </h3>
                      <p className="text-[11px] text-[#888] font-medium mt-0.5">
                        Review, edit & send branded offer to <span className="text-[#0075de] font-bold">{selectedEmp.name}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="w-8 h-8 rounded-lg bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center transition-colors group"
                  >
                    <span className="text-[#999] group-hover:text-[#333] text-sm font-bold">✕</span>
                  </button>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-1 px-6 pb-0">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "relative px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all rounded-t-lg",
                      activeTab === "preview"
                        ? "text-[#0075de] bg-white border border-[#e6e6e6] border-b-white -mb-px z-10"
                        : "text-[#999] hover:text-[#555] hover:bg-[#f9f9f9]"
                    )}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={cn(
                      "relative px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all rounded-t-lg",
                      activeTab === "edit"
                        ? "text-[#0075de] bg-white border border-[#e6e6e6] border-b-white -mb-px z-10"
                        : "text-[#999] hover:text-[#555] hover:bg-[#f9f9f9]"
                    )}
                  >
                    <Edit3 size={12} /> Edit Details
                  </button>
                </div>
              </div>

              {/* ── Modal Body ── */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {activeTab === "preview" ? (
                  /* ━━━ PREVIEW TAB ━━━ */
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Email metadata sidebar */}
                    <div className="shrink-0 lg:w-[260px] bg-[#fafafa] border-b lg:border-b-0 lg:border-r border-[#e6e6e6] p-5 space-y-5">
                      {/* Email Info Card */}
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#bbb]">Email Details</p>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#aaa]">From</span>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0075de] to-[#0060b8] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                                {senderName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#222] truncate">{senderName}</p>
                                <p className="text-[10px] text-[#999] truncate">{senderEmail}</p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full h-px bg-[#eee]" />

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#aaa]">To</span>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                                {selectedEmp.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#222] truncate">{selectedEmp.name}</p>
                                <p className="text-[10px] text-[#999] truncate">{selectedEmp.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full h-px bg-[#eee]" />

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#aaa]">Subject</span>
                            <p className="text-[11px] font-semibold text-[#333] leading-snug">{emailSubject}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#bbb]">Offer Summary</p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="bg-white rounded-lg border border-[#eee] p-3">
                            <p className="text-[9px] text-[#aaa] font-bold uppercase tracking-wider">Role</p>
                            <p className="text-[11px] font-bold text-[#222] mt-0.5 leading-snug">{roleTitle}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-lg border border-[#eee] p-3">
                              <p className="text-[9px] text-[#aaa] font-bold uppercase tracking-wider">Duration</p>
                              <p className="text-[12px] font-black text-[#0075de] mt-0.5">{durationValue}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-[#eee] p-3">
                              <p className="text-[9px] text-[#aaa] font-bold uppercase tracking-wider">Incentive</p>
                              <p className="text-[12px] font-black text-[#10b981] mt-0.5">{incentiveValue}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="bg-white rounded-lg border border-[#eee] p-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                        <span className="text-[10px] font-semibold text-[#777]">Draft — Ready to send</span>
                      </div>
                    </div>

                    {/* Right: Letter Preview Canvas */}
                    <div className="flex-1 min-w-0 bg-gradient-to-b from-[#f0f0f0] to-[#e8e8e8] p-4 sm:p-6 lg:p-8">
                      {/* Realistic browser chrome */}
                      <div className="rounded-xl overflow-hidden border border-[#d5d5d5] shadow-lg bg-white">
                        {/* Window Title Bar */}
                        <div className="bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-[#ddd] px-4 py-2.5 flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57] border border-[#e04a3f] shadow-inner" />
                            <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e] border border-[#d5a123] shadow-inner" />
                            <div className="w-[10px] h-[10px] rounded-full bg-[#28c840] border border-[#1dad2f] shadow-inner" />
                          </div>
                          {/* Address bar */}
                          <div className="flex-1 flex items-center">
                            <div className="flex items-center gap-2 bg-white rounded-md border border-[#ddd] px-3 py-1 w-full max-w-md mx-auto">
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M8 1L3 6v7a1 1 0 001 1h3V10h2v4h3a1 1 0 001-1V6L8 1z" fill="#aaa"/></svg>
                              <div className="flex items-center gap-1 text-[10px]">
                                <span className="text-[#1aae39] font-semibold">🔒</span>
                                <span className="text-[#555] font-medium">mail.growxlabs.tech</span>
                                <span className="text-[#bbb]">/</span>
                                <span className="text-[#aaa]">offer-letter</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Email Client Header Strip */}
                        <div className="bg-white border-b border-[#eee] px-5 py-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0075de] to-[#005bab] flex items-center justify-center shrink-0">
                                <Award className="text-white" size={14} />
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-[#222]">{emailSubject}</p>
                                <p className="text-[10px] text-[#aaa] mt-0.5">
                                  {senderName} &lt;{senderEmail}&gt; → {selectedEmp.name} &lt;{selectedEmp.email}&gt;
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-0.5 bg-[#0075de]/8 text-[#0075de] text-[9px] font-bold uppercase tracking-wider rounded">Offer</span>
                              <span className="px-2 py-0.5 bg-[#10b981]/8 text-[#10b981] text-[9px] font-bold uppercase tracking-wider rounded">Contract</span>
                            </div>
                          </div>
                        </div>

                        {/* Letter surface */}
                        <div className="bg-[#f5f5f5]">
                          <div className="p-4 sm:p-6 lg:p-8 flex justify-center">
                            {/* Paper sheet */}
                            <div className="bg-white rounded-lg shadow-[0_2px_16px_-4px_rgba(0,0,0,0.1)] border border-[#e8e8e8] w-full max-w-[560px]">
                              <div dangerouslySetInnerHTML={{ __html: generateHTMLBody(selectedEmp.name, selectedEmp.email) }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ━━━ EDIT TAB ━━━ */
                  <div className="p-6 sm:p-8 space-y-8 max-w-3xl mx-auto">
                    {/* Sender Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-[#0075de]" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555]">Sender Information</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Sender Email</label>
                          <input
                            type="text"
                            value={senderEmail}
                            disabled
                            className="w-full bg-[#f5f5f5] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#bbb] text-[13px] cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recipient Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-[#10b981]" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555]">Recipient</h4>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-[#fafafa] border border-[#e6e6e6] rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[11px] font-black shrink-0">
                          {selectedEmp.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#222]">{selectedEmp.name}</p>
                          <p className="text-[11px] text-[#999]">{selectedEmp.email}</p>
                        </div>
                        <div className="ml-auto">
                          <CheckCircle2 size={16} className="text-[#10b981]" />
                        </div>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-[#f59e0b]" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555]">Email Subject</h4>
                      </div>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Offer Variables */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-[#8b5cf6]" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555]">Contract Variables</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Role / Designation</label>
                          <input
                            type="text"
                            value={roleTitle}
                            onChange={(e) => setRoleTitle(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Incentive per Call</label>
                          <input
                            type="text"
                            value={incentiveValue}
                            onChange={(e) => setIncentiveValue(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Commission %</label>
                          <input
                            type="text"
                            value={commissionValue}
                            onChange={(e) => setCommissionValue(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Duration</label>
                          <input
                            type="text"
                            value={durationValue}
                            onChange={(e) => setDurationValue(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3.5 py-2.5 text-[#222] text-[13px] font-medium focus:bg-white focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Modal Footer ── */}
              <div className="shrink-0 border-t border-[#e6e6e6] bg-[#fafafa] px-6 py-4 flex items-center justify-between">
                <p className="text-[10px] text-[#aaa] font-medium hidden sm:block">
                  📧 Email will be sent via <span className="font-bold text-[#777]">GrowX Mail</span> with HTML formatting
                </p>
                <div className="flex items-center gap-3 ml-auto">
                  <Button
                    onClick={() => setShowEmailModal(false)}
                    variant="outline"
                    className="border-[#ddd] text-[#777] hover:bg-[#f0f0f0] text-[11px] font-bold h-9 rounded-lg px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOnboardingEmail}
                    disabled={emailSending}
                    className="bg-gradient-to-r from-[#0075de] to-[#005bab] hover:from-[#005bab] hover:to-[#004a8f] text-white text-[11px] font-bold px-5 h-9 rounded-lg flex items-center gap-2 shadow-md shadow-[#0075de]/20 transition-all hover:shadow-lg hover:shadow-[#0075de]/25"
                  >
                    {emailSending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Send Offer Letter
                      </>
                    )}
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
