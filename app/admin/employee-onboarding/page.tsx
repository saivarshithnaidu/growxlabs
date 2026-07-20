"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, User, Mail, RefreshCw, Send, Eye, Edit3, CheckCircle2, AlertCircle, Phone, Award, ShieldCheck, FileText, Download, Printer, Check, AlertTriangle, Lock } from "lucide-react";
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
  
  // Strict Candidate & Sender Details Required
  const [candidateName, setCandidateName] = useState("Akhilesh");
  const [candidateEmail, setCandidateEmail] = useState("akhilesh@growxlabs.tech");
  const [senderName, setSenderName] = useState("Sai Varshith");
  const [senderEmail, setSenderEmail] = useState("saivarshith8284@gmail.com"); // MANDATORY SENDER
  const [emailSubject, setEmailSubject] = useState("Formal Employment Offer: Sales Development Representative (SDR) - GrowX Labs Tech Pvt. Ltd.");

  // Mandatory Offer Terms
  const [roleTitle, setRoleTitle] = useState("Sales Development Representative (SDR)");
  const [incentiveValue, setIncentiveValue] = useState("₹1,000");
  const [commissionValue, setCommissionValue] = useState("10% to 15%");
  const [durationValue, setDurationValue] = useState("Independent Contractor / Performance-Based");
  const [offerDate, setOfferDate] = useState("20 July 2026");
  const [joiningDate, setJoiningDate] = useState("20 July 2026"); // MANDATORY JOINING DATE
  const [weeklyMeetingsTarget, setWeeklyMeetingsTarget] = useState("5");
  const [monthlySqoTarget, setMonthlySqoTarget] = useState("3");
  const [refNumber, setRefNumber] = useState(`GXL/HR/OFFER/SDR/${new Date().getFullYear()}/001`);
  
  // Progress & Validation States
  const [emailSending, setEmailSending] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

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
      
      // Ensure Akhilesh exists in list for seamless selection
      if (!agents.find((a: any) => a.email === "akhilesh@growxlabs.tech")) {
        agents.unshift({
          id: "akhilesh-sdr-001",
          name: "Akhilesh",
          email: "akhilesh@growxlabs.tech",
          phone: "+91 98765 43210",
          role: "crm_agent",
          accepted_terms: false
        });
      }

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

  // ── Validation Pre-flight Checklist ──
  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!candidateName.trim()) {
      errors.push("Candidate Name is required.");
    }
    if (!candidateEmail.trim() || !candidateEmail.includes("@")) {
      errors.push("Valid Candidate Email (akhilesh@growxlabs.tech) is required.");
    }
    if (senderEmail.trim().toLowerCase() !== "saivarshith8284@gmail.com") {
      errors.push("Sender Email MUST be saivarshith8284@gmail.com.");
    }
    if (joiningDate.trim() !== "20 July 2026" && joiningDate.trim() !== "2026-07-20") {
      errors.push("Joining Date MUST be set to 20 July 2026 (Today).");
    }
    if (!roleTitle.trim()) {
      errors.push("Role / Designation Title is required.");
    }
    if (!commissionValue.trim()) {
      errors.push("Commission Percentage is required.");
    }
    if (!incentiveValue.trim()) {
      errors.push("Meeting Incentive Bonus is required.");
    }
    if (!refNumber.trim()) {
      errors.push("Document Reference Number is required.");
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  // ── Enterprise Corporate Offer Letter & Agreement HTML Renderer ──
  const generateHTMLBody = (name: string, email: string) => {
    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; background-color: #ffffff; color: #0f172a; line-height: 1.6; padding: 48px 44px; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); position: relative;">
        
        <!-- Watermark -->
        <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 72px; font-weight: 900; color: rgba(15, 23, 42, 0.03); letter-spacing: 12px; pointer-events: none; text-transform: uppercase; white-space: nowrap;">
          STRICTLY CONFIDENTIAL
        </div>

        <!-- Corporate Top Header -->
        <table style="width: 100%; border-bottom: 3px solid #0075de; padding-bottom: 20px; margin-bottom: 24px;">
          <tr>
            <td style="vertical-align: middle;">
              <h1 style="font-size: 24px; font-weight: 900; color: #0075de; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">
                GROWX LABS TECH PVT. LTD.
              </h1>
              <p style="font-size: 11px; font-weight: 800; color: #1e3a8a; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">
                AI-Native Product Studio &amp; Enterprise AI Solutions
              </p>
              <p style="font-size: 10px; color: #64748b; margin: 3px 0 0 0;">
                Visakhapatnam, Andhra Pradesh, India &nbsp;|&nbsp; https://growxlabs.tech &nbsp;|&nbsp; contact@growxlabs.tech
              </p>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                OFFICIAL OFFER AGREEMENT
              </div>
            </td>
          </tr>
        </table>

        <!-- Document Reference Bar -->
        <table style="width: 100%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 28px; font-size: 11px; color: #334155;">
          <tr>
            <td><strong>REF NO:</strong> <span style="font-family: monospace; font-weight: 700; color: #0f172a;">${refNumber}</span></td>
            <td><strong>OFFER DATE:</strong> <span style="font-weight: 700; color: #0f172a;">${offerDate}</span></td>
            <td style="text-align: right;"><strong>STATUS:</strong> <span style="color: #0075de; font-weight: 800;">CONFIDENTIAL / EXCLUSIVE</span></td>
          </tr>
        </table>

        <!-- Document Title -->
        <div style="text-align: center; margin-bottom: 28px;">
          <h2 style="font-size: 17px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
            INDEPENDENT CONTRACTOR ENGAGEMENT AGREEMENT
          </h2>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 600;">
            Position: ${roleTitle}
          </p>
        </div>

        <p style="font-size: 13px; color: #0f172a; margin-bottom: 16px;">
          Dear <strong>${name}</strong> (<span style="color: #0075de; text-decoration: underline;">${email}</span>),
        </p>

        <p style="font-size: 12px; color: #334155; margin-bottom: 20px; line-height: 1.7;">
          On behalf of <strong>GrowX Labs Tech Pvt. Ltd.</strong> ("Company"), we are pleased to extend this formal offer of engagement for the position of <strong>${roleTitle}</strong>. We were thoroughly impressed by your sales capability, drive, and strategic alignment during our selection process. This agreement sets forth the binding terms, legal protections, and performance framework governing your engagement.
        </p>

        <!-- SECTION 01: APPOINTMENT -->
        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            01 APPOINTMENT &amp; ENGAGEMENT TERMS
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;">
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155; width: 35%;">Designation / Role</td>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 800; color: #0f172a;">${roleTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155;">Engagement Model</td>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; color: #0f172a;">${durationValue}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155;">Joining Date</td>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 800; color: #0075de;">${joiningDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155;">Probationary Review</td>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; color: #0f172a;">90-Day Initial Performance Assessment</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155;">Work Mode &amp; Hours</td>
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; color: #0f172a;">Remote (Overlap with Indian Standard Time)</td>
            </tr>
          </table>
        </div>

        <!-- SECTION 02: COMPENSATION -->
        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            02 COMPENSATION &amp; REMUNERATION MODEL
          </h3>
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 16px; font-size: 11px; color: #1e293b;">
            <p style="margin: 0 0 10px 0; font-weight: 800; font-size: 12px; color: #0f172a;">
              Performance-Driven Remuneration Structure (No Fixed Base Salary):
            </p>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Closed Revenue Commission:</strong> You will be paid a direct <strong>${commissionValue}</strong> commission of net contract value for all converted partner accounts sourced by your outreach.</li>
              <li><strong>Qualified Discovery Call Incentive:</strong> You will receive <strong>${incentiveValue}</strong> for every qualified BANT discovery call scheduled and successfully conducted.</li>
              <li><strong>Payout Schedule &amp; Tax Deductions:</strong> Disbursements are processed monthly via direct bank transfer within 10 business days post client invoice realization, subject to statutory TDS under Indian Income Tax Act (Section 194J/194H).</li>
            </ul>
          </div>
        </div>

        <!-- SECTION 03 & 04: RESPONSIBILITIES & KPIS -->
        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            03 SCOPE OF RESPONSIBILITIES &amp; WORKFLOWS
          </h3>
          <p style="font-size: 11px; color: #334155; margin-bottom: 12px;">
            Your duties include outbound lead generation, cold calling, cold email sequencing, LinkedIn sales navigator outreach, qualifying leads via BANT criteria, managing CRM hygiene (Apollo/HubSpot), and scheduling high-intent discovery calls for our senior engineering executives.
          </p>

          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 20px 0 10px 0; letter-spacing: 0.5px;">
            04 PERFORMANCE EXPECTATIONS &amp; KPIS
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;">
            <thead>
              <tr style="background-color: #0f172a; color: #ffffff;">
                <th style="padding: 10px; border: 1px solid #0f172a; text-align: left;">Daily Outreach Target</th>
                <th style="padding: 10px; border: 1px solid #0f172a; text-align: left;">Weekly Deliverable Benchmark</th>
                <th style="padding: 10px; border: 1px solid #0f172a; text-align: left;">Monthly SQO Target</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="padding: 10px; border: 1px solid #cbd5e1;">40+ Dials / 50+ Custom Emails / 20 LinkedIn Connections</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 800; color: #0075de;">${weeklyMeetingsTarget} Completed Discovery Meetings</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 800; color: #10b981;">${monthlySqoTarget} Sales Qualified Opportunities</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION 05 - 09: LEGAL COVENANTS -->
        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            05–09 ENTERPRISE LEGAL PROTECTIONS &amp; COVENANTS
          </h3>
          
          <div style="font-size: 11px; color: #334155; line-height: 1.7; space-y-3;">
            <p style="margin-bottom: 10px;">
              <strong>05 Commission Plan &amp; Multipliers:</strong> Commissions are calculated on net received funds. Milestone bonuses apply when hitting &gt;120% of monthly quotas.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>06 Non-Disclosure Agreement (NDA) &amp; Confidentiality:</strong> You shall hold all company client databases, lead lists, pricing structures, AI prompts, sales scripts, and financial projections in strict confidence. This obligation survives termination indefinitely.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>07 Intellectual Property (IP) Ownership:</strong> All sales materials, playbooks, email templates, research, automation workflows, and CRM assets created during engagement belong exclusively to GrowX Labs Tech Pvt. Ltd.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>08 12-Month Non-Solicitation &amp; Non-Compete:</strong> For 12 months post-termination, you shall not solicit GrowX Labs' clients, active prospects, or employ/hire any current team member.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>09 Data Protection &amp; Privacy:</strong> You agree to comply with enterprise data security guidelines and handle all prospect information strictly inside authorized company tools.
            </p>
          </div>
        </div>

        <!-- SECTION 10 - 13: POLICIES & GOVERNING LAW -->
        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            10–13 POLICIES, TERMINATION &amp; GOVERNING LAW
          </h3>
          <div style="font-size: 11px; color: #334155; line-height: 1.7;">
            <p style="margin-bottom: 10px;">
              <strong>10 Equipment Usage:</strong> Company tool accounts (Apollo, Clay, Google Workspace) are provided strictly for company business.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>11 Leave Policy:</strong> As an independent contractor, flexible scheduling is supported with 48 hours' advance notice for planned absences.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>12 Termination:</strong> Either party may terminate with 14 days' written notice. Immediate termination applies for breach of NDA, IP theft, or ethical violations.
            </p>
            <p style="margin-bottom: 10px;">
              <strong>13 Governing Law:</strong> Governed by laws of Republic of India. Subject to exclusive jurisdiction of courts in Visakhapatnam, Andhra Pradesh.
            </p>
          </div>
        </div>

        <!-- SECTION 14: SIGNATURE BLOCK -->
        <div style="margin-top: 36px; border-top: 2px solid #0f172a; padding-top: 24px;">
          <h3 style="font-size: 13px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0 0 16px 0; letter-spacing: 0.5px;">
            14 ACCEPTANCE &amp; DUAL SIGNATURE BLOCK
          </h3>

          <table style="width: 100%; font-size: 11px; color: #0f172a;">
            <tr>
              <td style="width: 48%; vertical-align: top; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; background-color: #f8fafc;">
                <p style="font-weight: 800; text-transform: uppercase; color: #1e3a8a; margin: 0 0 12px 0;">For GrowX Labs Tech Pvt. Ltd.</p>
                <div style="height: 40px; border-bottom: 1px border-dashed #94a3b8; margin-bottom: 8px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #0075de;">
                  ${senderName}
                </div>
                <p style="margin: 0; font-weight: 800;">${senderName}</p>
                <p style="margin: 2px 0; color: #64748b; font-size: 10px;">Founder &amp; CEO</p>
                <p style="margin: 0; color: #64748b; font-size: 10px;">Email: ${senderEmail}</p>
                <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 10px; color: #0075de;">Date: ${offerDate}</p>
              </td>

              <td style="width: 4%;"></td>

              <td style="width: 48%; vertical-align: top; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; background-color: #f8fafc;">
                <p style="font-weight: 800; text-transform: uppercase; color: #1e3a8a; margin: 0 0 12px 0;">Candidate Acceptance</p>
                <div style="height: 40px; border-bottom: 1px border-dashed #94a3b8; margin-bottom: 8px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #0f172a;">
                  ${name}
                </div>
                <p style="margin: 0; font-weight: 800;">${name}</p>
                <p style="margin: 2px 0; color: #64748b; font-size: 10px;">Candidate Signature</p>
                <p style="margin: 0; color: #64748b; font-size: 10px;">Email: ${email}</p>
                <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 10px; color: #0075de;">Joining Date: ${joiningDate}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- ANNEXURES -->
        <div style="margin-top: 36px; border-top: 2px solid #0075de; padding-top: 24px;">
          <h3 style="font-size: 14px; font-weight: 900; color: #0075de; text-transform: uppercase; margin: 0 0 12px 0;">
            ANNEXURE A: COMMISSION TIERS &amp; EARNINGS FORECAST
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #0f172a;">
                <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Performance Quota</th>
                <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Commission Multiplier</th>
                <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Discovery Call Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Base Quota (1-3 SQOs)</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 700;">10% Net Revenue</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${incentiveValue} / Call</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">High Performer (4-6 SQOs)</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 800; color: #0075de;">12.5% Net Revenue</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">₹1,250 / Call</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">President's Club (7+ SQOs)</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 900; color: #10b981;">15% Net Revenue + ₹10k Bonus</td>
                <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">₹1,500 / Call</td>
              </tr>
            </tbody>
          </table>

          <h3 style="font-size: 14px; font-weight: 900; color: #0075de; text-transform: uppercase; margin: 20px 0 8px 0;">
            ANNEXURE B &amp; C: ETHICAL CONDUCT &amp; DATA SECURITY
          </h3>
          <p style="font-size: 11px; color: #334155; line-height: 1.6;">
            <strong>Ethical Selling:</strong> Misrepresentation of engineering capabilities, false pricing, or aggressive tactics are strictly prohibited.<br/>
            <strong>Security Guidelines:</strong> 2-Factor Authentication (2FA) is mandatory on all company tools. AI tools must not ingest proprietary client data.
          </p>
        </div>

        <!-- Corporate Footer -->
        <table style="width: 100%; border-top: 1px solid #cbd5e1; margin-top: 40px; padding-top: 14px; font-size: 10px; color: #64748b;">
          <tr>
            <td>CONFIDENTIAL &amp; PROPRIETARY — GrowX Labs Tech Pvt. Ltd.</td>
            <td style="text-align: center;">Page 1 of 1</td>
            <td style="text-align: right;">© ${new Date().getFullYear()} GrowX Labs</td>
          </tr>
        </table>

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

  // ── Print / PDF Generation Trigger ──
  const handlePrintPDF = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      window.print();
      setPdfGenerating(false);
    }, 500);
  };

  // ── Dispatch Offer Letter via saivarshith8284@gmail.com ──
  const handleSendOnboardingEmail = async () => {
    if (!isValid) {
      alert("Cannot send contract. Please fix all validation errors before proceeding.");
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
          fromName: `${senderName} | Founder & CEO`,
          fromEmail: senderEmail, // MUST BE saivarshith8284@gmail.com
          subject: emailSubject,
          html: htmlContent,
          body: `CONFIDENTIAL EMPLOYMENT OFFER: ${roleTitle}\n\nDear ${candidateName},\n\nPlease review your formal Independent Contractor Engagement Agreement sent by GrowX Labs Tech Pvt. Ltd.`
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }

      if (selectedEmp?.id) {
        updateOnboardingState(selectedEmp.id, { offerSent: true });
      }

      alert(`🎉 Enterprise SDR Offer Agreement successfully dispatched to ${candidateName} (${candidateEmail}) from ${senderEmail}!`);
      setShowEmailModal(false);
    } catch (e: any) {
      console.error(e);
      alert(`Email Delivery Failed: ${e.message}`);
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
            <div className="p-2.5 bg-[#0f172a] text-white rounded-xl shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Enterprise Onboarding &amp; Legal Contracts</h1>
              <p className="text-[#64748b] text-xs">Generate Fortune 500 quality employment contracts &amp; dispatch directly via <span className="font-bold text-[#0075de]">saivarshith8284@gmail.com</span>.</p>
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
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">Contract &amp; Credentials</p>
                      
                      {/* Offer letter status */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { offerSent: !state.offerSent })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.offerSent ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#cbd5e1] hover:border-neutral-400'}`}
                        >
                          {state.offerSent && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.offerSent ? "text-[#0f172a] font-semibold" : "text-[#64748b]"}>Offer Contract Sent</span>
                      </div>

                      {/* Terms Acceptance Signature */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => toggleTermsAcceptance(emp, !!emp.accepted_terms)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${emp.accepted_terms ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-[#cbd5e1] hover:border-neutral-400'}`}
                        >
                          {emp.accepted_terms && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={emp.accepted_terms ? "text-[#10b981] font-bold" : "text-[#64748b]"}>
                          Contract Signed {emp.accepted_terms && "✍️"}
                        </span>
                      </div>

                      {/* Access Credentials check */}
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => updateOnboardingState(emp.id, { credentialsCreated: !state.credentialsCreated })}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${state.credentialsCreated ? 'bg-[#0075de] border-[#0075de] text-white' : 'border-[#cbd5e1] hover:border-neutral-400'}`}
                        >
                          {state.credentialsCreated && <span className="text-[9px]">✓</span>}
                        </button>
                        <span className={state.credentialsCreated ? "text-[#0f172a] font-semibold" : "text-[#64748b]"}>Credentials Activated</span>
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
                      <p className="text-[10px] text-[#64748b] italic">
                        {progress === 100 ? "🎉 Training Complete - Fully Active" : "Onboarding & training tasks in progress"}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 justify-center h-full">
                      <Button 
                        onClick={() => handleOpenEmailModal(emp)}
                        className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-[10px] font-extrabold uppercase tracking-wider h-10 rounded-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <FileText size={14} /> Review &amp; Send Contract
                      </Button>
                    </div>
                  </div>

                  {/* Onboarding Checklist Details */}
                  <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748b] mb-3">5-Day Structured Onboarding Checklist</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { key: "day1Checked" as const, label: "Day 1: Credentials" },
                        { key: "day2Checked" as const, label: "Day 2: Prospect Lists" },
                        { key: "day3Checked" as const, label: "Day 3: Call Scripts" },
                        { key: "day4Checked" as const, label: "Day 4: Warm Dials" },
                        { key: "day5Checked" as const, label: "Day 5: Full Launch" }
                      ].map((day) => (
                        <label 
                          key={day.key}
                          className={cn(
                            "flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all select-none text-xs",
                            state[day.key] 
                              ? 'bg-[#0075de]/5 border-[#0075de]/20 text-[#0075de] font-semibold' 
                              : 'border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                          )}
                        >
                          <input 
                            type="checkbox"
                            checked={state[day.key]}
                            onChange={() => updateOnboardingState(emp.id, { [day.key]: !state[day.key] })}
                            className="rounded border-[#cbd5e1] bg-white text-[#0075de] focus:ring-0 w-3.5 h-3.5"
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
            <div className="h-64 flex flex-col items-center justify-center border border-[#cbd5e1] border-dashed rounded-xl bg-[#f8fafc]">
              <AlertCircle className="text-[#94a3b8] mb-3" size={32} />
              <p className="text-[#334155] text-sm font-semibold">No SDR team members found</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Premium Corporate Offer Letter Modal (Full A4 Viewport) ── */}
      <AnimatePresence>
        {showEmailModal && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
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
              className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col h-[94vh] max-h-[96vh] overflow-hidden border border-[#cbd5e1]"
            >
              {/* Modal Top Header */}
              <div className="shrink-0 bg-[#0f172a] text-white border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0075de] flex items-center justify-center text-white shadow-md">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                        Enterprise SDR Employment Contract Studio
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        Candidate: <span className="font-extrabold text-white">{candidateName}</span> ({candidateEmail}) &nbsp;|&nbsp; Sender: <span className="font-extrabold text-[#60a5fa]">{senderEmail}</span>
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintPDF}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                    >
                      <Printer size={14} /> Print / Export PDF
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
                    <Eye size={13} /> Document Preview
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
                    <Edit3 size={13} /> Contract Details &amp; Validation
                  </button>
                </div>
              </div>

              {/* Modal Body Viewport */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-[#e2e8f0]/40">
                {activeTab === "preview" ? (
                  <div className="flex flex-col lg:flex-row min-h-full">
                    
                    {/* Validation Sidebar */}
                    <div className="shrink-0 lg:w-[300px] bg-white border-b lg:border-b-0 lg:border-r border-[#cbd5e1] p-5 space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#64748b]">Validation Checklist</p>
                          <span className={cn("text-[9px] font-black px-2 py-0.5 rounded uppercase", isValid ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20")}>
                            {isValid ? "100% Passed" : `${validationErrors.length} Issue(s)`}
                          </span>
                        </div>

                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#64748b]">Candidate Name:</span>
                            <span className="font-bold text-[#0f172a]">{candidateName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#64748b]">Candidate Email:</span>
                            <span className="font-bold text-[#0f172a] text-[11px] truncate max-w-[140px]">{candidateEmail}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-2">
                            <span className="text-[#64748b]">Sender Email:</span>
                            <span className="font-bold text-[#0075de] text-[11px]">{senderEmail}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-2">
                            <span className="text-[#64748b]">Joining Date:</span>
                            <span className="font-bold text-emerald-600">{joiningDate}</span>
                          </div>
                        </div>

                        {!isValid && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 space-y-1">
                            <p className="text-[10px] font-extrabold text-red-600 uppercase flex items-center gap-1">
                              <AlertTriangle size={12} /> Required Fixes:
                            </p>
                            {validationErrors.map((err, idx) => (
                              <p key={idx} className="text-[10px] text-red-600 leading-tight font-medium">• {err}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#64748b]">14 Corporate Sections</p>
                        <div className="text-[10px] text-[#475569] space-y-1 font-medium bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 01 Appointment Terms</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 02 Compensation &amp; TDS</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 03-04 SDR Responsibilities &amp; KPIs</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 05-09 NDA, IP &amp; Non-Solicitation</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 10-13 Leave &amp; Jurisdiction</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> 14 Dual Signature Blocks</p>
                          <p className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={11} /> Annexures A, B, &amp; C Included</p>
                        </div>
                      </div>
                    </div>

                    {/* Document Viewport */}
                    <div className="flex-1 p-6 overflow-y-auto flex justify-center">
                      <div className="w-full max-w-[800px] shadow-2xl rounded-lg overflow-hidden border border-[#cbd5e1] bg-white">
                        <div dangerouslySetInnerHTML={{ __html: generateHTMLBody(candidateName, candidateEmail) }} />
                      </div>
                    </div>

                  </div>
                ) : (
                  /* EDIT TAB */
                  <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto bg-white rounded-2xl shadow border border-[#cbd5e1] my-6">
                    
                    {/* Mandatory Email Credentials */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#0075de] flex items-center gap-1.5">
                        <ShieldCheck size={14} /> 1. Mandatory Email &amp; Candidate Credentials
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Candidate Full Name</label>
                          <input
                            type="text"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Candidate Email</label>
                          <input
                            type="email"
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Sender Email (MANDATORY)</label>
                          <input
                            type="email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0075de] focus:outline-none focus:border-[#0075de]"
                          />
                          <p className="text-[9px] text-[#0075de] font-semibold mt-1">Must remain set to saivarshith8284@gmail.com</p>
                        </div>
                      </div>
                    </div>

                    {/* Mandatory Dates & Offer Terms */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#0075de] flex items-center gap-1.5">
                        <FileText size={14} /> 2. Contract Dates &amp; Remuneration Terms
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Joining Date (MANDATORY)</label>
                          <input
                            type="text"
                            value={joiningDate}
                            onChange={(e) => setJoiningDate(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#0075de]"
                          />
                          <p className="text-[9px] text-emerald-600 font-semibold mt-1">Must be set to 20 July 2026 (Today)</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Offer Date</label>
                          <input
                            type="text"
                            value={offerDate}
                            onChange={(e) => setOfferDate(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Role Designation</label>
                          <input
                            type="text"
                            value={roleTitle}
                            onChange={(e) => setRoleTitle(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Commission Rate</label>
                          <input
                            type="text"
                            value={commissionValue}
                            onChange={(e) => setCommissionValue(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Discovery Call Incentive</label>
                          <input
                            type="text"
                            value={incentiveValue}
                            onChange={(e) => setIncentiveValue(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748b]">Ref Number</label>
                          <input
                            type="text"
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0075de]"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Modal Action Footer */}
              <div className="shrink-0 border-t border-[#cbd5e1] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 size={15} /> 100% Validation Passed — Ready for Delivery
                    </span>
                  ) : (
                    <span className="text-[11px] text-red-600 font-extrabold flex items-center gap-1">
                      <AlertTriangle size={15} /> Fix {validationErrors.length} Validation Issue(s)
                    </span>
                  )}
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
                    disabled={!isValid || emailSending}
                    className={cn(
                      "text-white text-xs font-extrabold px-6 h-10 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer",
                      isValid
                        ? "bg-[#0075de] hover:bg-[#005bab] shadow-[#0075de]/25"
                        : "bg-slate-400 cursor-not-allowed opacity-60"
                    )}
                  >
                    {emailSending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Dispatching Contract…
                      </>
                    ) : (
                      <>
                        {isValid ? <Send size={15} /> : <Lock size={15} />} Send Contract via saivarshith8284@gmail.com
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
