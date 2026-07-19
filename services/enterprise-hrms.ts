import { supabaseAdmin } from "@/lib/supabase/admin";

export class EnterpriseHrmsService {
  /**
   * Promotes a candidate to employee, seeding their leave balances.
   */
  static async promoteCandidateToEmployee(candidateId: string, employeeIdCode: string) {
    // 1. Fetch Candidate
    const { data: candidate, error: cErr } = await supabaseAdmin
      .from("candidates")
      .select("*, job:recruitment_jobs(*)")
      .eq("id", candidateId)
      .single();

    if (cErr || !candidate) throw new Error("Candidate not found");

    // 2. Mark Candidate as Hired
    await supabaseAdmin
      .from("candidates")
      .update({ stage: "HIRED" })
      .eq("id", candidateId);

    // 3. Create Employee Profile
    const { data: emp, error: empErr } = await supabaseAdmin
      .from("employees")
      .insert({
        employee_id: employeeIdCode,
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        joining_date: new Date().toISOString().split("T")[0],
        department_id: candidate.job?.department_id,
        designation_id: null, // Assign manually after onboarding
        status: "ACTIVE"
      })
      .select()
      .single();

    if (empErr || !emp) {
      throw new Error(`Failed to create employee profile: ${empErr?.message}`);
    }

    // 4. Seed Leave Balances (12 Sick, 12 Casual)
    await supabaseAdmin.from("leave_balances").insert([
      { employee_id: emp.id, leave_type: "SICK", allocated: 12, used: 0, remaining: 12 },
      { employee_id: emp.id, leave_type: "CASUAL", allocated: 12, used: 0, remaining: 12 }
    ]);

    // 5. Post Onboarding Audit Log
    await supabaseAdmin.from("hrms_audit_logs").insert({
      action: "EMPLOYEE_HIRED",
      details: { candidate_id: candidateId, employee_id: emp.id, name: emp.full_name }
    });

    return emp;
  }

  /**
   * Employee check-in punches with GPS coordinates tracking.
   */
  static async clockIn(employeeId: string, gpsCoords: string) {
    const today = new Date().toISOString().split("T")[0];
    
    // Check if already checked in today
    const { data: attendance } = await supabaseAdmin
      .from("attendance")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("work_date", today)
      .single();

    if (attendance) throw new Error("Employee already clocked in today");

    const { data: log, error } = await supabaseAdmin
      .from("attendance")
      .insert({
        employee_id: employeeId,
        work_date: today,
        check_in: new Date().toISOString(),
        gps_coordinates: gpsCoords,
        late_check_in: new Date().getHours() >= 10 // Late after 10 AM
      })
      .select()
      .single();

    if (error) throw error;
    return log;
  }

  /**
   * Employee check-out punches, compiling elapsed working hours.
   */
  static async clockOut(employeeId: string) {
    const today = new Date().toISOString().split("T")[0];

    const { data: attendance, error: attErr } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("work_date", today)
      .single();

    if (attErr || !attendance) throw new Error("No check-in record found for today");

    const checkoutTime = new Date();
    const checkinTime = new Date(attendance.check_in);
    
    // Calculate difference in hours
    const elapsedMs = checkoutTime.getTime() - checkinTime.getTime();
    const workingHours = Math.round((elapsedMs / (1000 * 60 * 60)) * 100) / 100;

    const { data: log, error } = await supabaseAdmin
      .from("attendance")
      .update({
        check_out: checkoutTime.toISOString(),
        working_hours: workingHours,
        overtime_hours: workingHours > 8 ? workingHours - 8 : 0
      })
      .eq("id", attendance.id)
      .select()
      .single();

    if (error) throw error;
    return log;
  }

  /**
   * Payslip Salary component calculations.
   * Basic salary deduction: PF (12%), ESI (1.75%), TDS withholding (10%).
   */
  static calculateNetPayslip(basic: number, allowances: number) {
    const pfDeduction = basic * 0.12;
    const esiDeduction = basic * 0.0175;
    const tdsWithheld = (basic + allowances) * 0.10;

    const totalDeductions = pfDeduction + esiDeduction + tdsWithheld;
    const netPayable = basic + allowances - totalDeductions;

    return {
      basic,
      allowances,
      pf_deduction: Math.round(pfDeduction * 100) / 100,
      esi_deduction: Math.round(esiDeduction * 100) / 100,
      tds_withheld: Math.round(tdsWithheld * 100) / 100,
      net_payable: Math.round(netPayable * 100) / 100
    };
  }
}
