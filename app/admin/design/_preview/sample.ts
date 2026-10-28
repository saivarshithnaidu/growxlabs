// Static sample data for the design preview. No API calls.
import { Activity, Briefcase, Building2, FileText, LayoutGrid, Target, Upload, Users, Wallet } from "lucide-react";
import type { NavModuleConfig } from "@/src/components/ui";

export type SampleLead = {
  id: string;
  company: string;
  contact: string;
  status: string;
  owner: string;
  value: number;
  score: number;
  created: string;
};

const companies = ["Northwind Traders", "Acme Robotics", "Globex Health", "Initech Labs", "Umbrella Foods", "Stark Logistics", "Wayne Retail", "Hooli Cloud", "Pied Piper", "Vandelay Imports", "Soylent Farms", "Tyrell Bio"];
const contacts = ["Priya Raman", "Arjun Mehta", "Sara Lopez", "Daniel Kim", "Meera Iyer", "Tom Becker", "Aisha Khan", "Liam Murphy", "Nina Rossi", "Ravi Shah", "Emma Clarke", "Kenji Sato"];
const statuses = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost", "nurturing"];
const owners = ["Priya Raman", "Arjun Mehta", "Sara Lopez"];

export const SAMPLE_LEADS: SampleLead[] = Array.from({ length: 36 }, (_, i) => ({
  id: `L-${1040 + i}`,
  company: companies[i % companies.length],
  contact: contacts[(i * 5) % contacts.length],
  status: statuses[(i * 3) % statuses.length],
  owner: owners[i % owners.length],
  value: 25000 + ((i * 7919) % 90) * 1000,
  score: 40 + ((i * 37) % 60),
  created: new Date(Date.UTC(2026, 9, 27 - i, 10, 0)).toISOString(),
}));

export const SAMPLE_PEOPLE = contacts.slice(0, 7).map((name) => ({ name }));

export const SAMPLE_MODULES: NavModuleConfig[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid, href: "/demo", groups: [{ label: "Workspace", items: [{ label: "Dashboard", href: "/demo", icon: LayoutGrid }] }] },
  {
    id: "sales", label: "Customer & Sales", icon: Users, href: "/demo/crm",
    groups: [
      { label: "Pipeline", items: [
        { label: "Leads", href: "/demo/leads", icon: Target, count: 128 },
        { label: "Companies", href: "/demo/companies", icon: Building2 },
      ] },
      { label: "Tools", items: [{ label: "Lead Imports", href: "/demo/leads/imports", icon: Upload, count: 3 }] },
    ],
  },
  { id: "consulting", label: "Consulting Workflow", icon: Briefcase, href: "/demo/assessments", groups: [{ label: "Pre-sales", items: [{ label: "Assessments", href: "/demo/assessments", icon: FileText }] }] },
  { id: "finance", label: "Finance & Accounts", icon: Wallet, href: "/demo/finance", groups: [{ label: "Billing", items: [{ label: "Invoices", href: "/demo/finance", icon: FileText }] }] },
  { id: "ops", label: "Operations & Audit", icon: Activity, href: "/demo/activity", groups: [{ label: "Audit", items: [{ label: "Activity", href: "/demo/activity", icon: Activity }] }] },
];

export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function relative(iso: string, now = Date.UTC(2026, 9, 28, 12, 0)) {
  const d = Math.round((now - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
}
