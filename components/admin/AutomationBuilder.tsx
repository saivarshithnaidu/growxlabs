"use client";

import React, { useState } from "react";
import { Plus, Check, Play, Zap, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Rule {
  id: string;
  name: string;
  trigger_event: string;
  is_active: boolean;
  actions: any[];
}

interface RunLog {
  id: string;
  rule?: { name: string };
  trigger_record_id: string;
  status: string;
  executed_at: string;
  error_message?: string;
}

interface AutomationBuilderProps {
  initialRules: Rule[];
  recentRuns: RunLog[];
  onCreateRule: (rule: any) => Promise<void>;
}

const EVENTS = [
  { value: "company_created", label: "Company Created" },
  { value: "contact_created", label: "Contact Created" },
  { value: "deal_created", label: "Deal Created" },
  { value: "deal_stage_updated", label: "Deal Stage Updated" },
  { value: "task_completed", label: "Task Completed" }
];

const ACTION_TYPES = [
  { value: "assign_owner", label: "Assign Owner" },
  { value: "send_email", label: "Send Email" },
  { value: "create_task", label: "Create Task" },
  { value: "notify_manager", label: "Notify Manager" }
];

export function AutomationBuilder({ initialRules, recentRuns, onCreateRule }: AutomationBuilderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("company_created");
  const [actionType, setActionType] = useState("create_task");
  
  // Action details
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSubmitting(true);
    try {
      const actions: any[] = [];
      if (actionType === "send_email") {
        actions.push({
          type: "send_email",
          template_id: "welcome_template",
          subject: subject || "Welcome Partner",
          body_text: bodyText || "Thank you for partnering with us!"
        });
      } else if (actionType === "create_task") {
        actions.push({
          type: "create_task",
          task_title: taskTitle || "Follow-up Call",
          task_desc: "Auto-generated workflow action",
          due_days_offset: 2
        });
      } else {
        actions.push({
          type: "notify_manager",
          manager_id: "default_manager_id",
          title: "Lead update alert",
          message: "A new lead action has been triggered."
        });
      }

      const ruleData = {
        name,
        trigger_event: triggerEvent,
        conditions: {},
        actions,
        is_active: true
      };

      await onCreateRule(ruleData);
      alert("Automation rule created successfully!");
      setName("");
      setSubject("");
      setBodyText("");
      setTaskTitle("");
    } catch (e) {
      console.error(e);
      alert("Failed to build rule.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Rules list */}
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4 flex items-center gap-2">
            <Zap size={16} className="text-[#0075de]" /> Active Workflows Rules
          </h3>

          {rules.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-neutral-400">No automation rules defined yet.</div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center justify-between hover:border-[#0075de]/30 transition-all">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-snug">{rule.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Trigger: {rule.trigger_event}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-green-500 bg-green-500/5 px-2 py-0.5 rounded border border-green-200">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Audit runs */}
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Recent Automation Executions</h3>
          {recentRuns.length === 0 ? (
            <div className="text-center py-8 text-xs font-semibold text-neutral-400">No executions logged yet.</div>
          ) : (
            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    <th className="py-2 pl-2">Rule</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 pr-2 text-right">Run Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                      <td className="py-3 pl-2 text-neutral-900 font-bold">{run.rule?.name || "System Rule"}</td>
                      <td className="py-3">
                        <span className={run.status === "success" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right text-neutral-400 font-mono text-[10px]">
                        {new Date(run.executed_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Creator Form */}
      <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm h-fit">
        <form onSubmit={handleSubmitRule} className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">New Automation</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Rule Name</label>
            <Input
              required
              placeholder="e.g. Lead welcome email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 bg-[#f6f5f4] border-[#e6e6e6] text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Select Trigger</label>
            <select
              value={triggerEvent}
              onChange={(e) => setTriggerEvent(e.target.value)}
              className="w-full h-9 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-800 outline-none"
            >
              {EVENTS.map(ev => <option key={ev.value} value={ev.value}>{ev.label}</option>)}
            </select>
          </div>

          <div className="space-y-1 border-t border-[#e6e6e6] pt-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Trigger Action</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full h-9 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-800 outline-none"
            >
              {ACTION_TYPES.map(act => <option key={act.value} value={act.value}>{act.label}</option>)}
            </select>
          </div>

          {actionType === "send_email" && (
            <div className="space-y-3.5 bg-[#f6f5f4] p-3 rounded border border-[#e6e6e6]">
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase text-neutral-400">Subject</span>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Welcome [Name]"
                  className="h-8 bg-white border-[#e6e6e6] text-xs"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase text-neutral-400">Body</span>
                <textarea
                  rows={3}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Body text..."
                  className="w-full text-xs bg-white border border-[#e6e6e6] rounded p-2 focus:outline-none"
                />
              </div>
            </div>
          )}

          {actionType === "create_task" && (
            <div className="space-y-1 bg-[#f6f5f4] p-3 rounded border border-[#e6e6e6]">
              <span className="text-[8px] font-bold uppercase text-neutral-400">Task Title</span>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Call client [Company]"
                className="h-8 bg-white border-[#e6e6e6] text-xs"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0075de] text-white hover:bg-[#0075de]/90 font-bold uppercase tracking-widest text-[10px] h-10 rounded-md"
          >
            {submitting ? "Saving rule..." : "Activate Rule"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
