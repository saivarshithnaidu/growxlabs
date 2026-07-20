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

  // Generate Formal 10-Page Fortune 500 Corporate Employment Contract PDF
  const generatePDFBase64 = async (): Promise<string | null> => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      const candidateName = selectedCandidate?.name || "Lakshmi Akhilesh P";

      const addHeader = (pageNo: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42); // #0F172A
        doc.text("GROWX LABS TECH PVT. LTD.", 45, 36);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`EMPLOYMENT AGREEMENT — REF: ${refNumber}`, width - 45, 36, { align: "right" });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(45, 44, width - 45, 44);
      };

      const addFooter = (pageNo: number) => {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(45, height - 44, width - 45, height - 44);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("STRICTLY CONFIDENTIAL", 45, height - 30);

        doc.setFont("helvetica", "normal");
        doc.text(`GROWX LABS TECH PVT. LTD. • Page ${pageNo} of 10`, width - 45, height - 30, { align: "right" });
      };

      // ═════════════════════════════════════════════════════════════
      // PAGE 1: TITLE PAGE & EXECUTIVE TRANSMITTAL LETTER
      // ═════════════════════════════════════════════════════════════
      
      // Corporate Letterhead
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text("GROWX LABS TECH PVT. LTD.", 45, 65);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("AI-NATIVE PRODUCT STUDIO & ENTERPRISE AI SOLUTIONS", 45, 80);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Andhra Pradesh, India • https://growxlabs.tech • contact@growxlabs.tech", 45, 94);

      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1.5);
      doc.line(45, 106, width - 45, 106);

      // Metadata Table
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(45, 120, width - 90, 48, 4, 4, "FD");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`CONTRACT REFERENCE:`, 55, 138);
      doc.setFont("helvetica", "normal");
      doc.text(refNumber, 175, 138);

      doc.setFont("helvetica", "bold");
      doc.text(`DATE OF ISSUANCE:`, 55, 154);
      doc.setFont("helvetica", "normal");
      doc.text(offerDate, 175, 154);

      doc.setFont("helvetica", "bold");
      doc.text(`TARGET COMMENCEMENT:`, 330, 138);
      doc.setFont("helvetica", "normal");
      doc.text(joiningDate, 460, 138);

      doc.setFont("helvetica", "bold");
      doc.text(`CLASSIFICATION:`, 330, 154);
      doc.setFont("helvetica", "normal");
      doc.text("CONFIDENTIAL CONTRACT", 460, 154);

      // Main Document Title
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("FORMAL OFFER OF EMPLOYMENT AND CONTRACT OF ENGAGEMENT", 45, 200);

      // Address Block
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("PREPARED FOR:", 45, 228);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Name: ${candidateName}`, 45, 243);
      doc.text(`Offered Position: ${roleTitle}`, 45, 257);
      doc.text(`Department: ${department}`, 45, 271);
      doc.text(`Engagement Model: ${employmentType}`, 45, 285);

      // Cover Letter Paragraphs
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Dear ${candidateName},`, 45, 320);

      const p1 = `On behalf of GrowX Labs Tech Pvt. Ltd. (the "Company"), we are pleased to extend this formal offer of engagement for the position of ${roleTitle}. Following our thorough review of your background and professional track record, we are confident in your ability to drive exceptional results for our outbound sales organization.`;
      doc.text(doc.splitTextToSize(p1, width - 90), 45, 338);

      const p2 = `This document, together with its appended Annexures, constitutes a binding legal agreement governing the terms of your engagement, remuneration structure, performance benchmarks, and confidentiality obligations. Please review all ten pages of this agreement carefully prior to execution.`;
      doc.text(doc.splitTextToSize(p2, width - 90), 45, 385);

      const p3 = `Should you accept the terms outlined herein, please sign and return the execution page (Page 10) on or before ${joiningDate}. This offer remains valid until 17:00 IST on ${joiningDate}.`;
      doc.text(doc.splitTextToSize(p3, width - 90), 45, 432);

      // Cover Letter Signature
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Sincerely,", 45, 485);
      doc.text("For GrowX Labs Tech Pvt. Ltd.", 45, 500);

      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(senderName, 45, 545);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Founder & Chief Executive Officer", 45, 560);
      doc.text("GrowX Labs Tech Pvt. Ltd.", 45, 574);

      addFooter(1);

      // ═════════════════════════════════════════════════════════════
      // PAGE 2: SECTION 1 — APPOINTMENT, SCOPE & PROBATION
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(2);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 1: APPOINTMENT, SCOPE OF DUTIES & PROBATION", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("1.1 Scope of Engagement", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t1_1 = `The Company hereby engages you, and you accept engagement with the Company, as a ${roleTitle} in the ${department} department. In this capacity, you shall perform all duties and exercise all powers consistent with your position as directed from time to time by the Chief Executive Officer or designated managers.`;
      doc.text(doc.splitTextToSize(t1_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("1.2 Reporting Line and Supervision", 45, 165);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t1_2 = `You shall report directly to the Founder & CEO or such other executive as the Company may designate. You agree to comply with all lawful directions, policies, procedures, and ethical standards enforced by the Company.`;
      doc.text(doc.splitTextToSize(t1_2, width - 90), 45, 179);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("1.3 Location and Remote Operational Protocol", 45, 222);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t1_3 = `This engagement is designated as a remote position. You are required to maintain a secure, professional working environment equipped with high-speed internet connectivity. Operational hours strictly align with Indian Standard Time (IST) business hours (09:00 IST to 18:00 IST), unless otherwise specified for international client outreach.`;
      doc.text(doc.splitTextToSize(t1_3, width - 90), 45, 236);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("1.4 Probationary Evaluation Window", 45, 288);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t1_4 = `Your engagement is subject to an initial ninety (90) calendar day probationary performance evaluation window commencing on ${joiningDate}. During this period, your performance, activity volume, meeting conversion rates, and adherence to company policies will be assessed. The Company reserves the right to extend the probation window or terminate the engagement during probation in accordance with Section 7.`;
      doc.text(doc.splitTextToSize(t1_4, width - 90), 45, 302);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("1.5 Verification of Credentials", 45, 362);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t1_5 = `This offer is contingent upon the successful verification of your identity, educational qualifications, prior employment references, and background checks. Any misrepresentation or omission of material facts shall constitute grounds for immediate cancellation of this offer.`;
      doc.text(doc.splitTextToSize(t1_5, width - 90), 45, 376);

      addFooter(2);

      // ═════════════════════════════════════════════════════════════
      // PAGE 3: SECTION 2 — REMUNERATION & COMMISSION SCHEME
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(3);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 2: REMUNERATION, COMMISSION & INCENTIVES", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("2.1 Remuneration Principles", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t2_1 = `Your total remuneration is structured under an independent performance contractor model. Compensation comprises a Revenue Commission Tier on converted contract value and a Qualified Discovery Call Bonus for validated sales meetings.`;
      doc.text(doc.splitTextToSize(t2_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("2.2 Commission Structure Overview Table", 45, 150);

      // Corporate Black & White Table
      const tY = 162;
      doc.setFillColor(15, 23, 42);
      doc.rect(45, tY, width - 90, 22, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("COMPENSATION ELEMENT", 55, tY + 14);
      doc.text("RATE / AMOUNT", 220, tY + 14);
      doc.text("ELIGIBILITY & PAYOUT SCHEDULE", 380, tY + 14);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(45, tY + 22, width - 90, 24, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Net Revenue Commission", 55, tY + 37);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(commissionRate, 220, tY + 37);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("Disbursed monthly upon net client realization", 380, tY + 37);

      doc.setFillColor(248, 250, 252);
      doc.rect(45, tY + 46, width - 90, 24, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Discovery Call Incentive", 55, tY + 61);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${meetingBonus} per qualified call`, 220, tY + 61);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("Disbursed bi-weekly for validated BANT calls", 380, tY + 61);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("2.3 Qualified Discovery Meeting Terms", 45, 255);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t2_3 = `A Discovery Meeting qualifies for incentive payout only when: (a) the prospect satisfies BANT criteria (Budget, Authority, Need, Timeline); (b) the prospect attends the scheduled meeting; and (c) a executive team member confirms meeting validation. Cancelled or no-show meetings do not qualify.`;
      doc.text(doc.splitTextToSize(t2_3, width - 90), 45, 269);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("2.4 Invoicing & Payout Protocol", 45, 325);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t2_4 = `Invoices for earned commissions and meeting bonuses must be submitted electronically by the 1st of each calendar month. Payments are processed within ten (10) business days following verification by the accounts department.`;
      doc.text(doc.splitTextToSize(t2_4, width - 90), 45, 339);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("2.5 Tax Withholding & Statutory Deductions", 45, 385);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t2_5 = `All payments made hereunder shall be subject to applicable tax deductions at source (TDS) under Indian income tax regulations. You are solely responsible for filing your tax returns and complying with personal tax liabilities.`;
      doc.text(doc.splitTextToSize(t2_5, width - 90), 45, 399);

      addFooter(3);

      // ═════════════════════════════════════════════════════════════
      // PAGE 4: SECTION 3 — KEY PERFORMANCE INDICATORS (KPIS)
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(4);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 3: KEY PERFORMANCE INDICATORS & AUDITS", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("3.1 Core Target Benchmarks", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t3_1 = `You are expected to maintain high activity volume and quality metrics consistent with enterprise sales standards. Your performance will be evaluated against the following mandatory benchmarks:`;
      doc.text(doc.splitTextToSize(t3_1, width - 90), 45, 112);

      // KPI Formal Table
      const kpiY = 142;
      doc.setFillColor(15, 23, 42);
      doc.rect(45, kpiY, width - 90, 22, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("PERFORMANCE CATEGORY", 55, kpiY + 14);
      doc.text("MANDATORY MINIMUM TARGET", 220, kpiY + 14);
      doc.text("EVALUATION INTERVAL", 400, kpiY + 14);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(45, kpiY + 22, width - 90, 24, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Daily Prospecting Volume", 55, kpiY + 37);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("40 Outbound Dials / 50 Personalised Emails", 220, kpiY + 37);
      doc.text("Daily Logged in CRM", 400, kpiY + 37);

      doc.setFillColor(248, 250, 252);
      doc.rect(45, kpiY + 46, width - 90, 24, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Weekly Discovery Meetings", 55, kpiY + 61);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("5 Qualified BANT Discovery Meetings Booked", 220, kpiY + 61);
      doc.text("Weekly Audit (Friday)", 400, kpiY + 61);

      doc.setFillColor(255, 255, 255);
      doc.rect(45, kpiY + 70, width - 90, 24, "FD");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Monthly Converted Deals", 55, kpiY + 85);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("3 Converted Partner Contracts (SQOs)", 220, kpiY + 85);
      doc.text("Monthly Review", 400, kpiY + 85);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("3.2 Performance Review and Audit Framework", 45, 280);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t3_2 = `The Company conducts bi-weekly activity reviews and monthly performance audits. Failure to meet at least 70% of targets for two consecutive evaluation periods may trigger a Performance Improvement Plan (PIP) or lead to contract termination.`;
      doc.text(doc.splitTextToSize(t3_2, width - 90), 45, 294);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("3.3 CRM Data Accuracy & Compliance", 45, 345);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t3_3 = `All calls, emails, lead notes, and meeting schedules must be accurately logged into the Company CRM system in real time. Failure to maintain accurate records shall result in forfeiture of incentive eligibility.`;
      doc.text(doc.splitTextToSize(t3_3, width - 90), 45, 359);

      addFooter(4);

      // ═════════════════════════════════════════════════════════════
      // PAGE 5: SECTION 4 — CONFIDENTIALITY & PROPRIETARY INFO (NDA)
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(5);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 4: CONFIDENTIALITY & NON-DISCLOSURE (NDA)", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("4.1 Definition of Proprietary Information", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t4_1 = `For purposes of this Agreement, "Confidential Information" shall include, without limitation, all technical data, trade secrets, research, product plans, client databases, lead lists, pricing models, software algorithms, sales scripts, workflows, and business strategies disclosed to you by the Company.`;
      doc.text(doc.splitTextToSize(t4_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("4.2 Non-Disclosure Obligations", 45, 170);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t4_2 = `You agree to hold all Confidential Information in strict confidence and shall not disclose, copy, publish, summarize, or distribute any portion thereof to any third party without the prior written consent of the Company. You shall use Confidential Information solely for performing your obligations under this Agreement.`;
      doc.text(doc.splitTextToSize(t4_2, width - 90), 45, 184);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("4.3 Protection of Lead Databases and Client Records", 45, 245);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t4_3 = `All prospect data, contact information, email lists, and CRM records generated or accessed during your engagement constitute exclusive proprietary property of the Company. Downloading, exporting, or transmitting client data to personal devices or unauthorized platforms is strictly prohibited.`;
      doc.text(doc.splitTextToSize(t4_3, width - 90), 45, 259);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("4.4 Survival of Obligations", 45, 320);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t4_4 = `Your confidentiality obligations under this Section 4 shall survive the termination of this Agreement for a period of five (5) years, provided that trade secrets and proprietary code shall remain confidential perpetually.`;
      doc.text(doc.splitTextToSize(t4_4, width - 90), 45, 334);

      addFooter(5);

      // ═════════════════════════════════════════════════════════════
      // PAGE 6: SECTION 5 — INTELLECTUAL PROPERTY ASSIGNMENT
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(6);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 5: INTELLECTUAL PROPERTY & INVENTIONS", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("5.1 Ownership of Work Product", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t5_1 = `You acknowledge and agree that all inventions, software code, algorithms, workflows, sales playbooks, graphics, designs, and written materials created or developed by you during your engagement with the Company ("Work Product") shall belong exclusively to the Company.`;
      doc.text(doc.splitTextToSize(t5_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("5.2 Assignment of Rights", 45, 170);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t5_2 = `You hereby irrevocably assign and transfer to the Company all worldwide right, title, and interest in and to the Work Product, including all copyrights, patents, trade secret rights, and other intellectual property rights associated therewith.`;
      doc.text(doc.splitTextToSize(t5_2, width - 90), 45, 184);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("5.3 Work Made for Hire", 45, 238);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t5_3 = `To the extent allowed by applicable law, all copyrightable Work Product created by you shall be deemed a "work made for hire" for the benefit of the Company.`;
      doc.text(doc.splitTextToSize(t5_3, width - 90), 45, 252);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("5.4 Further Assurances", 45, 292);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t5_4 = `You agree to execute all applications, assignments, and legal instruments required by the Company to register, perfect, and enforce its intellectual property rights in any jurisdiction.`;
      doc.text(doc.splitTextToSize(t5_4, width - 90), 45, 306);

      addFooter(6);

      // ═════════════════════════════════════════════════════════════
      // PAGE 7: SECTION 6 — NON-SOLICITATION & EXCLUSIVITY
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(7);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 6: NON-SOLICITATION & EXCLUSIVITY", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("6.1 Non-Solicitation of Clients and Partners", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t6_1 = `During your engagement and for a period of twelve (12) months following termination of this Agreement, you shall not, directly or indirectly, solicit, divert, or attempt to solicit business from any client, partner, or active lead of the Company.`;
      doc.text(doc.splitTextToSize(t6_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("6.2 Non-Solicitation of Personnel and Contractors", 45, 168);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t6_2 = `During your engagement and for twelve (12) months thereafter, you shall not induce, entice, or solicit any employee, contractor, or officer of the Company to terminate their employment or contractual relationship with the Company.`;
      doc.text(doc.splitTextToSize(t6_2, width - 90), 45, 182);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("6.3 Exclusivity of Engagement", 45, 238);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t6_3 = `During your engagement, you agree not to render sales outreach or business development services to any direct competitor of the Company without express written authorization from the Chief Executive Officer.`;
      doc.text(doc.splitTextToSize(t6_3, width - 90), 45, 252);

      addFooter(7);

      // ═════════════════════════════════════════════════════════════
      // PAGE 8: SECTION 7 — TERMINATION & NOTICE PERIOD
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(8);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 7: TERMINATION & NOTICE PERIOD", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("7.1 Termination for Convenience", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t7_1 = `Either party may terminate this Agreement without cause by providing fourteen (14) calendar days' written notice to the other party. Compensation earned prior to the effective termination date shall be paid in accordance with Section 2.`;
      doc.text(doc.splitTextToSize(t7_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("7.2 Termination for Cause", 45, 162);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t7_2 = `The Company reserves the right to terminate this Agreement immediately for cause upon written notice. Cause includes, but is not limited to: (a) breach of confidentiality; (b) fraud or dishonesty; (c) gross negligence; or (d) persistent failure to perform duties.`;
      doc.text(doc.splitTextToSize(t7_2, width - 90), 45, 176);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("7.3 Post-Termination Obligations", 45, 232);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t7_3 = `Upon termination, you shall immediately return to the Company all materials, lead lists, documents, login credentials, and property belonging to the Company.`;
      doc.text(doc.splitTextToSize(t7_3, width - 90), 45, 246);

      addFooter(8);

      // ═════════════════════════════════════════════════════════════
      // PAGE 9: SECTION 8 — GOVERNING LAW & JURISDICTION
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(9);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 8: GOVERNING LAW & GENERAL PROVISIONS", 45, 75);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text("8.1 Governing Law", 45, 98);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t8_1 = `This Agreement shall be governed by, construed, and enforced in accordance with the laws of the Republic of India, without regard to its conflict of laws rules.`;
      doc.text(doc.splitTextToSize(t8_1, width - 90), 45, 112);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("8.2 Dispute Resolution and Jurisdiction", 45, 155);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t8_2 = `Any dispute, controversy, or claim arising out of or relating to this Agreement shall be submitted to the exclusive jurisdiction of the competent courts located in Visakhapatnam, Andhra Pradesh, India.`;
      doc.text(doc.splitTextToSize(t8_2, width - 90), 45, 169);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("8.3 Severability & Entire Agreement", 45, 218);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const t8_3 = `If any provision of this Agreement is held invalid, the remaining provisions shall continue in full force. This Agreement contains the entire understanding of the parties regarding its subject matter.`;
      doc.text(doc.splitTextToSize(t8_3, width - 90), 45, 232);

      addFooter(9);

      // ═════════════════════════════════════════════════════════════
      // PAGE 10: EXECUTION & ANNEXURES
      // ═════════════════════════════════════════════════════════════
      doc.addPage();
      addHeader(10);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SECTION 9: COUNTERPART EXECUTION & ANNEXURES", 45, 75);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text("IN WITNESS WHEREOF, the parties hereto have executed this Agreement on the date set forth below.", 45, 95);

      // Counterpart Signature Boxes
      const sigY = 118;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(45, sigY, 240, 90, 4, 4, "FD");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("FOR GROWX LABS TECH PVT. LTD.", 55, sigY + 20);
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(senderName, 55, sigY + 45);
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Founder & Chief Executive Officer", 55, sigY + 60);
      doc.text(`Date: ${offerDate}`, 55, sigY + 74);

      doc.roundedRect(width - 285, sigY, 240, 90, 4, 4, "FD");
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("CANDIDATE ACCEPTANCE", width - 275, sigY + 20);
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(candidateName, width - 275, sigY + 45);
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Signature: ______________________", width - 275, sigY + 60);
      doc.text("Date: _________________________", width - 275, sigY + 74);

      // Annexure A Section
      const annY = sigY + 115;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("ANNEXURE A: COMMISSION TIERS & MILESTONE SCHEDULE", 45, annY);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("• Base Quota (1–3 SQOs): 10% Net Contract Revenue Commission", 55, annY + 18);
      doc.text("• High Performer (4–6 SQOs): 12.5% Net Contract Revenue Commission", 55, annY + 32);
      doc.text("• President's Club (7+ SQOs): 15% Net Contract Revenue + INR 10,000 Milestone Bonus", 55, annY + 46);

      // Annexure B Section
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("ANNEXURE B: INFORMATION SECURITY & CODE OF CONDUCT", 45, annY + 75);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("• All sales outreach must comply with anti-spam laws (CAN-SPAM / GDPR / IT Act 2000).", 55, annY + 93);
      doc.text("• Misrepresentation of company capabilities or unauthorized pricing discounts is prohibited.", 55, annY + 107);

      addFooter(10);

      const dataUri = doc.output("datauristring");
      const base64 = dataUri.split(",")[1];
      return base64 || null;
    } catch (err) {
      console.error("10-Page Corporate PDF generation error:", err);
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
              className="px-4 py-2 !bg-[#F1F5F9] hover:!bg-[#E2E8F0] !text-[#0F172A] text-xs font-bold rounded-xl border border-[#CBD5E1] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer size={14} className="!text-[#0F172A]" /> Preview PDF
            </button>
            <button
              onClick={() => setShowEmailDrawer(true)}
              className="px-5 py-2 !bg-[#0075DE] hover:!bg-[#005BAB] !text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send size={14} className="!text-white" /> Email PDF Offer
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
