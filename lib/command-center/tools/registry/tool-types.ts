import { ZodType } from "zod";
import { CommandCenterContext } from "../../context/command-center-context";

export interface ToolExecutionContext {
  commandContext: CommandCenterContext;
  sendEvent?: (event: string, data: unknown) => void;
  baseUrl?: string;
  /** Set only by the approval endpoint, after the signed-in user clicked Approve. */
  approved?: boolean;
}

export interface ToolExecutionResult<TOutput = unknown> {
  success: boolean;
  data?: TOutput;
  error?: string;
}

/** What the approval card shows before a write runs. */
export interface ToolPreview {
  summary: string;
  details?: Array<{ label: string; value: string }>;
}

export interface ToolExecutor<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: ZodType<TInput>;
  outputSchema?: ZodType<TOutput>;
  riskLevel: "low" | "medium" | "high";
  requiredPermissions: string[];
  /**
   * When true, a model-initiated call only returns an approval request; the action runs
   * when the user approves it. `preview` describes the action for the card (and should
   * fail early when the action cannot run, e.g. the invoice is already paid).
   */
  requiresApproval?: boolean;
  preview?(input: TInput, context: ToolExecutionContext): Promise<ToolPreview>;
  execute(
    input: TInput,
    context: ToolExecutionContext
  ): Promise<TOutput>;
}
