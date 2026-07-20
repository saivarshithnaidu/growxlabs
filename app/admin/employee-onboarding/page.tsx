"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, FileText, CheckCircle2, ShieldCheck, Mail, Send, 
  Printer, Sparkles, User, Calendar, Award, Lock, ChevronDown, 
  ArrowRight, Download, Check, AlertCircle, RefreshCw, X, Building2, Phone, Briefcase, Clock, Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OnboardingState {
  offerSent: boolean;
  credentialsCreated: boolean;
  day1Checked: boolean;
  day2Checked: boolean;
  day3Checked: boolean;
  day4Checked: boolean;
  day5Checked: boolean;
}

export default function DedicatedOfferLetterStudioPage() {
  // Candidate Selection & Data State
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form & Contract Details
  const [roleTitle, setRoleTitle] = useState("Sales Development Representative (SDR)");
  const [department, setDepartment] = useState("Sales & Business Development");
  const [joiningDate, setJoiningDate] = useState("20 July 2026");
  const [offerDate, setOfferDate] = useState("20 July 2026");
  const [refNumber, setRefNumber] = useState(`GXL/HR/OFFER/SDR/${new Date().getFullYear()}/001`);
  const [commissionRate, setCommissionRate] = useState("10% to 15%");
  const [meetingBonus, setMeetingBonus] = useState("₹1,000");
  const [employmentType, setEmploymentType] = useState("Independent Contractor / Performance-Based");
  
  // Sender Credentials (STRICT)
  const [senderName, setSenderName] = useState("Sai Varshith");
  const [senderEmail, setSenderEmail] = useState("sai@growxlabs.tech");
  const [bccEmail, setBccEmail] = useState("saivarshith8284@gmail.com");

  // Email Drawer & Collapsible State
  const [showEmailDrawer, setShowEmailDrawer] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [expandedAnnexure, setExpandedAnnexure] = useState<string | null>("annexure-a");

  // Ref to the document DOM node for PDF capture
  const documentCanvasRef = useRef<HTMLDivElement>(null);

  // Pre-flight Hiring Checklist (6/6)
  const [checklist, setChecklist] = useState({
    candidateVerified: true,
    emailVerified: true,
    compReviewed: true,
    ndaAttached: true,
    commissionAttached: true,
    founderApproved: true,
  });

  const checklistCount = Object.values(checklist).filter(Boolean).length;

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const [teamRes, careerRes] = await Promise.all([
        fetch(`/api/admin/team?t=${Date.now()}`),
        fetch(`/api/careers?t=${Date.now()}`)
      ]);
      const teamData = await teamRes.json();
      const careerData = await careerRes.json();

      const teamList = teamData.team || [];
      const careerList = careerData.applications || [];

      const list = teamList
        .filter((m: any) => m.role === "crm_agent" || m.role === "agent")
        .map((m: any) => ({
          id: m.id,
          name: m.name || "Lakshmi Akhilesh P",
          email: m.email || "akhilesh@growxlabs.tech",
          phone: m.phone || "+91 98765 43210",
          role: "Sales Development Representative (SDR)",
          status: "Verified"
        }));

      careerList.forEach((app: any) => {
        if (!list.find((c: any) => c.email?.toLowerCase() === app.email?.toLowerCase())) {
          list.push({
            id: app.id || `app-${app.email}`,
            name: app.name,
            email: app.email,
            phone: app.phone || "+91 98765 43210",
            role: app.role || "Job Applicant",
            status: "Applicant"
          });
        }
      });

      // Default candidate
      if (!list.find((c: any) => c.email === "akhilesh@growxlabs.tech")) {
        list.unshift({
          id: "akhilesh-sdr-001",
          name: "Lakshmi Akhilesh P",
          email: "akhilesh@growxlabs.tech",
          phone: "+91 98765 43210",
          role: "Sales Development Representative (SDR)",
          status: "Verified"
        });
      }

      setCandidates(list);
      setSelectedCandidate(list[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const candidateFirstName = selectedCandidate?.name 
    ? selectedCandidate.name.split(' ')[0] 
    : "Akhilesh";
  
  const pdfFilename = `Offer_Letter_${candidateFirstName}.pdf`;

  const handlePrintPDF = () => {
    window.print();
  };

  // Generate Base64 PDF Attachment from Document Canvas
  const generatePDFBase64 = async (): Promise<string | null> => {
    if (!documentCanvasRef.current) return null;
    try {
      const canvas = await html2canvas(documentCanvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const dataUri = pdf.output("datauristring");
      return dataUri.split(",")[1] || null;
    } catch (err) {
      console.error("PDF generation failed:", err);
      return null;
    }
  };

  // Dispatch Offer via Email with Attached PDF Contract
  const handleDispatchOffer = async () => {
    if (!selectedCandidate) return;

    setEmailSending(true);

    try {
      // 1. Generate PDF attachment
      const pdfBase64 = await generatePDFBase64();
      
      const attachments = pdfBase64 ? [{
        filename: pdfFilename,
        content: pdfBase64
      }] : undefined;

      // 2. Dispatch email notification with PDF attached
      const res = await fetch("/api/send-email/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: selectedCandidate.email,
          fromName: `${senderName} | GrowX Labs`,
          fromEmail: senderEmail,
          bccEmail: bccEmail,
          subject: `Offer of Engagement – Sales Development Representative (SDR) | GrowX Labs Tech Pvt. Ltd.`,
          html: generateEmailCoverHTML(),
          attachments: attachments,
          body: `Dear ${selectedCandidate.name},\n\nPlease find attached your official Offer Letter (PDF) for the position of Sales Development Representative (SDR) at GrowX Labs Tech Pvt. Ltd.`
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Email delivery failed");

      alert(`🎉 Offer Letter PDF (${pdfFilename}) successfully sent to ${selectedCandidate.name} (${selectedCandidate.email})! BCC copy sent to ${bccEmail}.`);
      setShowEmailDrawer(false);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setEmailSending(false);
    }
  };

  // Clean ATS Cover Email Notification (NO embedded contract)
  const generateEmailCoverHTML = () => {
    const name = selectedCandidate?.name || "Akhilesh";

    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #111827; line-height: 1.6; padding: 36px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <p style="font-size: 14px; margin-bottom: 16px; font-weight: 600; color: #111827;">Dear ${name},</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 16px;">Congratulations.</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 16px;">Following our recent discussions, we are pleased to extend an offer for the position of <strong>Sales Development Representative (SDR)</strong> at GrowX Labs Tech Pvt. Ltd.</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 16px;">Please find your official Offer Letter attached as a PDF (<strong>${pdfFilename}</strong>).</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 16px;">Kindly review the document carefully, including the engagement terms, responsibilities, confidentiality obligations, and commission structure.</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 16px;">If you accept the offer, please sign and return the attached document or follow the acceptance instructions included within it.</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 24px;">Should you have any questions, feel free to reply to this email.</p>
        <p style="font-size: 13px; color: #374151; margin-bottom: 24px;">We look forward to welcoming you to GrowX Labs.</p>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 13px;">
          <p style="margin: 0; font-weight: 800; color: #111827;">Regards,</p>
          <p style="margin: 4px 0 0 0; font-weight: 800; color: #111827;">Sai Varshith</p>
          <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 12px;">Founder &amp; CEO</p>
          <p style="margin: 2px 0 0 0; color: #2563eb; font-size: 12px; font-weight: 600;">GrowX Labs Tech Pvt. Ltd.</p>
          <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 12px;">https://growxlabs.tech</p>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#111827] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#6B7280]">Loading Offer Studio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111827] font-sans antialiased pb-20">
      
      {/* ── BREADCRUMB NAV ── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
          <span className="hover:text-[#111827] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight size={12} />
          <span className="hover:text-[#111827] cursor-pointer transition-colors">Recruitment</span>
          <ChevronRight size={12} />
          <span className="text-[#111827] font-semibold">Offer Letter Studio</span>
        </div>
      </div>

      {/* ── TOP HEADER & ACTION BAR ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Offer Letter Studio</h1>
            <p className="text-xs text-[#6B7280]">
              Review contract materials and dispatch official PDF offer letter to candidate.
            </p>
          </div>

          {/* Metadata Chips Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Candidate Selector */}
            <div className="relative">
              <select
                value={selectedCandidate?.id}
                onChange={(e) => {
                  const found = candidates.find(c => c.id === e.target.value);
                  if (found) setSelectedCandidate(found);
                }}
                className="bg-[#F7F7F5] border border-[#E5E7EB] text-[#111827] text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none cursor-pointer pr-7 appearance-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-[#6B7280] pointer-events-none" />
            </div>

            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Candidate
            </span>

            <span className="px-2.5 py-1 bg-slate-100 text-[#111827] border border-[#E5E7EB] text-[11px] font-medium rounded-lg">
              Ref: <span className="font-mono font-bold">{refNumber}</span>
            </span>

            <span className="px-2.5 py-1 bg-slate-100 text-[#111827] border border-[#E5E7EB] text-[11px] font-medium rounded-lg">
              Joining: <span className="font-bold">{joiningDate}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-[#F7F7F5] hover:bg-slate-200 text-[#111827] text-xs font-semibold rounded-xl border border-[#E5E7EB] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} /> Preview PDF
            </button>
            <button
              onClick={() => setShowEmailDrawer(true)}
              className="px-5 py-2 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send size={14} /> Email PDF Offer
            </button>
          </div>
        </div>
      </div>

      {/* ── SPLIT PAGE CONTAINER (30% LEFT / 70% RIGHT) ── */}
      <div className="max-w-[1400px] mx-auto px-6 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ═══ LEFT PANEL (30% = 4 COLS) ═══ */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Candidate Profile Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#111827] text-white flex items-center justify-center text-base font-bold shadow-sm">
                {selectedCandidate?.name ? selectedCandidate.name.charAt(0) : "A"}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#111827]">{selectedCandidate?.name}</h3>
                <p className="text-xs text-[#6B7280] font-medium">{roleTitle}</p>
                <span className="inline-block text-[10px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded">
                  {department}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5 text-xs text-[#4B5563]">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Email:</span>
                <span className="font-semibold text-[#111827] text-[11px] truncate max-w-[170px]">{selectedCandidate?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Phone:</span>
                <span className="font-semibold text-[#111827]">{selectedCandidate?.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Joining Date:</span>
                <span className="font-semibold text-emerald-600">{joiningDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Engagement:</span>
                <span className="font-semibold text-[#111827]">Commission Contractor</span>
              </div>
            </div>
          </div>

          {/* Hiring Pre-Flight Checklist */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Hiring Checklist</h4>
              <span className="text-xs font-extrabold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full">
                {checklistCount}/6 Done
              </span>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full bg-[#F7F7F5] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div 
                className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                style={{ width: `${(checklistCount / 6) * 100}%` }}
              />
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: "candidateVerified" as const, label: "Candidate Identity Verified" },
                { key: "emailVerified" as const, label: "Work Email Verified" },
                { key: "compReviewed" as const, label: "Commission Model Reviewed" },
                { key: "ndaAttached" as const, label: "12-Month NDA Attached" },
                { key: "commissionAttached" as const, label: "Annexure A Included" },
                { key: "founderApproved" as const, label: "Founder Signoff Completed" },
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-center gap-2.5 p-2 hover:bg-[#F7F7F5] rounded-lg cursor-pointer transition-colors select-none"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span className={checklist[item.key] ? "text-[#111827] font-semibold" : "text-[#6B7280]"}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Document Activity</h4>
            <div className="space-y-3 text-xs text-[#4B5563]">
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#111827]">Document Draft Created</p>
                  <p className="text-[10px] text-[#6B7280]">By Sai Varshith • Today 11:45 AM</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#111827]">Sender &amp; BCC Verified</p>
                  <p className="text-[10px] text-[#6B7280]">sai@growxlabs.tech • saivarshith8284@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#111827]">Legal Clauses Validated</p>
                  <p className="text-[10px] text-[#6B7280]">14 Sections + 3 Annexures ready</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ═══ RIGHT PANEL (70% = 8 COLS) — NOTION-STYLE DOCUMENT CANVAS ═══ */}
        <div className="lg:col-span-8 flex justify-center">
          <div 
            ref={documentCanvasRef}
            id="offer-letter-canvas"
            className="w-full max-w-[840px] bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8 sm:p-12 space-y-8"
          >
            
            {/* Notion Header */}
            <div className="border-b border-[#E5E7EB] pb-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-[#111827] tracking-tight">GROWX LABS TECH PVT. LTD.</h2>
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mt-0.5">
                    AI-Native Product Studio &amp; Enterprise AI Solutions
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    Andhra Pradesh, India • https://growxlabs.tech
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-[#111827] text-white rounded-md">
                    CONFIDENTIAL CONTRACT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#374151]">
                <div><span className="text-[#6B7280]">REF:</span> <strong className="font-mono text-[#111827]">{refNumber}</strong></div>
                <div><span className="text-[#6B7280]">OFFER DATE:</span> <strong className="text-[#111827]">{offerDate}</strong></div>
                <div className="text-right"><span className="text-[#6B7280]">JOINING:</span> <strong className="text-[#2563EB]">{joiningDate}</strong></div>
              </div>
            </div>

            {/* Letter Greeting */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111827]">
                Offer of Engagement: {roleTitle}
              </h3>
              <p className="text-xs text-[#374151] leading-relaxed">
                Dear <strong>{selectedCandidate?.name || "Akhilesh"}</strong>,
              </p>
              <p className="text-xs text-[#374151] leading-relaxed">
                On behalf of <strong>GrowX Labs Tech Pvt. Ltd.</strong>, we are pleased to offer you the position of <strong>{roleTitle}</strong>. We were thoroughly impressed by your sales drive and execution background during our discussions. This document sets out the core terms of your engagement with our team.
              </p>
            </div>

            {/* 01 Appointment */}
            <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">01. Appointment &amp; Engagement Model</h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                You will serve as an <strong>{employmentType}</strong>. Your engagement commences on <strong>{joiningDate}</strong> with an initial 90-day performance review window. Work is fully remote, adhering to Indian Standard Time (IST) operational hours.
              </p>
            </div>

            {/* 02 Compensation (Stripe Settings Style Cards) */}
            <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">02. Pay &amp; Remuneration Structure</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#6B7280]">Revenue Commission</p>
                  <p className="text-base font-extrabold text-[#2563EB]">{commissionRate}</p>
                  <p className="text-[11px] text-[#4B5563]">Paid on net contract revenue from converted partner deals.</p>
                </div>

                <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#6B7280]">Discovery Meeting Incentive</p>
                  <p className="text-base font-extrabold text-emerald-600">{meetingBonus}</p>
                  <p className="text-[11px] text-[#4B5563]">Earned per qualified BANT discovery meeting conducted.</p>
                </div>
              </div>
            </div>

            {/* 03 & 04 Responsibilities & KPIs Grid */}
            <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">03 &amp; 04. Responsibilities &amp; Target Benchmarks</h4>
              <p className="text-xs text-[#4B5563]">
                Your primary focus is outbound prospecting, qualified outreach, cold email sequencing, and scheduling discovery calls.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 text-center space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#6B7280]">Daily Activity</p>
                  <p className="text-xs font-bold text-[#111827]">40 Dials / 50 Emails</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 text-center space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#6B7280]">Weekly Target</p>
                  <p className="text-xs font-extrabold text-[#2563EB]">5 Meetings Booked</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 text-center space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#6B7280]">Monthly Goal</p>
                  <p className="text-xs font-extrabold text-emerald-600">3 Qualified Deals</p>
                </div>
              </div>
            </div>

            {/* 05–13 Legal Clauses Summary */}
            <div className="space-y-2 pt-2 border-t border-[#E5E7EB] text-xs text-[#4B5563] leading-relaxed">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">05–13. Legal Protections &amp; Terms</h4>
              <p><strong>05 Confidentiality:</strong> You agree to hold all company lead lists, pricing, and client data strictly confidential.</p>
              <p><strong>06 Intellectual Property:</strong> All materials, workflows, and sales playbooks created belong exclusively to GrowX Labs Tech Pvt. Ltd.</p>
              <p><strong>07 Non-Solicitation:</strong> 12-month restriction on soliciting company clients or team members post-termination.</p>
              <p><strong>08 Termination:</strong> Either party may terminate with 14 days' written notice.</p>
              <p><strong>09 Governing Law:</strong> Governed by laws of India, under exclusive jurisdiction of Visakhapatnam courts.</p>
            </div>

            {/* Annexures (Collapsible Notion-style) */}
            <div className="pt-2 border-t border-[#E5E7EB] space-y-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Annexures</h4>

              {/* Annexure A */}
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedAnnexure(expandedAnnexure === "annexure-a" ? null : "annexure-a")}
                  className="w-full bg-[#F7F7F5] px-4 py-3 text-left font-bold text-xs text-[#111827] flex items-center justify-between cursor-pointer"
                >
                  <span>Annexure A: Commission Tiers &amp; Incentives</span>
                  <ChevronDown size={14} className={cn("transition-transform", expandedAnnexure === "annexure-a" ? "rotate-180" : "")} />
                </button>
                {expandedAnnexure === "annexure-a" && (
                  <div className="p-4 text-xs text-[#4B5563] space-y-2 bg-white border-t border-[#E5E7EB]">
                    <p>• Base Quota (1–3 SQOs): 10% Net Revenue Commission</p>
                    <p>• High Performer (4–6 SQOs): 12.5% Net Revenue Commission</p>
                    <p>• President's Club (7+ SQOs): 15% Net Revenue Commission + ₹10,000 Milestone Bonus</p>
                  </div>
                )}
              </div>

              {/* Annexure B */}
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedAnnexure(expandedAnnexure === "annexure-b" ? null : "annexure-b")}
                  className="w-full bg-[#F7F7F5] px-4 py-3 text-left font-bold text-xs text-[#111827] flex items-center justify-between cursor-pointer"
                >
                  <span>Annexure B: Code of Conduct &amp; Ethical Sales</span>
                  <ChevronDown size={14} className={cn("transition-transform", expandedAnnexure === "annexure-b" ? "rotate-180" : "")} />
                </button>
                {expandedAnnexure === "annexure-b" && (
                  <div className="p-4 text-xs text-[#4B5563] space-y-2 bg-white border-t border-[#E5E7EB]">
                    <p>Aggressive sales tactics or false pricing commitments are strictly prohibited.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t-2 border-[#111827]">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">14. Signatures &amp; Acceptance</h4>

              <div className="grid grid-cols-2 gap-6 text-xs text-[#111827]">
                <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 space-y-1">
                  <p className="font-bold uppercase text-[10px] text-[#6B7280]">For GrowX Labs Tech Pvt. Ltd.</p>
                  <p className="font-extrabold text-[#2563EB] pt-2">{senderName}</p>
                  <p className="text-[10px] text-[#6B7280]">Founder &amp; CEO</p>
                  <p className="text-[10px] text-[#6B7280]">Email: {senderEmail}</p>
                </div>

                <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 space-y-1">
                  <p className="font-bold uppercase text-[10px] text-[#6B7280]">Candidate Acceptance</p>
                  <p className="font-extrabold text-[#111827]">{selectedCandidate?.name || "Akhilesh"}</p>
                  <p className="text-[10px] text-[#6B7280]">Date: ________________</p>
                  <p className="text-[10px] text-[#6B7280]">Signature: ________________</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-[#E5E7EB] text-center text-[10px] text-[#6B7280]">
              CONFIDENTIAL • Generated by GrowX Labs HR Platform • Page 1 of 1
            </div>

          </div>
        </div>

      </div>

      {/* ── EMAIL PREVIEW DRAWER (SLIDE-OVER FROM RIGHT — GMAIL ATS STYLE) ── */}
      <AnimatePresence>
        {showEmailDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setShowEmailDrawer(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-[#E5E7EB] flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F5]">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[#2563EB]" />
                  <h3 className="font-bold text-sm text-[#111827]">Email Notification Preview (Gmail ATS Style)</h3>
                </div>
                <button
                  onClick={() => setShowEmailDrawer(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content — Clean ATS Email Notification Only */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#374151]">
                <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
                  <div><span className="text-[#6B7280] font-medium">From:</span> <strong className="text-[#111827]">{senderName} &lt;{senderEmail}&gt;</strong></div>
                  <div><span className="text-[#6B7280] font-medium">To:</span> <strong className="text-[#2563EB]">{selectedCandidate?.name} &lt;{selectedCandidate?.email}&gt;</strong></div>
                  <div><span className="text-[#6B7280] font-medium">BCC:</span> <strong className="text-[#111827]">{bccEmail}</strong></div>
                  <div><span className="text-[#6B7280] font-medium">Subject:</span> <strong className="text-[#111827]">Offer of Engagement – Sales Development Representative (SDR) | GrowX Labs Tech Pvt. Ltd.</strong></div>
                </div>

                {/* Email Body Notification Text */}
                <div className="border border-[#E5E7EB] rounded-xl p-5 bg-white shadow-xs space-y-4 leading-relaxed text-[#374151]">
                  <p className="font-semibold text-[#111827]">Dear {selectedCandidate?.name},</p>
                  <p>Congratulations.</p>
                  <p>Following our recent discussions, we are pleased to extend an offer for the position of <strong>Sales Development Representative (SDR)</strong> at GrowX Labs Tech Pvt. Ltd.</p>
                  <p>Please find your official Offer Letter attached as a PDF (<strong>{pdfFilename}</strong>).</p>
                  <p>Kindly review the document carefully, including the engagement terms, responsibilities, confidentiality obligations, and commission structure.</p>
                  <p>If you accept the offer, please sign and return the attached document or follow the acceptance instructions included within it.</p>
                  <p>Should you have any questions, feel free to reply to this email.</p>
                  <p>We look forward to welcoming you to GrowX Labs.</p>
                  
                  <div className="pt-3 border-t border-[#E5E7EB] text-xs">
                    <p className="font-bold text-[#111827]">Regards,</p>
                    <p className="font-bold text-[#111827]">Sai Varshith</p>
                    <p className="text-[#6B7280]">Founder &amp; CEO</p>
                    <p className="text-[#2563EB] font-medium">GrowX Labs Tech Pvt. Ltd.</p>
                    <p className="text-[#6B7280]">https://growxlabs.tech</p>
                  </div>
                </div>

                {/* Attached PDF Pill */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-[#2563EB]">
                  <div className="flex items-center gap-2 font-semibold">
                    <Paperclip size={16} />
                    <span>{pdfFilename}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700">
                    PDF Attachment
                  </span>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-[#E5E7EB] bg-[#F7F7F5] flex items-center justify-between">
                <button
                  onClick={() => setShowEmailDrawer(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  Back to Studio
                </button>
                <button
                  onClick={handleDispatchOffer}
                  disabled={emailSending}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {emailSending ? "Generating PDF & Dispatching…" : `Confirm & Send ${pdfFilename}`}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
