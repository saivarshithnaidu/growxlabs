"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Mail, RefreshCw, Send, Eye, Edit3, CheckCircle2, AlertCircle, Phone, Award, ShieldCheck, FileText, Download, Copy, Check } from "lucide-react";
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

  // Email Modal & Template States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  
  // Custom Sender & Offer Details
  const [senderName, setSenderName] = useState("Sai Varshith");
  const [senderEmail, setSenderEmail] = useState("sai@growxlabs.tech");
  const [emailSubject, setEmailSubject] = useState("Offer of Appointment: Sales Development Representative (SDR) - GrowX Labs Tech Pvt. Ltd.");

  // Editable Offer & Legal Contract Details
  const [roleTitle, setRoleTitle] = useState("Sales Development Representative (SDR)");
  const [incentiveValue, setIncentiveValue] = useState("₹1,000");
  const [commissionValue, setCommissionValue] = useState("10% to 15%");
  const [durationValue, setDurationValue] = useState("Independent Contractor / Performance-Based");
  const [offerDate, setOfferDate] = useState("2026-07-20");
  const [joiningDate, setJoiningDate] = useState("2026-08-01");
  const [weeklyMeetingsTarget, setWeeklyMeetingsTarget] = useState("5");
  const [monthlySqoTarget, setMonthlySqoTarget] = useState("3");
  const [emailSending, setEmailSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/team?t=${Date.now()}`);
      const data = await res.json();
      const teamList = data.team || [];
      
      // Filter out agent roles (SDRs/CRM Agents) for onboarding management
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

  // Generate startup-grade legal HTML offer letter & agreement body
  const generateHTMLBody = (empName: string, empEmail: string) => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 36px 28px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #1f2937; line-height: 1.6; text-align: left;">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #0075de; padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
          <h1 style="font-size: 22px; font-weight: 900; color: #0075de; letter-spacing: -0.5px; margin: 0;">GROWX LABS TECH PVT. LTD.</h1>
          <p style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">AI-Native Product Studio & Enterprise AI Solutions</p>
          <p style="font-size: 10px; color: #9ca3af; margin: 2px 0 0 0;">Visakhapatnam, Andhra Pradesh, India | https://growxlabs.tech</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 11px; color: #475569;">
          <strong>REF:</strong> GXL/HR/OFFER/SDR/${new Date().getFullYear()}/001 &nbsp;|&nbsp; <strong>DATE:</strong> ${offerDate}
        </div>
        
        <h2 style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; pb-2;">
          CONFIDENTIAL INDEPENDENT CONTRACTOR ENGAGEMENT OFFER & AGREEMENT
        </h2>
        
        <p style="font-size: 13px; color: #1f2937; margin-bottom: 16px;">Dear <strong>${empName}</strong> (${empEmail}),</p>
        
        <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
          On behalf of <strong>GrowX Labs Tech Pvt. Ltd.</strong> ("Company"), we are pleased to offer you an engagement as an <strong>Independent Contractor - ${roleTitle}</strong> within our Sales Department, reporting directly to the Founder / CEO.
        </p>

        <!-- Terms Overview Table -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 10px; letter-spacing: 0.5px;">1. Summary of Engagement Terms</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #475569;">Designation</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 700;">${roleTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #475569;">Engagement Type</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${durationValue}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #475569;">Joining Date</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 700;">${joiningDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #475569;">Probation Period</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">90 Days Assessment</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #475569;">Work Mode</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">Fully Remote (Overlap with IST)</td>
          </tr>
        </table>

        <!-- Compensation Section -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 10px; letter-spacing: 0.5px;">2. Compensation & Commission Structure</h3>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 12px; color: #1e3a8a;">
          <p style="margin: 0 0 8px 0;"><strong>Performance-Based Model (No Fixed Base Salary):</strong></p>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.7;">
            <li><strong>Closed Revenue Commission:</strong> <strong>${commissionValue}</strong> net revenue commission on closed partner deals sourced by you.</li>
            <li><strong>Discovery Meeting Bonus:</strong> <strong>${incentiveValue}</strong> for every qualified BANT discovery call scheduled and completed.</li>
            <li><strong>Payout Schedule:</strong> Monthly payouts via direct bank transfer within 10 business days following client invoice settlement (subject to TDS under Section 194J/194H).</li>
          </ul>
        </div>

        <!-- Responsibilities & KPIs -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 10px; letter-spacing: 0.5px;">3. Responsibilities & Weekly KPIs</h3>
        <p style="font-size: 12px; color: #4b5563; margin-bottom: 12px;">
          Your key responsibilities include Cold Calling, Cold Emailing, LinkedIn Outreach, CRM Management (Apollo/HubSpot), Lead Qualification (BANT), Appointment Setting, and Daily Activity Reporting.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <thead style="background-color: #f1f5f9; color: #334155; text-transform: uppercase;">
            <tr>
              <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Daily Target</th>
              <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Weekly Deliverable</th>
              <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Monthly SQO Benchmark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">40 Calls / 50 Emails / 20 LinkedIn</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #0075de;">${weeklyMeetingsTarget} Booked Meetings</td>
              <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #10b981;">${monthlySqoTarget} SQOs</td>
            </tr>
          </tbody>
        </table>

        <!-- Core Legal Clauses -->
        <h3 style="font-size: 12px; font-weight: 800; color: #0075de; text-transform: uppercase; margin-top: 24px; margin-bottom: 10px; letter-spacing: 0.5px;">4. Legal Covenants & Protections</h3>
        <div style="font-size: 11px; color: #4b5563; line-height: 1.7; space-y-2;">
          <p style="margin-bottom: 8px;"><strong>4.1 Confidentiality (NDA):</strong> You agree to hold all company documents, client databases, pricing matrices, scripts, AI prompts, and proprietary workflows in strict confidence during and after termination.</p>
          <p style="margin-bottom: 8px;"><strong>4.2 Intellectual Property Assignment:</strong> All sales materials, playbooks, outreach copy, automation workflows, and CRM databases developed by you during engagement belong exclusively to GrowX Labs Tech Pvt. Ltd.</p>
          <p style="margin-bottom: 8px;"><strong>4.3 12-Month Non-Solicitation:</strong> For 12 months post-termination, you shall not solicit GrowX Labs' clients, active leads, or team members.</p>
          <p style="margin-bottom: 8px;"><strong>4.4 Termination & Governing Law:</strong> Either party may terminate with 14 days' written notice. Governed by the laws of India, jurisdiction of Visakhapatnam, Andhra Pradesh.</p>
        </div>

        <!-- Onboarding Activation Button -->
        <div style="text-align: center; margin: 32px 0; background-color: #f8fafc; border: 1px border-dashed #cbd5e1; padding: 20px; border-radius: 8px;">
          <p style="font-size: 12px; color: #334155; margin-bottom: 14px; font-weight: 600;">To confirm your acceptance and activate your Day 1 SDR onboarding credentials:</p>
          <a href="https://growxlabs.tech/login" style="display: inline-block; background-color: #0075de; color: #ffffff; padding: 12px 32px; font-weight: 800; text-decoration: none; border-radius: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 117, 222, 0.25);">
            Accept Offer &amp; Activate Credentials
          </a>
        </div>
        
        <!-- Signatures -->
        <div style="margin-top: 36px; border-top: 2px solid #0075de; padding-top: 20px; font-size: 12px; color: #334155;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 50%; vertical-align: top;">
                <strong>For GrowX Labs Tech Pvt. Ltd.</strong><br/><br/>
                <span style="font-[#0075de] font-weight: 700;">${senderName}</span><br/>
                <span style="font-size: 11px; color: #64748b;">Founder &amp; CEO</span><br/>
                <span style="font-size: 10px; color: #94a3b8;">Email: ${senderEmail}</span>
              </td>
              <td style="width: 50%; vertical-align: top; text-align: right;">
                <strong>Candidate Acceptance</strong><br/><br/>
                <span>${empName}</span><br/>
                <span style="font-size: 11px; color: #64748b;">Date: ____________________</span><br/>
                <span style="font-size: 10px; color: #94a3b8;">Signature: ________________</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 24px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px; font-size: 10px; color: #94a3b8;">
          GrowX Labs Tech Pvt. Ltd. | Confidential Employment Document | Sent via ${senderEmail}
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
          html: htmlContent,
          body: `Offer of Appointment: ${roleTitle}\n\nDear ${selectedEmp.name},\n\nPlease review your formal Independent Contractor Agreement & Offer Letter sent via GrowX Mail.`
        })
      });
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }
      
      // Update local storage state
      updateOnboardingState(selectedEmp.id, { offerSent: true });
      alert(`Legal SDR Offer Contract successfully dispatched to ${selectedEmp.name} via ${senderEmail}!`);
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
            <div className="p-2 bg-[#0075de]/10 border border-[#0075de]/20 rounded-xl text-[#0075de]">
              <ShieldCheck size={22} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">SDR Onboarding &amp; Contract Control</h1>
              <p className="text-[#615d59] text-xs">Generate startup-grade legal SDR agreements &amp; dispatch directly via <span className="font-bold text-[#0075de]">sai@growxlabs.tech</span>.</p>
            </div>
          </div>
          <button 
            onClick={fetchEmployees}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-[#31302e] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={13} /> Refresh Agents
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
                <div className="p-6 border border-[#e6e6e6] bg-white rounded-xl hover:shadow-md transition-all duration-200 group relative">
                  
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
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a39e98]">Legal &amp; Access Status</p>
                      
                      {/* Offer letter status */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { offerSent: !state.offerSent })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.offerSent ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {state.offerSent && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.offerSent ? "text-[#31302e] font-semibold" : "text-[#615d59]"}>Offer Contract Sent</span>
                      </div>

                      {/* Terms Acceptance Signature */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => toggleTermsAcceptance(emp, !!emp.accepted_terms)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${emp.accepted_terms ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {emp.accepted_terms && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={emp.accepted_terms ? "text-[#10b981] font-bold" : "text-[#615d59]"}>
                          Contract Signed {emp.accepted_terms && "✍️"}
                        </span>
                      </div>

                      {/* Access Credentials check */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { credentialsCreated: !state.credentialsCreated })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.credentialsCreated ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#e6e6e6] hover:border-neutral-400'}`}
                        >
                          {state.credentialsCreated && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.credentialsCreated ? "text-[#31302e] font-semibold" : "text-[#615d59]"}>Access Credentials Live</span>
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
                        className="w-full bg-[#0075de] hover:bg-[#005bab] text-white text-[10px] font-bold uppercase tracking-widest h-9 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Mail size={13} /> Send SDR Offer Email
                      </Button>
                    </div>
                  </div>

                  {/* Onboarding Checklist Details */}
                  <div className="mt-6 pt-5 border-t border-[#e6e6e6]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#615d59] mb-3">5-Day Ramp Training Checklist</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { key: "day1Checked" as const, label: "Day 1: Credentials" },
                        { key: "day2Checked" as const, label: "Day 2: Lead Lists" },
                        { key: "day3Checked" as const, label: "Day 3: Scripts" },
                        { key: "day4Checked" as const, label: "Day 4: Warm Dials" },
                        { key: "day5Checked" as const, label: "Day 5: Full Launch" }
                      ].map((day) => (
                        <label 
                          key={day.key}
                          className={cn(
                            "flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all select-none text-xs",
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
            <div className="h-64 flex flex-col items-center justify-center border border-[#e6e6e6] border-dashed rounded-xl bg-[#f6f5f4]/35">
              <AlertCircle className="text-[#a39e98] mb-3" size={32} />
              <p className="text-[#615d59] text-sm font-semibold">No SDR team members found</p>
              <p className="text-[#a39e98] text-xs mt-1">Add agents under the Team Management section first.</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Premium SDR Offer Letter Modal ── */}
      <AnimatePresence>
        {showEmailModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEmailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#e0e0e0]"
            >
              {/* Modal Top Bar */}
              <div className="shrink-0 bg-white border-b border-[#e6e6e6]">
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0075de] flex items-center justify-center text-white shadow-md shadow-[#0075de]/20">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#000] tracking-tight">
                        Legal SDR Offer Contract Composer
                      </h3>
                      <p className="text-xs text-[#777]">
                        Sending from <span className="font-bold text-[#0075de]">{senderEmail}</span> to <span className="font-bold text-[#222]">{selectedEmp.name}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="w-8 h-8 rounded-lg bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center text-[#777] hover:text-[#000] transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 px-6 pb-0">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-t-lg transition-all border-b-2",
                      activeTab === "preview"
                        ? "text-[#0075de] border-[#0075de] bg-[#0075de]/5 font-extrabold"
                        : "text-[#888] border-transparent hover:text-[#333]"
                    )}
                  >
                    <Eye size={14} /> Agreement Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={cn(
                      "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-t-lg transition-all border-b-2",
                      activeTab === "edit"
                        ? "text-[#0075de] border-[#0075de] bg-[#0075de]/5 font-extrabold"
                        : "text-[#888] border-transparent hover:text-[#333]"
                    )}
                  >
                    <Edit3 size={14} /> Customize Legal Contract Terms
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {activeTab === "preview" ? (
                  <div className="flex flex-col lg:flex-row min-h-full">
                    {/* Left: Info Sidebar */}
                    <div className="shrink-0 lg:w-[280px] bg-[#fafafa] border-b lg:border-b-0 lg:border-r border-[#e6e6e6] p-5 space-y-4">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#999]">Email Metadata</p>
                        
                        <div className="bg-white p-3 rounded-lg border border-[#e6e6e6] space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-[#aaa] uppercase block">Sender Account</span>
                            <span className="font-bold text-[#0075de]">{senderEmail}</span>
                          </div>
                          <div className="border-t border-[#eee] pt-2">
                            <span className="text-[10px] font-bold text-[#aaa] uppercase block">Recipient</span>
                            <span className="font-bold text-[#111]">{selectedEmp.name}</span>
                            <span className="text-[10px] text-[#777] block">{selectedEmp.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#999]">Legal Protections Included</p>
                        <ul className="text-[11px] text-[#555] space-y-1.5 font-medium">
                          <li className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 size={13} /> Strict NDA &amp; Confidentiality</li>
                          <li className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 size={13} /> Full IP Rights Assignment</li>
                          <li className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 size={13} /> 12-Month Non-Solicitation</li>
                          <li className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 size={13} /> Performance Commission Tiers</li>
                        </ul>
                      </div>
                    </div>

                    {/* Right: Contract Canvas */}
                    <div className="flex-1 p-6 bg-[#f4f4f4] overflow-y-auto">
                      <div className="bg-white rounded-xl border border-[#d5d5d5] shadow-lg max-w-[650px] mx-auto p-2">
                        <div dangerouslySetInnerHTML={{ __html: generateHTMLBody(selectedEmp.name, selectedEmp.email) }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT TAB */
                  <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                    {/* Sender Settings */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#0075de]">1. Email Sender Settings</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Sender Email (Dispatched via GrowX Mail)</label>
                          <input
                            type="text"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-bold text-[#0075de] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Offer Terms */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#0075de]">2. Legal Terms &amp; Commission Values</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold uppercase text-[#777]">Designation / Role Title</label>
                          <input
                            type="text"
                            value={roleTitle}
                            onChange={(e) => setRoleTitle(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Commission Rate</label>
                          <input
                            type="text"
                            value={commissionValue}
                            onChange={(e) => setCommissionValue(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Discovery Meeting Bonus</label>
                          <input
                            type="text"
                            value={incentiveValue}
                            onChange={(e) => setIncentiveValue(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Offer Date</label>
                          <input
                            type="date"
                            value={offerDate}
                            onChange={(e) => setOfferDate(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Joining Date</label>
                          <input
                            type="date"
                            value={joiningDate}
                            onChange={(e) => setJoiningDate(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Weekly Booked Meetings Target</label>
                          <input
                            type="text"
                            value={weeklyMeetingsTarget}
                            onChange={(e) => setWeeklyMeetingsTarget(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#777]">Monthly SQO Benchmark</label>
                          <input
                            type="text"
                            value={monthlySqoTarget}
                            onChange={(e) => setMonthlySqoTarget(e.target.value)}
                            className="w-full bg-[#fafafa] border border-[#e6e6e6] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 border-t border-[#e6e6e6] bg-[#fafafa] px-6 py-4 flex items-center justify-between">
                <p className="text-[11px] text-[#777] font-medium hidden sm:block">
                  📧 Sending via <strong className="text-[#0075de]">{senderEmail}</strong>
                </p>
                <div className="flex items-center gap-3 ml-auto">
                  <Button
                    onClick={() => setShowEmailModal(false)}
                    variant="outline"
                    className="border-[#ddd] text-[#777] hover:bg-[#f0f0f0] text-xs font-bold h-9 rounded-lg px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOnboardingEmail}
                    disabled={emailSending}
                    className="bg-[#0075de] hover:bg-[#005bab] text-white text-xs font-bold px-5 h-9 rounded-lg flex items-center gap-2 shadow-md shadow-[#0075de]/20 transition-all"
                  >
                    {emailSending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Dispatching Agreement…
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Send Contract via sai@growxlabs.tech
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
