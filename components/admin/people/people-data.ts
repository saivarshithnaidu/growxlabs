import type { BadgeVariant } from "@/src/components/ui";

export type Employee = {
  id: string;
  employee_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  joining_date: string | null;
  department_id: string | null;
  designation_id: string | null;
  reporting_manager_id: string | null;
  employment_type: string | null;
  work_location: string | null;
  status: string | null;
  department?: { name?: string } | null;
  designation?: { title?: string } | null;
};
export type Department = { id: string; name: string; head_id: string | null; description: string | null };
export type Designation = { id: string; title: string; level: string | null; department_id: string | null };

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Left" },
];
export const STATUS_BADGE: Record<string, BadgeVariant> = { ACTIVE: "success", ON_LEAVE: "warning", SUSPENDED: "danger", TERMINATED: "neutral" };
export const TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
];

export const statusLabel = (v?: string | null) => STATUS_OPTIONS.find((o) => o.value === v)?.label || "Unknown";
export const typeLabel = (v?: string | null) => TYPE_OPTIONS.find((o) => o.value === v)?.label || v || "";
export const formatDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

/** Fetch a JSON API, turning a failed response into an Error that carries the server's message. */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data as T;
}

export function sendJson<T>(url: string, method: "POST" | "PATCH", body: unknown) {
  return fetchJson<T>(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
