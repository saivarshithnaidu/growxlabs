/**
 * What the directory may read and write. Aadhaar, PAN, passport, bank, address, date of birth and
 * blood group are deliberately absent, so they can never reach a browser through these APIs.
 */
export const EMPLOYEE_COLUMNS =
  "id, employee_id, full_name, email, phone, joining_date, department_id, designation_id, reporting_manager_id, employment_type, work_location, status, created_at, department:departments(name), designation:designations(title)";

const WRITABLE = [
  "employee_id",
  "full_name",
  "email",
  "phone",
  "joining_date",
  "department_id",
  "designation_id",
  "reporting_manager_id",
  "employment_type",
  "work_location",
  "status",
] as const;

/** Keeps writable fields only; blanks become null so optional dates and references stay valid. */
export function employeeFields(body: unknown): Record<string, string | null> {
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const fields: Record<string, string | null> = {};
  for (const key of WRITABLE) {
    if (!(key in input)) continue;
    const value = input[key];
    fields[key] = typeof value === "string" && value.trim() ? value.trim() : null;
  }
  return fields;
}
