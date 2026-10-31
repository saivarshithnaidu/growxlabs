import "server-only";

import { z } from "zod";
import { ArtifactService } from "../../artifacts/artifact-service";
import { ToolExecutor } from "../registry/tool-types";

/*
 * Lets the orchestrator produce a file (document, spreadsheet or PDF) from data it already has.
 * The result carries a preview (the same title, sections and table) so the chat can show the
 * artifact in the side panel without downloading it; the file itself is fetched by signed URL.
 * Only formats with a real generator are offered: Markdown documents, CSV spreadsheets, PDFs.
 */

const FORMAT = {
  document: { type: "markdown", label: "Document", extension: ".md" },
  spreadsheet: { type: "csv", label: "Spreadsheet", extension: ".csv" },
  pdf: { type: "pdf", label: "PDF", extension: ".pdf" },
} as const;

const CreateArtifactSchema = z.object({
  format: z.enum(["document", "spreadsheet", "pdf"]),
  name: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  sections: z.array(z.object({ heading: z.string().max(200).optional(), body: z.string().max(20000) })).max(40).optional(),
  table: z.object({
    headers: z.array(z.string().max(120)).min(1).max(20),
    rows: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])).max(20)).max(2000),
  }).optional(),
});

export interface ArtifactToolResult {
  kind: "artifact";
  artifact: { id: string; name: string; format: keyof typeof FORMAT; label: string; extension: string; sizeBytes: number; createdAt: string };
  preview: {
    title: string;
    sections?: Array<{ heading?: string; body: string }>;
    table?: { headers: string[]; rows: string[][] };
  };
}

export const createArtifactExecutor: ToolExecutor<z.infer<typeof CreateArtifactSchema>, ArtifactToolResult> = {
  name: "create_artifact",
  description: "Create a downloadable file the user can open in the side panel: a document (Markdown), a spreadsheet (CSV, opens in Excel) or a PDF. Fill it only with data from tool results in this conversation or text the user gave you.",
  inputSchema: CreateArtifactSchema,
  riskLevel: "low",
  requiredPermissions: [],
  async execute(input, context) {
    const format = FORMAT[input.format];
    const table = input.table
      ? { headers: input.table.headers, rows: input.table.rows.map((r) => input.table!.headers.map((_, i) => (r[i] === null || r[i] === undefined ? "" : String(r[i])))) }
      : undefined;
    if (input.format === "spreadsheet" && !table) throw new Error("A spreadsheet needs a table.");

    const record = await ArtifactService.generateArtifact({
      organisationId: context.commandContext.organizationId,
      workspaceId: context.commandContext.workspaceId,
      requestedByUserId: context.commandContext.userId,
      artifactType: format.type,
      name: input.name,
      content: { title: input.title, sections: input.sections, table },
    });

    return {
      kind: "artifact",
      artifact: {
        id: record.id,
        name: record.name,
        format: input.format,
        label: format.label,
        extension: record.fileExtension || format.extension,
        sizeBytes: record.sizeBytes,
        createdAt: record.createdAt,
      },
      preview: { title: input.title, sections: input.sections, table },
    };
  },
};
