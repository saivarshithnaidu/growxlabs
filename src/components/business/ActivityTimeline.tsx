import { Calendar, CheckSquare, Clock, FileText, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import { Timeline, TimelineTone, formatRelative, type NavIcon } from "../ui";
import { EmptyState } from "../patterns/States";

export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "TASK" | "NOTE" | "WHATSAPP" | "SMS" | "LINKEDIN";

export interface Activity {
  id: string;
  type: ActivityType | string;
  title: string;
  description?: string | null;
  created_at: string;
  performed_by_name?: string | null;
}

const TYPES: Record<string, { icon: NavIcon; tone: TimelineTone; label: string }> = {
  CALL: { icon: Phone, tone: "warning", label: "Call" },
  EMAIL: { icon: Mail, tone: "accent", label: "Email" },
  MEETING: { icon: Calendar, tone: "success", label: "Meeting" },
  TASK: { icon: CheckSquare, tone: "neutral", label: "Task" },
  NOTE: { icon: FileText, tone: "neutral", label: "Note" },
  WHATSAPP: { icon: Send, tone: "success", label: "WhatsApp" },
  SMS: { icon: MessageSquare, tone: "neutral", label: "SMS" },
  LINKEDIN: { icon: User, tone: "accent", label: "LinkedIn" },
};

export interface ActivityTimelineProps {
  activities: Activity[];
  emptyTitle?: string;
  emptyDescription?: string;
}

/** CRM activity feed (calls, emails, meetings…) on top of Timeline. */
export function ActivityTimeline({ activities, emptyTitle = "Timeline is quiet", emptyDescription = "No activities logged yet. Interactions will appear here chronologically." }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return <EmptyState icon={<Clock size={24} strokeWidth={1.5} />} title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <Timeline
      label="Activity"
      items={activities.map((a) => {
        const t = TYPES[a.type] || TYPES.NOTE;
        const Icon = t.icon;
        return {
          id: a.id,
          title: a.title,
          time: <span title={new Date(a.created_at).toLocaleString()}>{formatRelative(a.created_at)}</span>,
          meta: [t.label, a.performed_by_name].filter(Boolean).join(" · "),
          body: a.description || undefined,
          icon: <Icon size={12} strokeWidth={1.5} />,
          tone: t.tone,
        };
      })}
    />
  );
}
