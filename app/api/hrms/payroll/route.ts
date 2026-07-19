import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseHrmsService } from "@/services/enterprise-hrms";

export async function GET() {
  try {
    const { data: payrolls, error } = await supabaseAdmin
      .from("payroll")
      .select("*, payroll_items(*, employee:employees(full_name, employee_id))")
      .order("payroll_month", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ payrolls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch payroll" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { payroll_month, employee_ids } = await request.json();

    if (!payroll_month || !employee_ids?.length) {
      throw new Error("Missing payroll_month or employee_ids");
    }

    // Fetch employees with designation salary
    const { data: employees, error: empErr } = await supabaseAdmin
      .from("employees")
      .select("*, designation:designations(salary_range_min)")
      .in("id", employee_ids);

    if (empErr) throw empErr;

    // Calculate totals
    let totalGross = 0;
    let totalAllowances = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    const items = (employees || []).map((emp: any) => {
      const basic = emp.designation?.salary_range_min ? Number(emp.designation.salary_range_min) / 12 : 30000;
      const allowances = basic * 0.4; // HRA + Transport
      const slip = EnterpriseHrmsService.calculateNetPayslip(basic, allowances);

      totalGross += basic;
      totalAllowances += allowances;
      totalDeductions += slip.pf_deduction + slip.esi_deduction + slip.tds_withheld;
      totalNet += slip.net_payable;

      return {
        employee_id: emp.id,
        basic_salary: basic,
        allowances,
        pf_deduction: slip.pf_deduction,
        esi_deduction: slip.esi_deduction,
        tds_withheld: slip.tds_withheld,
        net_payable: slip.net_payable
      };
    });

    // Create payroll run
    const { data: payroll, error: prErr } = await supabaseAdmin
      .from("payroll")
      .insert({
        payroll_month,
        gross_salary: totalGross,
        allowances: totalAllowances,
        deductions: totalDeductions,
        net_salary: totalNet,
        status: "DRAFT"
      })
      .select()
      .single();

    if (prErr) throw prErr;

    // Insert payroll items
    const payrollItems = items.map((item: any) => ({
      ...item,
      payroll_id: payroll.id
    }));

    const { error: itemErr } = await supabaseAdmin
      .from("payroll_items")
      .insert(payrollItems);

    if (itemErr) throw itemErr;

    return NextResponse.json({ payroll, items: payrollItems }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payroll generation failed" }, { status: 400 });
  }
}
