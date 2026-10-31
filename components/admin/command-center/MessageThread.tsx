"use client";

import { AlertTriangle, Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CommandMessage, ToolActivity } from "./command-center.types";
import { FollowUps, StructuredResponseFormatter } from "./StructuredResponseFormatter";
import { ApprovalCard, isApprovalRequest } from "./ApprovalCard";
import { ToolResultView } from "./ToolResultView";
import { ArtifactCard, isArtifactResult } from "./ArtifactPanel";
import { LiveSteps } from "./LiveSteps";

interface Props {
  messages: CommandMessage[];
  busy: boolean;
  onSuggestion: (text: string) => void;
  onRetry?: () => void;
}

// One line each, and only things the orchestrator has tools for today.
const SUGGESTIONS = [
  "Summarize today's lead pipeline",
  "Which invoices are unpaid?",
  "Status of active projects",
  "Lead stats this month",
];

export function MessageThread({ messages, busy, onSuggestion, onRetry }: Props) {
  if (!messages.length) {
    return (
      <div className="mx-auto flex h-full max-w-2xl flex-col justify-center px-4 py-12">
        <h2 className="ds-t-title-md text-center text-[var(--text-primary)] sm:text-[22px] sm:leading-8">What needs doing?</h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((text) => (
            <li key={text}>
              <button
                type="button"
                onClick={() => onSuggestion(text)}
                className="ds-focus ds-t-body rounded-[var(--radius-full)] border border-[var(--border-strong)] px-3.5 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      {messages.map((message, idx) => (
        <MessageItem
          key={message.id || idx}
          message={message}
          streaming={busy && message === messages[messages.length - 1]}
          onSuggestion={busy ? undefined : onSuggestion}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}

function MessageItem({
  message,
  streaming,
  onSuggestion,
  onRetry
}: {
  message: CommandMessage;
  streaming: boolean;
  onSuggestion?: (text: string) => void;
  onRetry?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const user = message.sender === "user";

  if (user) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-[var(--radius-lg)] bg-[var(--bg-active)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--text-primary)]">
          {message.text}
        </div>
      </div>
    );
  }

  // Assistant response
  return (
    <div className="flex flex-col items-start w-full space-y-3 select-text">
      
      {/* While the reply is in progress: what is happening, step by step */}
      {streaming && (!message.text || (message.toolCalls?.length ?? 0) > 0) && (
        <LiveSteps toolCalls={message.toolCalls ?? []} hasText={Boolean(message.text)} />
      )}

      {/* The answer, then the data it came from, then anything waiting for approval */}
      {message.text && message.kind !== "error" && (
        <StructuredResponseFormatter content={message.text} onSuggestion={onSuggestion} hideFollowUps />
      )}

      {message.toolCalls?.map((t) => <ToolResultView key={`data-${t.id}`} tool={t} />)}

      {message.toolCalls?.map((t) => isArtifactResult(t.result) ? <ArtifactCard key={`file-${t.id}`} result={t.result} /> : null)}

      {message.toolCalls?.map((t) => isApprovalRequest(t.result) ? <ApprovalCard key={t.id} request={t.result} /> : null)}

      {message.text && message.kind !== "error" && !streaming && <FollowUps content={message.text} onSuggestion={onSuggestion} />}

      {!streaming && message.toolCalls && message.toolCalls.length > 0 && (
        <AgentToolCallingTimeline toolCalls={message.toolCalls} />
      )}

      {message.kind === "error" && (
        <div className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] bg-[var(--danger-tint)] px-4 py-3">
          <p className="ds-t-body flex items-center gap-2 text-[var(--text-primary)]">
            <AlertTriangle size={16} strokeWidth={1.5} className="shrink-0 text-[var(--danger)]" />
            {message.text || "That didn't complete."}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="ds-focus ds-t-body-strong shrink-0 rounded-[var(--radius-sm)] px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {message.text && !streaming && message.kind !== "error" && (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(message.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          aria-label={copied ? "Copied" : "Copy response"}
          title={copied ? "Copied" : "Copy"}
          className="ds-focus grid size-7 place-items-center rounded-[var(--radius-sm)] text-[var(--text-disabled)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
        >
          {copied ? <Check size={14} strokeWidth={1.5} className="text-[var(--success)]" /> : <Copy size={14} strokeWidth={1.5} />}
        </button>
      )}
    </div>
  );
}

/**
 * Senior Collapsible Tool Calling Activity Widget
 */
/** One quiet line per reply ("Used 2 tools"); expands to the raw calls when you need to check them. */
function AgentToolCallingTimeline({ toolCalls }: { toolCalls: ToolActivity[] }) {
  const [open, setOpen] = useState(false);
  const running = toolCalls.some((t) => t.status === "calling");

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="ds-focus ds-t-meta inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-1.5 py-1 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
      >
        {running
          ? <span aria-hidden className="ds-breathe mx-[3px] size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" />
          : <Check size={12} strokeWidth={1.5} className="text-[var(--success)]" />}
        Used {toolCalls.length} {toolCalls.length === 1 ? "tool" : "tools"}
        <ChevronDown size={12} strokeWidth={1.5} className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")} />
      </button>

      {open && (
        <ul className="mt-2 flex flex-col gap-2">
          {toolCalls.map((t) => (
            <li key={t.id} className="rounded-[var(--radius-md)] bg-[var(--bg-canvas)] p-3">
              <p className="ds-t-meta-strong flex items-center justify-between gap-2 text-[var(--text-secondary)]">
                <span className="ds-t-mono">{t.name}</span>
                <span className="text-[var(--text-muted)]">{t.status === "complete" ? "Done" : "Running"}</span>
              </p>
              {(t.result || t.args) ? (
                <pre className="custom-scrollbar mt-2 max-h-40 overflow-x-auto whitespace-pre-wrap text-[11px] leading-4 text-[var(--text-muted)]">
                  {t.result ? (typeof t.result === "string" ? t.result : JSON.stringify(t.result, null, 2)) : JSON.stringify(t.args, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
