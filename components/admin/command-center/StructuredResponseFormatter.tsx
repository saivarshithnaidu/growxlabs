"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  onSuggestion?: (text: string) => void;
  /** Leave follow-ups out, for callers that render them after other content (see FollowUps). */
  hideFollowUps?: boolean;
}

/*
 * Renders the orchestrator's reply: a small, predictable markdown subset (paragraphs, headings,
 * lists, tables, code, quotes, inline emphasis and links). Follow-up questions at the end become
 * one-click suggestions. Data the tools returned is rendered separately, by ToolResultView.
 */

type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; level: number; text: string }
  | { kind: "ul" | "ol"; items: Array<{ text: string; depth: number }> }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "code"; lang: string; code: string }
  | { kind: "quote"; text: string }
  | { kind: "hr" };

const FOLLOW_UP_HEADING = /^(suggested next steps?|next steps?|follow[- ]?up questions?|suggested questions?)\s*:?$/i;

export function StructuredResponseFormatter({ content, onSuggestion, hideFollowUps }: Props) {
  if (!content) return null;
  const { blocks, followUps } = parse(content);

  return (
    <div className="flex w-full select-text flex-col gap-3 text-[15px] leading-7 text-[var(--text-primary)]">
      {blocks.map((block, i) => <BlockView key={i} block={block} />)}
      {!hideFollowUps && <FollowUpChips questions={followUps} onSuggestion={onSuggestion} />}
    </div>
  );
}

/** The follow-up questions at the end of a reply, as one-click chips. */
export function FollowUps({ content, onSuggestion }: { content: string; onSuggestion?: (text: string) => void }) {
  if (!content) return null;
  return <FollowUpChips questions={parse(content).followUps} onSuggestion={onSuggestion} />;
}

