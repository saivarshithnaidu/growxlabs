"use client";

import { createContext, useContext, useState } from "react";
import { Download, FileSpreadsheet, FileText, X } from "lucide-react";
import { StructuredResponseFormatter, Table } from "./StructuredResponseFormatter";

/*
 * Artifacts: files the orchestrator made (documents, spreadsheets, PDFs). A card in the thread
 * opens the file in the right-hand panel; the preview comes from the tool result, and the file
 * itself downloads through a short-lived signed URL.
 */

export interface ArtifactResult {
  kind: "artifact";
  artifact: { id: string; name: string; format: "document" | "spreadsheet" | "pdf"; label: string; extension: string; sizeBytes: number; createdAt: string };
  preview: {
    title: string;
    sections?: Array<{ heading?: string; body: string }>;
    table?: { headers: string[]; rows: string[][] };
  };
}

export function isArtifactResult(value: unknown): value is ArtifactResult {
  return Boolean(value && typeof value === "object" && (value as { kind?: unknown }).kind === "artifact" && (value as { artifact?: { id?: unknown } }).artifact?.id);
}

export const ArtifactOpenContext = createContext<(artifact: ArtifactResult) => void>(() => {});

const formatSize = (bytes: number) => (bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

const iconButton =
  "ds-focus grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)] disabled:opacity-50";

function useDownload(artifactId: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/command-center/artifacts/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artifactId }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.signedUrl) throw new Error(body?.error?.message || "Couldn't prepare the download.");
      window.open(body.signedUrl, "_blank", "noopener");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't prepare the download.");
    } finally {
      setBusy(false);
    }
  }
  return { download, busy, error };
}

function FormatIcon({ format }: { format: ArtifactResult["artifact"]["format"] }) {
  const Icon = format === "spreadsheet" ? FileSpreadsheet : FileText;
  return <Icon size={18} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />;
}

/** The card in the conversation. */
export function ArtifactCard({ result }: { result: ArtifactResult }) {
  const open = useContext(ArtifactOpenContext);
  const { download, busy, error } = useDownload(result.artifact.id);
  const { artifact } = result;

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] py-2.5 pl-3.5 pr-2">
      <button type="button" onClick={() => open(result)} className="ds-focus flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-sm)] text-left focus-visible:shadow-[var(--focus-ring)]">
        <FormatIcon format={artifact.format} />
        <span className="min-w-0">
          <span className="ds-t-body-strong block truncate text-[var(--text-primary)]">{artifact.name}{artifact.extension}</span>
          <span className="ds-t-meta block text-[var(--text-muted)]">{error || `${artifact.label}, ${formatSize(artifact.sizeBytes)}`}</span>
        </span>
      </button>
      <button type="button" onClick={() => void download()} disabled={busy} aria-label={`Download ${artifact.name}`} title="Download" className={iconButton}>
        {busy ? <span aria-hidden className="ds-breathe size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" /> : <Download size={16} strokeWidth={1.5} />}
      </button>
    </div>
  );
}

/** The viewer on the right. */
export function ArtifactPanel({ result, onClose }: { result: ArtifactResult; onClose: () => void }) {
  const { download, busy, error } = useDownload(result.artifact.id);
  const { artifact, preview } = result;

  return (
    <aside aria-label={`${artifact.name} preview`} className="relative z-30 flex h-full w-[min(560px,45vw)] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="flex h-14 items-center gap-2 px-3">
        <FormatIcon format={artifact.format} />
        <p className="ds-t-body-strong min-w-0 flex-1 truncate text-[var(--text-primary)]" title={`${artifact.name}${artifact.extension}`}>
          {artifact.name}{artifact.extension}
        </p>
        <button type="button" onClick={() => void download()} disabled={busy} aria-label="Download" title="Download" className={iconButton}>
          {busy ? <span aria-hidden className="ds-breathe size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" /> : <Download size={16} strokeWidth={1.5} />}
        </button>
        <button type="button" onClick={onClose} aria-label="Close preview" title="Close" className={iconButton}>
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
      {error && <p className="ds-t-meta px-4 pb-2 text-[var(--danger)]">{error}</p>}

      <div className="custom-scrollbar flex-1 overflow-y-auto px-5 pb-8 pt-2">
        <h2 className="text-[20px] font-semibold leading-7 text-[var(--text-primary)]">{preview.title}</h2>
        <div className="mt-4 flex flex-col gap-5">
          {preview.sections?.map((section, i) => (
            <section key={i} className="flex flex-col gap-2">
              {section.heading && <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">{section.heading}</h3>}
              <StructuredResponseFormatter content={section.body} />
            </section>
          ))}
          {preview.table && preview.table.rows.length > 0 && <Table header={preview.table.headers} rows={preview.table.rows} />}
          {preview.table && preview.table.rows.length === 0 && <p className="ds-t-body text-[var(--text-muted)]">The table is empty.</p>}
        </div>
      </div>
    </aside>
  );
}
