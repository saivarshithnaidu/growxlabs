import { ToolExecutor, ToolExecutionContext } from "./tool-types";
import { getCompanyStatsExecutor, queryLeadsExecutor, createLeadExecutor, createLeadsBatchExecutor, batchCreateLeadsExecutor } from "../executors/leads.executor";
import { generateProposalExecutor } from "../executors/proposal.executor";
import { searchWebExecutor, spawnSubagentExecutor } from "../executors/search.executor";
import { getBlogPostsStatsExecutor, queryWishGameDataExecutor, sendBlogToSubscribersExecutor } from "../executors/content.executor";
import {
  getAdminUsersExecutor,
  getAdminAgreementsExecutor,
  getAdminInvoicesExecutor,
  createAdminInvoiceExecutor,
  getAdminProjectsExecutor,
  createAdminProjectExecutor,
  sendAdminInvoiceExecutor
} from "../executors/admin-finance.executor";
import {
  getBillingOverviewExecutor,
  listConsultingInvoicesExecutor,
  listConsultingPaymentsExecutor,
  issueConsultingInvoiceExecutor,
  decideConsultingPaymentExecutor,
  createMilestoneInvoiceExecutor
} from "../executors/billing.executor";
import { createArtifactExecutor } from "../executors/artifact.executor";
import { createApproval } from "../../approvals/pending-action";

export class ToolRegistry {
  private static executors = new Map<string, ToolExecutor<any, any>>();

  static {
    this.register(getCompanyStatsExecutor);
    this.register(queryLeadsExecutor);
    this.register(createLeadExecutor);
    this.register(createLeadsBatchExecutor);
    this.register(batchCreateLeadsExecutor);
    this.register(generateProposalExecutor);
    this.register(searchWebExecutor);
    this.register(spawnSubagentExecutor);
    this.register(getBlogPostsStatsExecutor);
    this.register(queryWishGameDataExecutor);
    this.register(sendBlogToSubscribersExecutor);
    this.register(getAdminUsersExecutor);
    this.register(getAdminAgreementsExecutor);
    this.register(getAdminInvoicesExecutor);
    this.register(createAdminInvoiceExecutor);
    this.register(getAdminProjectsExecutor);
    this.register(createAdminProjectExecutor);
    this.register(sendAdminInvoiceExecutor);
    this.register(getBillingOverviewExecutor);
    this.register(listConsultingInvoicesExecutor);
    this.register(listConsultingPaymentsExecutor);
    this.register(issueConsultingInvoiceExecutor);
    this.register(decideConsultingPaymentExecutor);
    this.register(createMilestoneInvoiceExecutor);
    this.register(createArtifactExecutor);
  }

  static register(executor: ToolExecutor<any, any>): void {
    this.executors.set(executor.name, executor);
  }

  static get(name: string): ToolExecutor<any, any> | undefined {
    return this.executors.get(name);
  }

  static has(name: string): boolean {
    return this.executors.has(name);
  }

  static listNames(): string[] {
    return Array.from(this.executors.keys());
  }

  static async executeTool(
    name: string,
    args: Record<string, unknown>,
    context: ToolExecutionContext
  ): Promise<unknown> {
    const executor = this.get(name);
    if (!executor) {
      throw new Error(`Tool "${name}" is not registered in ToolRegistry.`);
    }

    // Permission enforcement
    if (executor.requiredPermissions && executor.requiredPermissions.length > 0) {
      const userPerms = context.commandContext.permissions || [];
      const hasPermission = executor.requiredPermissions.every(p => userPerms.includes(p));
      if (!hasPermission) {
        throw new Error(`Permission denied for tool "${name}". Required: ${executor.requiredPermissions.join(", ")}`);
      }
    }

    // Zod Input Validation
    const parsedInput = executor.inputSchema.parse(args);

    // Writes wait for the user: the model gets a signed approval request, not the result.
    if (executor.requiresApproval && !context.approved) {
      const preview = executor.preview
        ? await executor.preview(parsedInput, context)
        : { summary: `Run ${name}`, details: [] };
      return createApproval(
        { tool: name, args: parsedInput as Record<string, unknown>, userId: context.commandContext.userId, summary: preview.summary },
        preview.details
      );
    }

    // Execute tool
    return await executor.execute(parsedInput, context);
  }
}