function FollowUpChips({ questions, onSuggestion }: { questions: string[]; onSuggestion?: (text: string) => void }) {
  const followUps = questions;
  return (
    <>
      {followUps.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2" aria-label="Suggested follow-ups">
          {followUps.map((q) => (
            <li key={q}>
              <button
                type="button"
                disabled={!onSuggestion}
                onClick={() => onSuggestion?.(q)}
                className="ds-focus ds-t-body rounded-[var(--radius-full)] border border-[var(--border-strong)] px-3 py-1 text-left text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)] disabled:cursor-default disabled:opacity-60"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ── Parsing ──────────────────────────────────────────────────────────

function parse(content: string): { blocks: Block[]; followUps: string[] } {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    const fence = trimmed.match(/^```\s*([\w+-]*)/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ kind: "code", lang: fence[1] || "", code: code.join("\n") });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { blocks.push({ kind: "hr" }); i++; continue; }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { blocks.push({ kind: "h", level: heading[1].length, text: heading[2].replace(/#+$/, "").trim() }); i++; continue; }

    if (trimmed.startsWith("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const header = cells(trimmed);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++].trim()));
      blocks.push({ kind: "table", header, rows });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      blocks.push({ kind: "quote", text: quote.join(" ") });
      continue;
    }

    const listItem = /^(\s*)([-*+•]|\d+[.)])\s+(.*)$/;
    if (listItem.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items: Array<{ text: string; depth: number }> = [];
      while (i < lines.length && (listItem.test(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length))) {
        const m = lines[i].match(listItem);
        if (m) items.push({ text: m[3], depth: m[1].length >= 2 ? 1 : 0 });
        else items[items.length - 1].text += " " + lines[i].trim();
        i++;
      }
      blocks.push({ kind: ordered ? "ol" : "ul", items });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|\||>|(\s*)([-*+•]|\d+[.)])\s)/.test(lines[i].trim())) para.push(lines[i++].trim());
    if (!para.length) para.push(lines[i++].trim());
    blocks.push({ kind: "p", text: para.join(" ") });
  }

  return extractFollowUps(blocks);
}

function cells(row: string): string[] {
  return row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

const plain = (text: string) => text.replace(/[*_`]/g, "").trim();

/** A trailing "Suggested next steps" list, or a closing question list, becomes clickable chips. */
function extractFollowUps(blocks: Block[]): { blocks: Block[]; followUps: string[] } {
  const out = [...blocks];
  let followUps: string[] = [];
  const last = out[out.length - 1];
  const beforeLast = out[out.length - 2];
  const isHeadingLike = (b?: Block) =>
    (b?.kind === "h" && FOLLOW_UP_HEADING.test(plain(b.text))) || (b?.kind === "p" && FOLLOW_UP_HEADING.test(plain(b.text)));

  if (last && (last.kind === "ul" || last.kind === "ol") && isHeadingLike(beforeLast)) {
    followUps = last.items.map((it) => plain(it.text)).filter((q) => q.length > 6);
    out.splice(out.length - 2, 2);
  } else if (last && (last.kind === "ul" || last.kind === "ol") && last.items.length <= 4 && last.items.every((it) => plain(it.text).endsWith("?"))) {
    followUps = last.items.map((it) => plain(it.text));
    out.pop();
  }
  return { blocks: out, followUps: followUps.slice(0, 3) };
}

// ── Rendering ────────────────────────────────────────────────────────

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return <p className="text-[var(--text-primary)]"><Inline text={block.text} /></p>;
    case "h": {
      const size = block.level <= 2 ? "text-[17px] leading-7" : "text-[15px] leading-7";
      return <p role="heading" aria-level={Math.min(block.level + 1, 6)} className={cn("mt-2 font-semibold text-[var(--text-primary)]", size)}><Inline text={block.text} /></p>;
    }
    case "ul":
    case "ol": {
      const Tag = block.kind === "ol" ? "ol" : "ul";
      return (
        <Tag className={cn("flex flex-col gap-1 pl-5", block.kind === "ol" ? "list-decimal" : "list-disc", "marker:text-[var(--text-disabled)]")}>
          {block.items.map((it, i) => (
            <li key={i} className={cn("pl-1", it.depth && "ml-4 list-[circle]")}><Inline text={it.text} /></li>
          ))}
        </Tag>
      );
    }
    case "table":
      return <Table header={block.header} rows={block.rows} />;
    case "code":
      return <CodeBlock lang={block.lang} code={block.code} />;
    case "quote":
      return <blockquote className="border-l-2 border-[var(--border-strong)] pl-3 text-[var(--text-secondary)]"><Inline text={block.text} /></blockquote>;
    case "hr":
      return <hr className="border-[var(--border)]" />;
  }
}

const NUMERIC = /^[-+]?[₹$€£]?\s?[\d,]+(\.\d+)?\s?(%|[kKmMlL]|cr|hrs?|h|days?|SP)?$/;

export function Table({ header, rows }: { header: string[]; rows: string[][] }) {
  const numeric = header.map((_, c) => rows.length > 0 && rows.every((r) => !r[c] || NUMERIC.test(plain(r[c]))));
  return (
    <div className="custom-scrollbar w-full overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
      <table className="w-full min-w-max border-collapse text-left text-[14px] leading-6">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {header.map((h, c) => (
              <th key={c} scope="col" className={cn("ds-t-meta-strong whitespace-nowrap px-3 py-2 text-[var(--text-muted)]", numeric[c] && "text-right")}><Inline text={h} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-[var(--border)] last:border-0">
              {header.map((_, c) => (
                <td key={c} className={cn("px-3 py-2 align-top text-[var(--text-secondary)]", numeric[c] && "ds-num whitespace-nowrap text-right text-[var(--text-primary)]")}>
                  <Inline text={row[c] ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-canvas)]">
      <div className="flex items-center justify-between px-3 pt-2">
        <span className="ds-t-mono text-[var(--text-disabled)]">{lang}</span>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          aria-label={copied ? "Copied" : "Copy code"}
          title={copied ? "Copied" : "Copy"}
          className="ds-focus grid size-7 place-items-center rounded-[var(--radius-sm)] text-[var(--text-disabled)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]"
        >
          {copied ? <Check size={14} strokeWidth={1.5} className="text-[var(--success)]" /> : <Copy size={14} strokeWidth={1.5} />}
        </button>
      </div>
      <pre className="custom-scrollbar overflow-x-auto px-3 pb-3 pt-1 font-mono text-[13px] leading-5 text-[var(--text-secondary)]">{code}</pre>
    </div>
  );
}

/** Bold, italic, inline code and links. Links open only for http(s) and in-app paths. */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s][^*]*)\*|_([^_\s][^_]*)_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2] || m[3]) parts.push(<strong key={key++} className="font-semibold text-[var(--text-primary)]">{m[2] || m[3]}</strong>);
    else if (m[4]) parts.push(<code key={key++} className="rounded-[var(--radius-xs)] bg-[var(--bg-active)] px-1 py-0.5 font-mono text-[0.9em]">{m[4]}</code>);
    else if (m[5]) {
      const href = m[6];
      const safe = /^(https?:\/\/|\/)/.test(href);
      parts.push(safe
        ? <a key={key++} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className="ds-focus rounded-[var(--radius-xs)] text-[var(--accent)] underline-offset-2 hover:underline focus-visible:shadow-[var(--focus-ring)]">{m[5]}</a>
        : <span key={key++}>{m[5]}</span>);
    } else if (m[7] || m[8]) parts.push(<em key={key++}>{m[7] || m[8]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
