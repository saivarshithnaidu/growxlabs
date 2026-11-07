import { redirect } from "next/navigation";

/* The employee directory lives at /admin/people; this keeps old links working. */
export default function EmployeesPage() {
  redirect("/admin/people");
}
