// GrowXLabs Enterprise Design System Tokens & Utility Classes

export const DESIGN_TOKENS = {
  colors: {
    primary: {
      default: "#0075DE",
      hover: "#0062BD",
      gradient: "from-blue-600 to-indigo-600",
      light: "rgba(0, 117, 222, 0.1)",
      border: "rgba(0, 117, 222, 0.3)"
    },
    success: {
      default: "#00A86B",
      light: "rgba(0, 168, 107, 0.1)",
      border: "rgba(0, 168, 107, 0.2)"
    },
    warning: {
      default: "#F59E0B",
      light: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.2)"
    },
    danger: {
      default: "#EF4444",
      light: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.2)"
    },
    neutral: {
      bgDark: "#09090B",
      surface: "#121215",
      border: "rgba(255, 255, 255, 0.08)",
      textMuted: "#A1A1AA",
      textPrimary: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    headings: "font-extrabold tracking-tight text-white",
    subtitles: "text-xs font-semibold text-neutral-400 uppercase tracking-wider"
  },
  glassmorphism: {
    card: "bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all duration-300 rounded-2xl p-6 shadow-xl backdrop-blur-md",
    cardCompact: "bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all duration-300 rounded-xl p-4 shadow-lg backdrop-blur-md",
    input: "bg-white/5 border border-white/10 text-white placeholder-neutral-500 rounded-xl h-10 px-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium",
    buttonPrimary: "bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-5 rounded-xl transition-all shadow-md active:scale-[0.98]",
    buttonSecondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-bold h-10 px-5 rounded-xl transition-all"
  },
  workspaces: [
    { id: "dashboard", name: "Dashboard", href: "/admin", icon: "LayoutDashboard", color: "text-blue-400" },
    { id: "crm", name: "CRM", href: "/admin/crm", icon: "Users", color: "text-indigo-400" },
    { id: "pm", name: "Projects", href: "/admin/pm", icon: "FolderKanban", color: "text-emerald-400" },
    { id: "finance", name: "Finance", href: "/admin/finance", icon: "DollarSign", color: "text-amber-400" },
    { id: "hrms", name: "HRMS", href: "/admin/hrms", icon: "UserCheck", color: "text-purple-400" },
    { id: "marketing", name: "Marketing", href: "/admin/marketing", icon: "Megaphone", color: "text-rose-400" },
    { id: "support", name: "Customer Support", href: "/admin/support", icon: "LifeBuoy", color: "text-cyan-400" },
    { id: "analytics", name: "Analytics", href: "/admin/analytics", icon: "BarChart3", color: "text-sky-400" },
    { id: "ai", name: "AI Platform", href: "/admin/ai-platform", icon: "Cpu", color: "text-blue-500" },
    { id: "admin", name: "Administration", href: "/admin/settings", icon: "Settings", color: "text-neutral-400" },
    { id: "knowledge", name: "Knowledge", href: "/admin/knowledge-base", icon: "BookOpen", color: "text-emerald-500" }
  ]
};
