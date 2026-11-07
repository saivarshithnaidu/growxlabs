import {
  LayoutDashboard, LayoutGrid, IdCard, Users, Briefcase, Wallet, Megaphone, LifeBuoy, GraduationCap,
  Settings, Activity, Target, Workflow, Building2, Contact, FileText, FileSignature, Upload, Box as Package,
  UsersRound, ClipboardCheck, Search, Calendar, Sparkles, Layers, CheckCircle2, FolderKanban, Receipt,
  Zap, GitBranch, Clock, Bug, CreditCard, BookOpen, UserPlus, ClipboardList, UserCheck,
  CalendarOff, Key, Send, Mail, MessageSquare, Image as ImageIcon, Award, Ticket, ShoppingBag,
  BarChart3, Clipboard, AlertCircle, Terminal, Shield, MapPin, KeyRound, History,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { findActiveNav, type BreadcrumbItem, type NavGroupConfig, type NavItemConfig, type NavModuleConfig } from "@/src/components/ui";

const Presentation = LayoutDashboard;
const ShoppingCart = ShoppingBag;
const FileBarChart = BarChart3;

export type NavItem = NavItemConfig;
export type NavGroup = NavGroupConfig;
export type NavModule = NavModuleConfig;

export const MODULES: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    href: "/admin",
    groups: [
      { label: "WORKSPACE", items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Command Center", href: "/admin/command-center", icon: Terminal },
      ]},
    ],
  },
  {
    id: "sales",
    label: "Customer & Sales",
    icon: Users,
    href: "/admin/crm",
    groups: [
      { label: "OVERVIEW", items: [
        { label: "CRM Hub", href: "/admin/crm", icon: LayoutDashboard },
      ]},
      { label: "PIPELINE", items: [
        { label: "Leads", href: "/admin/leads", icon: Target },
        { label: "Deals Pipeline", href: "/admin/deals", icon: Workflow },
        { label: "Companies", href: "/admin/companies", icon: Building2 },
        { label: "Contacts", href: "/admin/contacts", icon: Contact },
      ]},
      { label: "DOCUMENTS", items: [
        { label: "Quotations", href: "/admin/quotations", icon: FileText },
        { label: "Proposals", href: "/admin/proposals", icon: FileSignature },
      ]},
      { label: "TOOLS", items: [
        { label: "Lead Imports", href: "/admin/leads/imports", icon: Upload },
        { label: "AI Lead Scraper", href: "/admin/leads/scrape", icon: Sparkles },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Sales Team", href: "/admin/crm/team", icon: UsersRound },
      ]},
    ],
  },
  {
    id: "consulting",
    label: "Consulting Workflow",
    icon: Briefcase,
    href: "/admin/assessments",
    groups: [
      { label: "PRE-SALES", items: [
        { label: "Client Assessments", href: "/admin/assessments", icon: ClipboardCheck },
        { label: "Audits", href: "/admin/audits", icon: Search },
        { label: "Discovery Meetings", href: "/admin/discovery-meetings", icon: Calendar },
        { label: "AI Solution Reports", href: "/admin/ai-solution-reports", icon: Sparkles },
        { label: "Solution Architectures", href: "/admin/solution-architectures", icon: Layers },
        { label: "Scopes of Work", href: "/admin/scopes", icon: FileText },
      ]},
      { label: "CONTRACTS", items: [
        { label: "Proposal Approvals", href: "/admin/proposals?status=internal_review", icon: CheckCircle2 },
        { label: "Agreements", href: "/admin/agreements", icon: FileSignature },
        { label: "Contractor Agreements", href: "/admin/contractor-agreements", icon: FileSignature },
        { label: "Client Onboarding", href: "/admin/onboarding", icon: Zap },
      ]},
      { label: "DELIVERY", items: [
        { label: "Project Workspaces", href: "/admin/projects", icon: FolderKanban },
        { label: "Invoices & Payments", href: "/admin/consulting-finance", icon: Receipt },
      ]},
    ],
  },
  {
    id: "projects",
    label: "Projects & Delivery",
    icon: FolderKanban,
    href: "/admin/pm/projects",
    groups: [
      { label: "WORK", items: [
        { label: "Projects", href: "/admin/pm/projects", icon: FolderKanban },
        { label: "Project Workspaces", href: "/admin/projects", icon: Layers },
        { label: "Change Requests", href: "/admin/change-requests", icon: GitBranch },
        { label: "Sprints", href: "/admin/pm/sprints", icon: Zap },
      ]},
      { label: "TEAM", items: [
        { label: "Workload", href: "/admin/pm/workload", icon: Users },
        { label: "Timesheets", href: "/admin/pm/timesheets", icon: Clock },
      ]},
      { label: "QUALITY", items: [
        { label: "Bugs", href: "/admin/pm/bugs", icon: Bug },
        { label: "Project Assistant", href: "/admin/pm/ai-copilot", icon: Sparkles },
      ]},
    ],
  },
  {
    id: "finance",
    label: "Finance & Accounts",
    icon: Wallet,
    href: "/admin/finance/dashboard",
    groups: [
      { label: "OVERVIEW", items: [
        { label: "Financial Overview", href: "/admin/finance/dashboard", icon: LayoutDashboard },
        { label: "Reports", href: "/admin/finance/reports", icon: FileBarChart },
      ]},
      { label: "BILLING", items: [
        { label: "Sales Invoices", href: "/admin/finance/invoices", icon: Receipt },
        { label: "Invoices", href: "/admin/invoices", icon: Receipt },
        { label: "Expenses", href: "/admin/finance/expenses", icon: CreditCard },
      ]},
      { label: "LEDGER", items: [
        { label: "Ledger Accounts", href: "/admin/finance/accounts", icon: BookOpen },
        { label: "Consulting Activation", href: "/admin/consulting-finance", icon: Briefcase },
      ]},
      { label: "ASSIST", items: [
        { label: "AI Helper", href: "/admin/finance/ai-helper", icon: Sparkles },
      ]},
    ],
  },
  {
    id: "people",
    label: "People Operations",
    icon: IdCard,
    href: "/admin/people",
    groups: [
      { label: "OVERVIEW", items: [
        { label: "People Overview", href: "/admin/hrms/dashboard", icon: LayoutDashboard },
      ]},
      { label: "DIRECTORY", items: [
        { label: "My Team", href: "/admin/people/team", icon: UsersRound },
        { label: "Employees", href: "/admin/people", icon: Contact },
        { label: "Departments", href: "/admin/people/departments", icon: Building2 },
        { label: "Designations", href: "/admin/people/designations", icon: Layers },
      ]},
      { label: "HIRING", items: [
        { label: "Jobs & candidates", href: "/admin/hrms/recruitment", icon: UsersRound },
        { label: "Interviews & Access", href: "/admin/hrms/recruitment/interviews", icon: Key },
        { label: "Offer Management", href: "/admin/offers", icon: FileSignature },
        { label: "ResumeForge AI", href: "/admin/resumeforge", icon: Sparkles },
        { label: "Recruiting Assistant", href: "/admin/hrms/ai-recruiter", icon: Sparkles },
      ]},
      { label: "RECRUITMENT EMAIL", items: [
        { label: "Email Status", href: "/admin/hrms/recruitment/emails", icon: Mail },
        { label: "Email Templates", href: "/admin/hrms/recruitment/email-templates", icon: FileText },
        { label: "Email Settings", href: "/admin/hrms/recruitment/email-settings", icon: Settings },
      ]},
      { label: "ONBOARDING", items: [
        { label: "HR Onboarding", href: "/admin/hr-onboarding", icon: CheckCircle2 },
        { label: "Manager Onboarding", href: "/admin/hr-onboarding/manager", icon: UserCheck },
        { label: "Sales Team Onboarding", href: "/admin/employee-onboarding", icon: Users },
      ]},
      { label: "TIME & PAY", items: [
        { label: "Attendance", href: "/admin/hrms/attendance", icon: Clock },
        { label: "Leaves", href: "/admin/hrms/leaves", icon: CalendarOff },
        { label: "Payroll", href: "/admin/hrms/payroll", icon: Wallet },
      ]},
      { label: "ACCESS", items: [
        { label: "People Access", href: "/admin/people/access", icon: Key },
      ]},
    ],
  },
  {
    id: "growth",
    label: "Growth & Marketing",
    icon: Megaphone,
    href: "/admin/marketing",
    groups: [
      { label: "CAMPAIGNS", items: [
        { label: "Marketing Hub", href: "/admin/marketing", icon: LayoutDashboard },
        { label: "Outreach", href: "/admin/outreach", icon: Send },
        { label: "Newsletter Dispatch", href: "/admin/dispatch", icon: Mail },
      ]},
      { label: "COMMUNICATIONS", items: [
        { label: "GrowX Email", href: "/admin/growx-email", icon: Mail },
        { label: "Communications", href: "/admin/communications", icon: MessageSquare },
      ]},
      { label: "CONTENT", items: [
        { label: "Editorial Carousel", href: "/admin/editorial-carousel", icon: ImageIcon },
        { label: "Presentation Builder", href: "/admin/pitch-deck", icon: Presentation },
      ]},
    ],
  },
  {
    id: "support",
    label: "Customer Support",
    icon: LifeBuoy,
    href: "/admin/support",
    groups: [
      { label: "TICKETS", items: [
        { label: "Support Hub", href: "/admin/support", icon: LifeBuoy },
      ]},
    ],
  },
  {
    id: "learning",
    label: "Learning & Commerce",
    icon: GraduationCap,
    href: "/admin/academy/courses",
    groups: [
      { label: "ACADEMY", items: [
        { label: "Courses", href: "/admin/academy/courses", icon: BookOpen },
        { label: "Assessments", href: "/admin/academy/assessments", icon: ClipboardCheck },
        { label: "Students", href: "/admin/academy/users", icon: Users },
        { label: "Certificates", href: "/admin/academy/certificates", icon: Award },
      ]},
      { label: "COMMERCE", items: [
        { label: "Coupons", href: "/admin/monetization/coupons", icon: Ticket },
        { label: "Orders", href: "/admin/monetization/orders", icon: ShoppingCart },
      ]},
    ],
  },
  {
    id: "admin",
    label: "Administration",
    icon: Settings,
    href: "/admin/settings",
    groups: [
      { label: "SETTINGS", items: [
        { label: "Settings & Security", href: "/admin/settings", icon: Settings },
        { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
      ]},
      { label: "AUTOMATION", items: [
        { label: "Workflows", href: "/admin/workflows", icon: Workflow },
      ]},
      { label: "ACCOUNTS", items: [
        { label: "Client Accounts", href: "/admin/clients", icon: Users },
      ]},
    ],
  },
  {
    id: "location",
    label: "Growx Location",
    icon: MapPin,
    href: "/admin/location",
    groups: [
      { label: "LOCATION API", items: [
        { label: "Tenants & Keys", href: "/admin/location", icon: KeyRound },
        { label: "Activity", href: "/admin/location/activity", icon: History },
      ]},
    ],
  },
  {
    id: "ops",
    label: "Operations & Audit",
    icon: Activity,
    href: "/admin/activity",
    groups: [
      { label: "MONITORING", items: [
        { label: "Activity", href: "/admin/activity", icon: Activity },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: Clipboard },
        { label: "System Errors", href: "/admin/system/errors", icon: AlertCircle },
      ]},
    ],
  },
];

/** Hrefs that only match exactly: "/admin" prefixes every route. */
export const ADMIN_EXACT_HREFS = ["/admin"];

export function stripLocale(pathname: string) {
  return pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/admin)/, "");
}

/** Active module + item for a path (longest-prefix match; at most one item active). */
export function getAdminNav(pathname: string) {
  return findActiveNav(MODULES, stripLocale(pathname), ADMIN_EXACT_HREFS);
}

/** Breadcrumb parents for the current admin page: the module, plus the nav item when the page sits below it. */
export function useAdminBreadcrumb(): BreadcrumbItem[] {
  const pathname = stripLocale(usePathname() || "");
  const { module, item } = findActiveNav(MODULES, pathname, ADMIN_EXACT_HREFS);
  const crumbs: BreadcrumbItem[] = [{ label: module.label, href: module.href }];
  if (item && pathname !== item.href) crumbs.push({ label: item.label, href: item.href });
  return crumbs;
}
