import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { CAREERS_ORGANISATION } from "@/lib/careers/jobs";

/**
 * The people directory, read from the system of record: the `people` schema plus work emails from
 * `identity`. Writes stay with the hiring and HRMS flows, which keep employment history and versions.
 */
export async function loadDirectory() {
  const people = () => supabaseAdmin.schema("people");
  const [employees, records, departments, designations, identities] = await Promise.all([
    people().from("employees").select("id,employee_number,first_name,last_name").eq("organisation_id", CAREERS_ORGANISATION).is("deleted_at", null),
    people().from("employment_records").select("employee_id,department_id,designation_id,manager_employee_id,joining_date,employment_type,work_location,status").eq("organisation_id", CAREERS_ORGANISATION).is("valid_to", null),
    people().from("departments").select("id,name,head_employee_id,description").eq("organisation_id", CAREERS_ORGANISATION).is("deleted_at", null).order("name"),
    people().from("designations").select("id,name,level,department_id").eq("organisation_id", CAREERS_ORGANISATION).is("deleted_at", null).order("name"),
    supabaseAdmin.schema("identity").from("employee_identities").select("employee_id,email"),
  ]);
  const failed = [employees, records, departments, designations].find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  const departmentName = new Map((departments.data || []).map((d) => [d.id, d.name]));
  const designationName = new Map((designations.data || []).map((d) => [d.id, d.name]));
  const recordOf = new Map((records.data || []).map((r) => [r.employee_id, r]));
  const emailOf = new Map((identities.data || []).map((i) => [i.employee_id, i.email]));

  return {
    employees: (employees.data || [])
      .map((e) => {
        const r = recordOf.get(e.id);
        return {
          id: e.id,
          employee_id: e.employee_number,
          full_name: [e.first_name, e.last_name].filter(Boolean).join(" "),
          email: emailOf.get(e.id) || null,
          joining_date: r?.joining_date || null,
          department_id: r?.department_id || null,
          designation_id: r?.designation_id || null,
          reporting_manager_id: r?.manager_employee_id || null,
          employment_type: r?.employment_type ? String(r.employment_type).toUpperCase() : null,
          work_location: r?.work_location || null,
          status: r?.status ? String(r.status).toUpperCase() : null,
          department: { name: departmentName.get(r?.department_id) },
          designation: { title: designationName.get(r?.designation_id) },
        };
      })
      .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    departments: (departments.data || []).map((d) => ({ id: d.id, name: d.name, head_id: d.head_employee_id, description: d.description })),
    designations: (designations.data || []).map((d) => ({ id: d.id, title: d.name, level: d.level == null ? null : String(d.level), department_id: d.department_id })),
  };
}
