"use client";
import { DragEvent, useId, useState } from "react";
import { CheckCircle2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui";

export interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** e.g. ".csv" */
  accept?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Single-file drop zone. Click, keyboard (Enter/Space on the label) or drag-and-drop. */
export function FileUpload({ file, onFileChange, accept, label = "Select a file", hint, disabled }: FileUploadProps) {
  const id = useId();
  const [over, setOver] = useState(false);
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && !disabled) onFileChange(f);
  };
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed px-6 py-8 text-center transition-colors focus-within:shadow-[var(--focus-ring)]",
          over ? "border-[var(--accent)] bg-[var(--accent-tint)]" : file ? "border-[var(--success)] bg-[var(--success-tint)]" : "border-[var(--border-strong)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-hover)]",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input id={id} type="file" accept={accept} disabled={disabled} className="sr-only" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
        <span aria-hidden className={file ? "text-[var(--success)]" : "text-[var(--text-muted)]"}>
          {file ? <CheckCircle2 size={24} strokeWidth={1.5} /> : <Upload size={24} strokeWidth={1.5} />}
        </span>
        <span className="ds-t-body-strong text-[var(--text-primary)]">{file ? file.name : label}</span>
        <span className="ds-t-meta text-[var(--text-muted)]">{file ? formatSize(file.size) : hint || "Drop a file here or click to browse"}</span>
      </label>
      {file && (
        <div className="flex justify-end">
          <IconButton size={28} label="Remove file" icon={<X size={14} strokeWidth={1.5} />} onClick={() => onFileChange(null)} />
        </div>
      )}
    </div>
  );
}
