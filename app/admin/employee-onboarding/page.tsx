"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Mail, RefreshCw, Send, Eye, Edit3, CheckCircle2, AlertCircle, Phone, Award, ShieldCheck, FileText, Printer, AlertTriangle, Lock } from "lucide-react";
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

  // Onboarding Custom Progress states stored locally
  const [onboardingData, setOnboardingData] = useState<Record<string, OnboardingState>>({});

  // Modal & Template States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
  
  // Candidate, Sender & BCC Details
  const [candidateName, setCandidateName] = useState("Akhilesh");
  const [candidateEmail, setCandidateEmail] = useState("akhilesh@growxlabs.tech");
  const [senderName, setSenderName] = useState("Sai Varshith");
  const [senderEmail, setSenderEmail] = useState("sai@growxlabs.tech");
  const [bccEmail, setBccEmail] = useState("saivarshith8284@gmail.com");
  const [emailSubject, setEmailSubject] = useState("Formal Employment Offer: Sales Development Representative (SDR) - GrowX Labs Tech Pvt. Ltd.");

  // Plain English Offer Terms (No complex legal jargon)
  const [roleTitle, setRoleTitle] = useState("Sales Development Representative (SDR)");
  const [incentiveValue, setIncentiveValue] = useState("₹1,000");
  const [commissionValue, setCommissionValue] = useState("10% to 15%");
  const [durationValue, setDurationValue] = useState("Independent Contractor / Performance-Based");
  const [offerDate, setOfferDate] = useState("20 July 2026");
  const [joiningDate, setJoiningDate] = useState("20 July 2026");
  const [weeklyMeetingsTarget, setWeeklyMeetingsTarget] = useState("5");
  const [monthlySqoTarget, setMonthlySqoTarget] = useState("3");
  const [refNumber, setRefNumber] = useState(`GXL/HR/OFFER/SDR/${new Date().getFullYear()}/001`);
  
  // Progress & Validation States
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
      
      const agents = teamList.filter((m: any) => m.role === "crm_agent" || m.role === "agent");
      
      // Add Akhilesh to team list if not present
      if (!agents.find((a: any) => a.email === "akhilesh@growxlabs.tech" || a.email === "saivarshith8284@gmail.com")) {
        agents.unshift({
          id: "akhilesh-sdr-001",
          name: "Akhilesh",
          email: "saivarshith8284@gmail.com",
          phone: "+91 98765 43210",
          role: "crm_agent",
          accepted_terms: false
        });
      }

      setEmployees(agents);

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

  // Validation Check
  const getValidationErrors = () => {
    const errors: string[] = [];
    if (!candidateName.trim()) errors.push("Candidate Name is required.");
    if (!candidateEmail.trim() || !candidateEmail.includes("@")) errors.push("Valid Candidate Email is required.");
    if (senderEmail.trim().toLowerCase() !== "saivarshith8284@gmail.com") errors.push("Sender Email MUST be saivarshith8284@gmail.com.");
    if (!joiningDate.trim()) errors.push("Joining Date is required.");
    if (!roleTitle.trim()) errors.push("Role Title is required.");
    return errors;
  };

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  // Clean, Plain-English, Corporate HTML Offer Letter
  const generateHTMLBody = (name: string, email: string) => {
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 780px; margin: 0 auto; background-color: #ffffff; color: #0f172a; line-height: 1.6; padding: 40px; border: 1px solid #e2e8f0; border-radius: 8px;">
        
        <!-- Company Header -->
        <table style="width: 100%; border-bottom: 3px solid #0075de; padding-bottom: 16px; margin-bottom: 24px;">
          <tr>
            <td>
              <h1 style="font-size: 22px; font-weight: 900; color: #0075de; margin: 0; text-transform: uppercase;">
                GROWX LABS TECH PVT. LTD.
              </h1>
              <p style="font-size: 11px; font-weight: 700; color: #1e3a8a; margin: 3px 0 0 0; text-transform: uppercase;">
                AI-Native Product Studio &amp; Enterprise AI Solutions
              </p>
              <p style="font-size: 10px; color: #64748b; margin: 2px 0 0 0;">
                Visakhapatnam, Andhra Pradesh, India | https://growxlabs.tech
              </p>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div style="background-color: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: 800;">
                JOB OFFER CONTRACT
              </div>
            </td>
          </tr>
        </table>

        <!-- Document Reference -->
        <table style="width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 24px; font-size: 11px; color: #334155;">
          <tr>
            <td><strong>REF NO:</strong> ${refNumber}</td>
            <td><strong>OFFER DATE:</strong> ${offerDate}</td>
            <td style="text-align: right;"><strong>CONFIDENTIAL</strong></td>
          </tr>
        </table>

        <!-- Greeting -->
        <h2 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
          OFFER OF APPOINTMENT: ${roleTitle}
        </h2>

        <p style="font-size: 13px; color: #0f172a; margin-bottom: 16px;">
          Dear <strong>${name}</strong> (${email}),
        </p>

        <p style="font-size: 12px; color: #334155; margin-bottom: 20px;">
          We are happy to offer you the position of <strong>${roleTitle}</strong> at <strong>GrowX Labs Tech Pvt. Ltd.</strong> We were impressed by your background and believe you will be a valuable addition to our team.
        </p>

        <!-- Terms Summary Table -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin: 20px 0 8px 0;">
          01. Key Engagement Details
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700; width: 35%;">Job Title</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700; color: #0f172a;">${roleTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700;">Joining Date</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 800; color: #0075de;">${joiningDate}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700;">Engagement Type</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${durationValue}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700;">Work Mode</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Remote (Working hours align with IST)</td>
          </tr>
        </table>

        <!-- Compensation Details -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin: 20px 0 8px 0;">
          02. Pay &amp; Commission Structure
        </h3>
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; margin-bottom: 20px; font-size: 11px; color: #1e293b;">
          <p style="margin: 0 0 8px 0; font-weight: 700;">Performance-Based Model:</p>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.7;">
            <li><strong>Closed Revenue Bonus:</strong> You earn <strong>${commissionValue}</strong> commission on net contract revenue from deals you bring in.</li>
            <li><strong>Discovery Call Incentive:</strong> You earn <strong>${incentiveValue}</strong> for every qualified discovery meeting scheduled and completed.</li>
            <li><strong>Payment Schedule:</strong> Payments are transferred monthly to your bank account within 10 days after clients pay invoices.</li>
          </ul>
        </div>

        <!-- Responsibilities & KPIs -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin: 20px 0 8px 0;">
          03. Responsibilities &amp; Target Targets
        </h3>
        <p style="font-size: 11px; color: #334155; margin-bottom: 10px;">
          Your main duties include cold outreach, cold emails, LinkedIn messaging, lead qualification, and scheduling discovery calls for senior executives.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="padding: 8px 12px; border: 1px solid #0f172a; text-align: left;">Daily Work</th>
              <th style="padding: 8px 12px; border: 1px solid #0f172a; text-align: left;">Weekly Target</th>
              <th style="padding: 8px 12px; border: 1px solid #0f172a; text-align: left;">Monthly Goal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">40 Calls / 50 Emails / 20 LinkedIn</td>
              <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700; color: #0075de;">${weeklyMeetingsTarget} Booked Meetings</td>
              <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700; color: #10b981;">${monthlySqoTarget} Qualified Opportunities</td>
            </tr>
          </tbody>
        </table>

        <!-- Simple Rules -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin: 20px 0 8px 0;">
          04. Confidentiality &amp; Company Property
        </h3>
        <p style="font-size: 11px; color: #334155; margin-bottom: 20px;">
          You agree to keep all company leads, client lists, and internal materials confidential. All work produced during your engagement belongs to GrowX Labs Tech Pvt. Ltd. Either party can end this agreement with 14 days' written notice.
        </p>

        <!-- Acceptance Link -->
        <div style="text-align: center; margin: 28px 0; background-color: #f8fafc; border: 1px border-dashed #cbd5e1; padding: 16px; border-radius: 8px;">
          <p style="font-size: 12px; color: #0f172a; margin-bottom: 10px; font-weight: 600;">Click below to accept this offer and get your onboarding account credentials:</p>
          <a href="https://growxlabs.tech/login" style="display: inline-block; background-color: #0075de; color: #ffffff; padding: 10px 24px; font-weight: 700; text-decoration: none; border-radius: 6px; font-size: 12px;">
            ACCEPT OFFER &amp; START ONBOARDING
          </a>
        </div>

        <!-- Signature Block -->
        <div style="margin-top: 32px; border-top: 2px solid #0f172a; padding-top: 20px; font-size: 11px; color: #0f172a;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 50%; vertical-align: top;">
                <strong>GrowX Labs Tech Pvt. Ltd.</strong><br/><br/>
                <span style="font-weight: 800; color: #0075de;">${senderName}</span><br/>
                <span style="font-size: 10px; color: #64748b;">Founder &amp; CEO</span><br/>
                <span style="font-size: 10px; color: #64748b;">Email: ${senderEmail}</span>
              </td>
              <td style="width: 50%; vertical-align: top; text-align: right;">
                <strong>Candidate Acceptance</strong><br/><br/>
                <span style="font-weight: 800;">${name}</span><br/>
                <span style="font-size: 10px; color: #64748b;">Date: ________________</span><br/>
                <span style="font-size: 10px; color: #64748b;">Signature: ________________</span>
              </td>
            </tr>
          </table>
        </div>

      </div>
    `;
  };

  const handleOpenEmailModal = (emp: any) => {
    setSelectedEmp(emp);
    setCandidateName(emp.name || "Akhilesh");
    setCandidateEmail(emp.email || "akhilesh@growxlabs.tech");
    setActiveTab("preview");
    setShowEmailModal(true);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Dispatch Offer Email from sai@growxlabs.tech with BCC copy to saivarshith8284@gmail.com
  const handleSendOnboardingEmail = async () => {
    if (!isValid) {
      alert("Cannot send offer letter. Please complete all fields first.");
      return;
    }

    setEmailSending(true);
    const htmlContent = generateHTMLBody(candidateName, candidateEmail);

    try {
      const res = await fetch("/api/send-email/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: candidateEmail,
          fromName: `${senderName} | GrowX Labs`,
          fromEmail: senderEmail, // Sent from sai@growxlabs.tech
          bccEmail: bccEmail,     // BCC copy to saivarshith8284@gmail.com
          subject: emailSubject,
          html: htmlContent,
          body: `Job Offer: ${roleTitle}\n\nDear ${candidateName},\n\nPlease review your formal offer letter from GrowX Labs Tech Pvt. Ltd.`
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }

      if (selectedEmp?.id) {
        updateOnboardingState(selectedEmp.id, { offerSent: true });
      }

      alert(`🚀 Offer Letter successfully dispatched from ${senderEmail} to ${candidateEmail}! BCC copy delivered to ${bccEmail}.`);
      setShowEmailModal(false);
    } catch (e: any) {
      console.error(e);
      alert(`Email Delivery Error: ${e.message}`);
    } finally {
      setEmailSending(false);
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
            <div className="p-2.5 bg-[#0f172a] text-white rounded-xl shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">SDR Onboarding &amp; Offer Dispatch</h1>
              <p className="text-[#64748b] text-xs">Review offer contracts and send directly to candidates via <span className="font-bold text-[#0075de]">saivarshith8284@gmail.com</span>.</p>
            </div>
          </div>
          <button 
            onClick={fetchEmployees}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} /> Refresh Roster
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
                <div className="p-6 border border-[#e2e8f0] bg-white rounded-xl hover:shadow-lg transition-all duration-200 group relative">
                  
                  {/* Basic employee header */}
                  <div className="grid md:grid-cols-4 gap-6 items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0075de] flex items-center gap-1.5">
                        <User size={11} /> SDR Candidate
                      </p>
                      <h3 className="font-extrabold text-[#0f172a] text-base tracking-tight">{emp.name}</h3>
                      <p className="text-xs text-[#64748b] font-medium">{emp.email}</p>
                      {emp.phone && <p className="text-[11px] text-[#94a3b8] font-medium flex items-center gap-1"><Phone size={10} /> {emp.phone}</p>}
                    </div>

                    {/* Offer & Credentials setup checklist */}
                    <div className="space-y-2 text-left">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Offer Status</p>
                      
                      {/* Offer letter status */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { offerSent: !state.offerSent })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.offerSent ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#cbd5e1] hover:border-neutral-400'}`}
                        >
                          {state.offerSent && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.offerSent ? "text-[#0f172a] font-semibold" : "text-[#64748b]"}>Offer Letter Sent</span>
                      </div>

                      {/* Credentials status */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { credentialsCreated: !state.credentialsCreated })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.credentialsCreated ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#cbd5e1] hover:border-neutral-400'}`}
                        >
                          {state.credentialsCreated && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.credentialsCreated ? "text-[#0f172a] font-semibold" : "text-[#64748b]"}>Account Created</span>
                      </div>
                    </div>

                    {/* Progress tracking */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Ramp Progress</span>
                        <span className="text-xs font-black text-[#0075de]">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#f8fafc] rounded-full h-2 overflow-hidden border border-[#e2e8f0]">
                        <div 
                          className="bg-[#0075de] h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 justify-center h-full">
                      <Button 
                        onClick={() => handleOpenEmailModal(emp)}
                        className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-[10px] font-extrabold uppercase tracking-wider h-10 rounded-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <Mail size={14} /> Send Offer To My Email
                      </Button>
                    </div>
                  </div>

                </div>
              </Reveal>
            );
          })
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[#cbd5e1] border-dashed rounded-xl bg-[#f8fafc]">
              <AlertCircle className="text-[#94a3b8] mb-3" size={32} />
              <p className="text-[#334155] text-sm font-semibold">No candidates found</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Offer Letter Preview & Send Modal ── */}
      <AnimatePresence>
        {showEmailModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setShowEmailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col h-[92vh] max-h-[94vh] overflow-hidden border border-[#cbd5e1]"
            >
              {/* Modal Top Bar */}
              <div className="shrink-0 bg-[#0f172a] text-white border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0075de] flex items-center justify-center text-white shadow-md">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                        Offer Letter Dispatch Studio
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        Sending To: <span className="font-extrabold text-[#60a5fa]">{candidateEmail}</span> &nbsp;|&nbsp; From: <span className="font-extrabold text-white">{senderEmail}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintPDF}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                    >
                      <Printer size={14} /> Print / Save PDF
                    </button>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                      activeTab === "preview"
                        ? "bg-[#0075de] text-white shadow"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Eye size={13} /> Live Document Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={cn(
                      "px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                      activeTab === "edit"
                        ? "bg-[#0075de] text-white shadow"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Edit3 size={13} /> Change Recipient / Email
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-[#e2e8f0]/40">
                {activeTab === "preview" ? (
                  <div className="p-6 flex justify-center">
                    <div className="w-full max-w-[780px] shadow-2xl rounded-lg overflow-hidden border border-[#cbd5e1] bg-white">
                      <div dangerouslySetInnerHTML={{ __html: generateHTMLBody(candidateName, candidateEmail) }} />
                    </div>
                  </div>
                ) : (
                  /* EDIT RECIPIENT EMAIL TAB */
                  <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto bg-white rounded-2xl shadow border border-[#cbd5e1] my-6">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0075de] flex items-center gap-1.5">
                      <Mail size={14} /> Send Directly To Your Inbox
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#64748b]">Recipient Email Address</label>
                        <input
                          type="email"
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="saivarshith8284@gmail.com"
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3.5 py-2.5 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                        />
                        <p className="text-[10px] text-[#0075de] font-semibold mt-1">
                          💡 Put your email here (<span className="font-extrabold">saivarshith8284@gmail.com</span>) to inspect the email immediately in your inbox!
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#64748b]">Candidate Name</label>
                        <input
                          type="text"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3.5 py-2.5 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="shrink-0 border-t border-[#cbd5e1] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                <div className="text-xs font-bold text-[#334155] space-y-0.5">
                  <p>📧 From: <span className="text-[#0075de] font-extrabold">{senderEmail}</span> &rarr; To: <span className="text-[#0f172a] font-extrabold">{candidateEmail}</span></p>
                  <p className="text-[11px] text-emerald-600 font-semibold">📬 Automatic BCC Copy &rarr; <span className="font-extrabold">{bccEmail}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowEmailModal(false)}
                    variant="outline"
                    className="border-[#cbd5e1] text-[#64748b] hover:bg-white text-xs font-bold h-10 rounded-xl px-5 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOnboardingEmail}
                    disabled={emailSending}
                    className="bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-extrabold px-6 h-10 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer shadow-[#0075de]/25"
                  >
                    {emailSending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Dispatching Email…
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Dispatch Offer (BCC to {bccEmail})
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
