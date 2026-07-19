// Workflow Automation Engine Tests
import { WorkflowEngine } from "@/services/workflow-engine";

export async function testWorkflowEngine() {
  console.log("Running Workflow Automation Engine Tests...");

  // Mock rule
  const rule = {
    id: "mock_rule_id",
    name: "Mock Rule: Test trigger welcome task",
    trigger_event: "deal_created",
    conditions: { value: { greater_than: 10000 } },
    actions: [
      {
        type: "create_task",
        task_title: "Audit High Value Deal [Company]",
        task_desc: "Action triggered by mock workflow test",
        due_days_offset: 1
      }
    ]
  };

  console.log(`Evaluating rule: ${rule.name}...`);

  // Mock deal record
  const mockDeal = {
    id: "mock_deal_id",
    name: "Mock Deal Acme",
    value: 55000,
    company_id: "mock_company_id",
    contact_id: "mock_contact_id"
  };

  try {
    // 1. Evaluate conditions
    const matches = (WorkflowEngine as any).evaluateConditions(rule.conditions, mockDeal);
    if (!matches) {
      throw new Error("Condition evaluation failed: Expected value 55000 > 10000 to match rule");
    }
    console.log("✓ Condition evaluation passed (55000 > 10000).");

    // 2. Evaluate negative condition check
    const badDeal = { value: 5000 };
    const noMatch = (WorkflowEngine as any).evaluateConditions(rule.conditions, badDeal);
    if (noMatch) {
      throw new Error("Condition evaluation failed: Expected value 5000 to not match rule");
    }
    console.log("✓ Negative condition check passed (5000 <= 10000 does not trigger).");

    console.log("✓ All workflow engine unit assertions passed.");
    return true;
  } catch (err: any) {
    console.error("Workflow Engine Test Failed:", err.message);
    return false;
  }
}
