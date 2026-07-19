"use client";

import React, { useState } from "react";
import { DollarSign, User, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description?: string;
  story_points: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'BLOCKED' | 'DONE';
  assignee?: { name: string };
  due_date?: string;
}

interface AgileKanbanProps {
  initialTasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => Promise<void>;
}

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: "BACKLOG", label: "Backlog", color: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  { id: "TODO", label: "To Do", color: "bg-neutral-100 text-neutral-800 border-neutral-300" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50 text-[#0075de] border-blue-200" },
  { id: "REVIEW", label: "Review", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "TESTING", label: "Testing", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { id: "BLOCKED", label: "Blocked", color: "bg-red-50 text-red-600 border-red-200" },
  { id: "DONE", label: "Done", color: "bg-green-50 text-green-600 border-green-200" }
];

export function AgileKanban({ initialTasks, onTaskMove }: AgileKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedId;
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      // Optimistic Update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));
      try {
        await onTaskMove(taskId, targetStatus);
      } catch (err) {
        console.error("Failed to update status:", err);
        setTasks(initialTasks);
      }
    }
    setDraggedId(null);
  };

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-500/10 text-red-600 border border-red-200";
      case "HIGH": return "bg-orange-500/10 text-orange-600 border border-orange-200";
      case "MEDIUM": return "bg-blue-500/10 text-blue-600 border border-blue-200";
      default: return "bg-neutral-100 text-neutral-500 border border-neutral-200";
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-none h-[calc(100vh-16rem)] min-h-[500px]">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);
        const colPoints = colTasks.reduce((acc, curr) => acc + (curr.story_points || 0), 0);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-shrink-0 w-72 flex flex-col bg-[#f6f5f4] border border-[#e6e6e6] rounded-lg p-3"
          >
            {/* Column Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 tracking-tight leading-none mb-1">{col.label}</h3>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{colPoints} Story Points</span>
              </div>
              <span className="text-[10px] font-bold bg-white text-[#0075de] border border-[#e6e6e6] px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* List Container */}
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-6">
              {colTasks.length === 0 ? (
                <div className="h-24 border border-dashed border-[#e6e6e6] rounded-md flex items-center justify-center text-center p-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Drag tasks here</span>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={cn(
                      "bg-white border border-[#e6e6e6] p-3.5 rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all duration-250 hover:border-[#0075de]/30 hover:shadow-md",
                      draggedId === task.id && "opacity-45"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2.5 mb-2">
                      <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase", getPriorityStyle(task.priority))}>
                        {task.priority}
                      </span>
                      <span className="text-[9px] font-black font-mono text-neutral-400 bg-neutral-50 border border-neutral-200/60 px-1.5 py-0.5 rounded">
                        {task.story_points || 0} SP
                      </span>
                    </div>

                    <h4 className="text-[11px] font-bold text-neutral-900 leading-snug mb-2">{task.title}</h4>

                    <div className="border-t border-[#e6e6e6]/60 pt-2 flex items-center justify-between text-[9px] font-semibold text-neutral-400">
                      <span className="flex items-center gap-1 text-neutral-900 font-bold">
                        <User size={10} className="text-[#0075de]" />
                        {task.assignee?.name || "Unassigned"}
                      </span>
                      <span>{task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
