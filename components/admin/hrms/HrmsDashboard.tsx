"use client";

import React from "react";
import { Users, UserCheck, UserPlus, CalendarOff, CalendarCheck, AlertCircle, Briefcase, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface HrmsDashboardProps {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    newHires: number;
    onLeave: number;
    attendancePercent: number;
    pendingApprovals: number;
    openPositions: number;
    payrollAmount: number;
  };
  departments: { name: string; count: number; color: string }[];
  recentActivity: { action: string; name: string; time: string }[];
}

export function HrmsDashboard({ stats, departments, recentActivity }: HrmsDashboardProps) {
  const maxDeptCount = Math.max(...departments.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Row 1: Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Employees</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.totalEmployees}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">Across all departments</p>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Employees</span>
            <UserCheck className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.activeEmployees}</h3>
          <span className="text-green-600 bg-green-500/5 px-2 py-0.5 rounded border border-green-200 text-[8px] font-bold">
            {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% Active
          </span>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">New Hires</span>
            <UserPlus className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.newHires}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">This month</p>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">On Leave Today</span>
            <CalendarOff className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.onLeave}</h3>
          <span className="text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-200 text-[8px] font-bold">Absent</span>
        </Card>
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Attendance Today</span>
            <CalendarCheck className="h-4 w-4 text-teal-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.attendancePercent}%</h3>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2">
            <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${stats.attendancePercent}%` }} />
          </div>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pending Approvals</span>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.pendingApprovals}</h3>
          <span className="text-orange-600 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-200 text-[8px] font-bold">Action Needed</span>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Open Positions</span>
            <Briefcase className="h-4 w-4 text-violet-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">{stats.openPositions}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">Active job listings</p>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Payroll This Month</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">₹{stats.payrollAmount.toLocaleString()}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">Gross salary outflow</p>
        </Card>
      </div>

      {/* Row 3: Department Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Department Distribution */}
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Department Distribution</h4>
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-neutral-700">{dept.name}</span>
                  <span className="text-xs font-mono font-bold text-neutral-500">{dept.count}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(dept.count / maxDeptCount) * 100}%`, backgroundColor: dept.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Recent Activity</h4>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="relative mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {idx < recentActivity.length - 1 && (
                    <div className="absolute top-2 left-[3px] w-0.5 h-6 bg-neutral-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 truncate">{item.action}</p>
                  <p className="text-[9px] text-neutral-400 font-medium">{item.name} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
