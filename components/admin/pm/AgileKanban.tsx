"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button, FilterSelect, IconButton, Input, SearchInput, Select, Textarea, type BadgeVariant } from "@/src/components/ui";
import { KanbanBoard, KanbanCard, KanbanColumn, type KanbanTone } from "@/src/components/patterns";
import { IconIssueType, IconSubtasks } from "./PMIcons";

export interface Task {
  id: string;
  key?: string;
  title: string;
  description?: string;
  story_points: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "TESTING" | "BLOCKED" | "DONE";
  assignee?: { name: string; email?: string; avatar?: string };
  due_date?: string;
  type?: "task" | "story" | "bug" | "spike";
  milestone?: string;
  subtasks_completed?: number;
  subtasks_total?: number;
}

interface AgileKanbanProps {
  initialTasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task["status"]) => Promise<void>;
  onTaskCreate?: (newTask: Partial<Task>) => Promise<void>;
}

const COLUMNS: { id: Task["status"]; label: string; tone: KanbanTone }[] = [
  { id: "BACKLOG", label: "Backlog", tone: "neutral" },
  { id: "TODO", label: "To do", tone: "neutral" },
  { id: "IN_PROGRESS", label: "In progress", tone: "accent" },
  { id: "REVIEW", label: "Review", tone: "warning" },
  { id: "TESTING", label: "Testing", tone: "accent" },
  { id: "BLOCKED", label: "Blocked", tone: "danger" },
  { id: "DONE", label: "Done", tone: "success" }
];

const PRIORITY: Record<Task["priority"], { label: string; variant: BadgeVariant }> = {
  CRITICAL: { label: "Critical", variant: "danger" },
  HIGH: { label: "High", variant: "warning" },
  MEDIUM: { label: "Medium", variant: "info" },
  LOW: { label: "Low", variant: "neutral" }
};
const PRIORITY_OPTIONS = (Object.keys(PRIORITY) as Task["priority"][]).map((p) => ({ value: p, label: PRIORITY[p].label }));

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function AgileKanban({ initialTasks, onTaskMove, onTaskCreate }: AgileKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Task["status"] | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Inline quick-add state
  const [addingCol, setAddingCol] = useState<Task["status"] | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("MEDIUM");
  const [newPoints, setNewPoints] = useState<number>(2);

  // Synchronize when initialTasks change
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colId: Task["status"]) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedId;
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t)));
      try {
        await onTaskMove(taskId, targetStatus);
      } catch (err) {
        console.error("Failed to update status:", err);
        setTasks(initialTasks);
      }
    }
    setDraggedId(null);
  };

  const openQuickAdd = (status: Task["status"]) => {
    setAddingCol(status);
    setNewTitle("");
  };

  const handleQuickAdd = async (status: Task["status"]) => {
    if (!newTitle.trim()) return;

    const key = `TRX-${String(tasks.length + 1).padStart(2, "0")}`;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      key,
      title: newTitle.trim(),
      status,
      priority: newPriority,
      story_points: newPoints,
      type: "task",
      milestone: "Sprint Execution"
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
    setAddingCol(null);

    if (onTaskCreate) {
      try {
        await onTaskCreate(newTask);
      } catch (e) {
        console.error("Failed to save new task:", e);
      }
    }
  };

  // Filtered task set
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.key && t.key.toLowerCase().includes(q)) ||
        (t.milestone && t.milestone.toLowerCase().includes(q));
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const filtered = filteredTasks.length !== tasks.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full max-w-xs">
          <SearchInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Search by key, title or milestone" aria-label="Search tasks" />
        </div>
        <FilterSelect label="Priority" allLabel="All priorities" value={priorityFilter} options={PRIORITY_OPTIONS} onChange={setPriorityFilter} />
        {filtered && (
          <span className="ds-t-meta ds-num text-[var(--text-muted)]">Showing {filteredTasks.length} of {tasks.length}</span>
        )}
      </div>

      {/* Columns */}
      <KanbanBoard label="Task board">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const colPoints = colTasks.reduce((acc, curr) => acc + (curr.story_points || 0), 0);
          const isAdding = addingCol === col.id;
          const compact = colTasks.length === 0 && !isAdding;

          return (
            <KanbanColumn
              key={col.id}
              title={col.label}
              count={colTasks.length}
              tone={col.tone}
              meta={colPoints > 0 ? `${colPoints} SP` : undefined}
              className={cn(compact ? "w-48" : "w-72", dragOverCol === col.id && "border-[var(--accent)]")}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              actions={!isAdding && <IconButton size={28} label={`Add task to ${col.label}`} icon={<Plus size={14} strokeWidth={1.5} />} onClick={() => openQuickAdd(col.id)} />}
              emptyText={isAdding ? undefined : "No tasks"}
            >
              {isAdding && (
                <li className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--accent)] bg-[var(--bg-surface)] p-2">
                  <Textarea
                    autoFocus
                    rows={2}
                    value={newTitle}
                    aria-label="New task title"
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleQuickAdd(col.id);
                      } else if (e.key === "Escape") {
                        setAddingCol(null);
                      }
                    }}
                    placeholder="Task title"
                  />
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <Select size={28} aria-label="Priority" value={newPriority} onValueChange={(v) => setNewPriority(v as Task["priority"])} options={PRIORITY_OPTIONS} />
                    </div>
                    <Input
                      size={28}
                      type="number"
                      min={0}
                      max={13}
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      aria-label="Story points"
                      className="w-16"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size={28} variant="ghost" onClick={() => setAddingCol(null)}>Cancel</Button>
                    <Button size={28} variant="primary" disabled={!newTitle.trim()} onClick={() => void handleQuickAdd(col.id)}>Add task</Button>
                  </div>
                </li>
              )}

              {colTasks.map((task, idx) => {
                const issueKey = task.key || `TRX-${String(idx + 1).padStart(2, "0")}`;
                const due = formatDate(task.due_date);
                return (
                  <KanbanCard
                    key={task.id}
                    title={task.title}
                    meta={
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <IconIssueType type={task.type || "task"} size={12} />
                        <span className="ds-num">{issueKey}</span>
                        {task.milestone && <span className="truncate">{task.milestone}</span>}
                      </span>
                    }
                    badges={
                      <>
                        <Badge variant={PRIORITY[task.priority]?.variant || "neutral"}>{PRIORITY[task.priority]?.label || task.priority}</Badge>
                        <Badge variant="neutral" noDot>{task.story_points || 0} SP</Badge>
                        {task.subtasks_total ? (
                          <Badge variant="neutral" noDot>
                            <IconSubtasks size={10} />
                            {task.subtasks_completed || 0}/{task.subtasks_total}
                          </Badge>
                        ) : null}
                      </>
                    }
                    footnote={due ? `Due ${due}` : undefined}
                    assignee={task.assignee?.name ? <Avatar name={task.assignee.name} size={20} /> : undefined}
                    draggable
                    dragging={draggedId === task.id}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                  />
                );
              })}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </div>
  );
}
