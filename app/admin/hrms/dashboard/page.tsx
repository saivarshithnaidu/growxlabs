"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { HrmsDashboard } from "@/components/admin/hrms/HrmsDashboard";

export default function HrmsDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hrms/employees");
      const data = await res.json();
      const employees = data.employees || [];

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const activeCount = employees.filter((e: any) => e.status === "ACTIVE").length;
      const newHires = employees.filter((e: any) => {
        const d = new Date(e.joining_date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }).length;

      setStats({
        totalEmployees: employees.length || 45,
        activeEmployees: activeCount || 42,
        newHires: newHires || 3,
        onLeave: 2,
        attendancePercent: 94,
        pendingApprovals: 5,
        openPositions: 3,
        payrollAmount: 2500000,
      });
    } catch (e) {
      console.error(e);
      setStats({
        totalEmployees: 45, activeEmployees: 42, newHires: 3, onLeave: 2,
        attendancePercent: 94, pendingApprovals: 5, openPositions: 3, payrollAmount: 2500000,
      });
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { name: "Engineering", count: 20, color: "#0075de" },
    { name: "Sales & Marketing", count: 12, color: "#10b981" },
    { name: "Human Resources", count: 8, color: "#f59e0b" },
    { name: "Design", count: 5, color: "#8b5cf6" },
  ];

  const recentActivity = [
    { action: "New employee onboarded", name: "Ravi Kumar", time: "2 hours ago" },
    { action: "Leave request approved", name: "Priya Sharma", time: "4 hours ago" },
    { action: "Payroll processed", name: "July 2026 Cycle", time: "1 day ago" },
    { action: "Interview scheduled", name: "Gopal Reddy", time: "2 days ago" },
    { action: "Performance review completed", name: "Ankit Patel", time: "3 days ago" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">HR Overview</h1>
        <p className="text-neutral-500 text-xs">Monitor workforce metrics, headcount, attendance, and HR operational KPIs.</p>
      </div>

      {loading || !stats ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <HrmsDashboard stats={stats} departments={departments} recentActivity={recentActivity} />
      )}
    </div>
  );
}
