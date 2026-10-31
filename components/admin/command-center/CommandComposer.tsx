"use client";

import { ArrowUp, Paperclip, Plus, Square, X } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { MentionMenu } from "./MentionMenu";
import type { ComposerAttachment, MentionOption } from "./command-center.types";
import { mentionOptions, replaceMention, SubmissionGate } from "./composer-logic";
import { cn } from "@/lib/utils";

interface Props {
  busy: boolean;
  onSubmit: (text: string, attachments: ComposerAttachment[]) => Promise<void>;
  onStop: () => void;
}

export function CommandComposer({ busy, onSubmit, onStop }: Props) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gate = useRef(new SubmissionGate());
  const options = useMemo(() => mentionOptions(value), [value]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [value]);

  async function submit() {
    const text = value.trim();
    if (!text && attachments.length === 0) return;
    if (busy || !gate.current.enter()) return;
    setError("");
    try {
      await onSubmit(text, attachments);
      setValue("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      gate.current.leave();
    }
  }

  function choose(option: MentionOption) {
    setValue((current) => replaceMention(current, option));
    setActiveIndex(0);
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const available = Math.max(0, 5 - attachments.length);
    [...files].slice(0, available).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        setError(`${file.name} exceeds the 8 MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 !== "string") return;
        setAttachments((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type || "application/octet-stream",
            base64,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  const canSend = Boolean(value.trim() || attachments.length);

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pb-5 pt-1 sm:px-6">
      <MentionMenu options={options} activeIndex={activeIndex} onSelect={choose} />

      <div className="relative rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] focus-within:border-[var(--text-disabled)]">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((file) => (
              <span key={file.id} className="ds-t-meta flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-active)] py-1 pl-2.5 pr-1 text-[var(--text-secondary)]">
                <Paperclip size={12} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                <span className="max-w-40 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((items) => items.filter((item) => item.id !== file.id))}
                  aria-label={`Remove ${file.name}`}
                  className="ds-focus grid size-5 place-items-center rounded-[var(--radius-xs)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]"
                >
                  <X size={12} strokeWidth={1.5} />
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          disabled={busy}
          rows={1}
          aria-label="Message"
          placeholder="Ask or instruct"
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (options.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              e.preventDefault();
              setActiveIndex((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
            } else if (options.length && (e.key === "Tab" || e.key === "Enter")) {
              e.preventDefault();
              choose(options[activeIndex]);
            } else if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          className="custom-scrollbar max-h-[180px] min-h-12 w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-[15px] leading-relaxed text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)] disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-2.5 pb-2.5">
          <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy || attachments.length >= 5}
            aria-label="Attach files"
            title="Attach files"
            className="ds-focus grid size-8 place-items-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)] disabled:opacity-40"
          >
            <Plus size={18} strokeWidth={1.5} />
          </button>

          {busy ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop"
              title="Stop"
              className="ds-focus grid size-8 place-items-center rounded-[var(--radius-full)] bg-[var(--bg-inverse)] text-[var(--text-inverse)] focus-visible:shadow-[var(--focus-ring)] active:opacity-80"
            >
              <Square size={12} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSend}
              aria-label="Send"
              title="Send"
              className={cn(
                "ds-focus grid size-8 place-items-center rounded-[var(--radius-full)] focus-visible:shadow-[var(--focus-ring)]",
                canSend
                  ? "bg-[var(--bg-inverse)] text-[var(--text-inverse)] active:opacity-80"
                  : "bg-[var(--bg-active)] text-[var(--text-disabled)] disabled:cursor-not-allowed"
              )}
            >
              <ArrowUp size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {error && <p role="alert" className="ds-t-meta mt-1.5 text-center text-[var(--danger)]">{error}</p>}
    </div>
  );
}
