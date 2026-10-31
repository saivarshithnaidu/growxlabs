"use client";

import { PanelLeft, PanelRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommandComposer } from "./CommandComposer";
import { CommandSidebar } from "./CommandSidebar";
import { ContextFlyout } from "./ContextFlyout";
import { MessageThread } from "./MessageThread";
import type { 
  ActivityItem, 
  AgentState, 
  CommandMessage, 
  ComposerAttachment, 
  ConversationSummary, 
  FlyoutMode, 
  ToolActivity 
} from "./command-center.types";
import { consumeSSEChunk, record, safeString } from "./sse";
import { ArtifactOpenContext, ArtifactPanel, isArtifactResult, type ArtifactResult } from "./ArtifactPanel";
import { cn } from "@/lib/utils";

export function CommandCenterWorkspace() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState("new");
  const [messages, setMessages] = useState<CommandMessage[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [agentSummary, setAgentSummary] = useState("Ready for instruction");
  const [busy, setBusy] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [flyout, setFlyout] = useState(false);
  const [flyoutMode, setFlyoutMode] = useState<FlyoutMode>("activity");
  const [unread, setUnread] = useState(0);
  const [openArtifact, setOpenArtifact] = useState<ArtifactResult | null>(null);
  const showArtifact = useCallback((artifact: ArtifactResult) => {
    setFlyout(false);
    setOpenArtifact(artifact);
  }, []);
  const [lastSubmission, setLastSubmission] = useState<{ text: string; attachments: ComposerAttachment[] } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const closeFlyout = useCallback(() => setFlyout(false), []);

  // Load persistent conversations from server + localStorage
  const loadConversations = useCallback(async () => {
    let localItems: ConversationSummary[] = [];
    try {
      const saved = localStorage.getItem("gxl_cc_conversations_v4");
      if (saved) localItems = JSON.parse(saved);
    } catch (_e) {}

    try {
      const response = await fetch("/api/admin/command-center?limit=40", { cache: "no-store" });
      if (response.ok) {
        const payload = record(await response.json());
        if (Array.isArray(payload.conversations)) {
          const serverItems = payload.conversations.map((c: any) => ({
            id: String(c.id),
            title: String(c.title || "Conversation"),
            createdAt: String(c.created_at || c.createdAt || new Date().toISOString()),
          }));
          const merged = [...serverItems];
          localItems.forEach((loc) => {
            if (!merged.some((m) => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          setConversations(merged);
          try {
            localStorage.setItem("gxl_cc_conversations_v4", JSON.stringify(merged));
          } catch (_e) {}
          return;
        }
      }
    } catch (_e) {}

    if (localItems.length > 0) {
      setConversations(localItems);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  // Load persistent messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (conversationId === "new") {
      setMessages([]);
      return;
    }

    let localMsgs: CommandMessage[] = [];
    try {
      const saved = localStorage.getItem(`gxl_cc_msgs_${conversationId}`);
      if (saved) localMsgs = JSON.parse(saved);
    } catch (_e) {}

    if (localMsgs.length > 0) {
      setMessages(localMsgs);
    } else {
      setMessages([]);
    }

    try {
      const response = await fetch(`/api/admin/command-center?conversationId=${encodeURIComponent(conversationId)}`, { cache: "no-store" });
      if (response.ok) {
        const payload = record(await response.json());
        if (Array.isArray(payload.messages) && payload.messages.length > 0) {
          const serverMsgs: CommandMessage[] = payload.messages.map((m: any) => ({
            id: String(m.id),
            conversationId: String(m.conversationId || conversationId),
            sender: m.sender === "gxl" ? "gxl" : "user",
            text: String(m.text || ""),
            timestamp: String(m.timestamp || m.created_at || new Date().toISOString()),
            toolCalls: Array.isArray(m.toolCalls) ? m.toolCalls : (Array.isArray(m.tool_calls) ? m.tool_calls : undefined),
          }));
          setMessages(serverMsgs);
          try {
            localStorage.setItem(`gxl_cc_msgs_${conversationId}`, JSON.stringify(serverMsgs));
          } catch (_e) {}
        }
      }
    } catch (_e) {}
  }, []);

  useEffect(() => {
    void loadMessages(activeId);
  }, [activeId, loadMessages]);

  const activeTitle = useMemo(() => {
    if (activeId === "new") return "New conversation";
    const found = conversations.find((c) => c.id === activeId);
    return found ? found.title : "Discussion";
  }, [activeId, conversations]);

  // REAL AGENT ORCHESTRATION SUBMISSION
  const submit = useCallback(
    async (text: string, attachments: ComposerAttachment[]) => {
      if (!text && attachments.length === 0) return;

      setLastSubmission({ text, attachments });

      let currentConversationId = activeId;
      if (currentConversationId === "new") {
        currentConversationId = `c_${Date.now()}`;
        setActiveId(currentConversationId);

        const title = text.slice(0, 45) || "New Conversation";
        const newSummary: ConversationSummary = {
          id: currentConversationId,
          title,
          createdAt: new Date().toISOString(),
        };
        setConversations((prev) => [newSummary, ...prev]);
        try {
          const existing = JSON.parse(localStorage.getItem("gxl_cc_conversations_v4") || "[]");
          localStorage.setItem(
            "gxl_cc_conversations_v4",
            JSON.stringify([newSummary, ...existing])
          );
        } catch (_e) {}
      }

      const userMessage: CommandMessage = {
        id: crypto.randomUUID(),
        conversationId: currentConversationId,
        sender: "user",
        text,
        timestamp: new Date().toISOString(),
      };

      const agentMessageId = crypto.randomUUID();
      const agentPlaceholder: CommandMessage = {
        id: agentMessageId,
        conversationId: currentConversationId,
        sender: "gxl",
        text: "",
        timestamp: new Date().toISOString(),
        toolCalls: [],
      };

      setMessages((prev) => {
        const next = [...prev, userMessage, agentPlaceholder];
        try {
          localStorage.setItem(`gxl_cc_msgs_${currentConversationId}`, JSON.stringify(next));
        } catch (_e) {}
        return next;
      });

      setBusy(true);
      setAgentState("working");
      setAgentSummary("Working out what to do");

      abortRef.current = new AbortController();
      const idempotencyKey = `gxl-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

      try {
        const response = await fetch("/api/admin/command-center", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "idempotency-key": idempotencyKey,
          },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            conversationId: currentConversationId,
            message: text || (attachments.length > 0 ? `Process attached file: ${attachments.map((a) => a.name).join(", ")}` : "Process request"),
            attachments: attachments.map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type,
              base64: a.base64,
              size: a.size,
            })),
          }),
        });

        if (!response.ok || !response.body) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error?.message || `Server returned HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const parsed = consumeSSEChunk(buffer, chunk);
          buffer = parsed.remainder;

          for (const item of parsed.events) {
            handleSSEEvent(currentConversationId, agentMessageId, item.event, record(item.data));
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          const errorMsg = err.message || "Failed to execute workflow. Please retry.";
          setMessages((items) =>
            items.map((m) =>
              m.id === agentMessageId
                ? {
                    ...m,
                    kind: "error",
                    text: m.text || errorMsg,
                  }
                : m
            )
          );
          setAgentState("failed");
          setAgentSummary("Action interrupted");
        }
      } finally {
        setBusy(false);
        setAgentState("idle");
        setAgentSummary("Ready for instruction");
        abortRef.current = null;
      }
    },
    [activeId]
  );

  function stop() {
    if (abortRef.current) {
      abortRef.current.abort();
      setBusy(false);
      setAgentState("idle");
      setAgentSummary("Stopped by user");
    }
  }

  function retry() {
    if (lastSubmission) {
      void submit(lastSubmission.text, lastSubmission.attachments);
    }
  }

  function handleSSEEvent(
    conversationId: string,
    agentMessageId: string,
    event: string,
    value: Record<string, unknown>
  ) {
    if (event === "text_delta") {
      const delta = safeString(value.text);
      setMessages((items) => {
        const updated = items.map((item) =>
          item.id === agentMessageId ? { ...item, text: item.text + delta } : item
        );
        try {
          localStorage.setItem(`gxl_cc_msgs_${conversationId}`, JSON.stringify(updated));
        } catch (_e) {}
        return updated;
      });
    } else if (event === "tool_call") {
      const name = safeString(value.name);
      const tool: ToolActivity = {
        id: crypto.randomUUID(),
        name,
        status: "calling",
        summary: safeToolLabel(name),
        args: (value.args as any) || undefined,
      };
      setMessages((items) => {
        const updated = items.map((item) =>
          item.id === agentMessageId
            ? { ...item, toolCalls: [...(item.toolCalls ?? []), tool] }
            : item
        );
        try {
          localStorage.setItem(`gxl_cc_msgs_${conversationId}`, JSON.stringify(updated));
        } catch (_e) {}
        return updated;
      });
      setAgentSummary(safeToolLabel(name));
      addActivity(safeToolLabel(name), "working", "Running authorized tool");
    } else if (event === "tool_result") {
      const name = safeString(value.name);
      setMessages((items) => {
        const updated = items.map((item) => {
          if (item.id !== agentMessageId || !item.toolCalls) return item;
          return {
            ...item,
            toolCalls: item.toolCalls.map((tc) =>
              tc.name === name && tc.status === "calling"
                ? { ...tc, status: "complete" as const, result: value.result || undefined }
                : tc
            ),
          };
        });
        try {
          localStorage.setItem(`gxl_cc_msgs_${conversationId}`, JSON.stringify(updated));
        } catch (_e) {}
        return updated;
      });
      if (isArtifactResult(value.result)) showArtifact(value.result);
      addActivity(safeToolLabel(name), "complete", "Tool action completed");
    } else if (event === "error") {
      const errorMsg = safeString(value.message) || "Execution encountered an error.";
      setMessages((items) =>
        items.map((item) =>
          item.id === agentMessageId ? { ...item, text: item.text || errorMsg, kind: "error" } : item
        )
      );
    } else if (event === "notification_created") {
      setUnread((c) => c + 1);
    }
  }

  function addActivity(label: string, state: AgentState, detail?: string) {
    setActivity((items) => [
      ...items.slice(-99),
      { id: crypto.randomUUID(), label, state, detail, timestamp: new Date().toISOString() },
    ]);
  }

  const openPanel = () => {
    if (flyout) { setFlyout(false); return; }
    setOpenArtifact(null);
    setFlyoutMode(unread > 0 ? "notifications" : flyoutMode);
    setFlyout(true);
  };

  return (
    <ArtifactOpenContext.Provider value={showArtifact}>
    <div className="ds-shell ds-dark flex h-full min-h-0 overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      <CommandSidebar
        open={sidebar}
        conversations={conversations}
        activeId={activeId}
        onClose={() => setSidebar(false)}
        onSelect={(id) => {
          setActiveId(id);
          if (window.innerWidth < 768) setSidebar(false);
        }}
        onNew={() => {
          setActiveId("new");
          setMessages([]);
          setActivity([]);
          setOpenArtifact(null);
          if (window.innerWidth < 768) setSidebar(false);
        }}
      />

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            {!sidebar && (
              <button type="button" onClick={() => setSidebar(true)} aria-label="Open sidebar" title="Open sidebar" className={headerButton}>
                <PanelLeft size={16} strokeWidth={1.5} />
              </button>
            )}
            {activeId !== "new" && <h1 className="ds-t-body-strong truncate text-[var(--text-primary)]">{activeTitle}</h1>}
          </div>

          <button
            type="button"
            onClick={openPanel}
            aria-pressed={flyout}
            aria-label={unread > 0 ? `Activity and alerts, ${unread} unread` : "Activity and alerts"}
            title="Activity and alerts"
            className={cn(headerButton, "relative", flyout && "bg-[var(--bg-active)] text-[var(--text-primary)]")}
          >
            <PanelRight size={16} strokeWidth={1.5} />
            {unread > 0 && <span aria-hidden className="absolute right-1.5 top-1.5 size-1.5 rounded-[var(--radius-full)] bg-[var(--accent)]" />}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar" aria-live="polite">
          <MessageThread
            messages={messages}
            busy={busy}
            onSuggestion={(text) => void submit(text, [])}
            onRetry={retry}
          />
        </div>

        <CommandComposer busy={busy} onSubmit={submit} onStop={stop} />
      </section>

      {flyout && (
        <ContextFlyout
          open={flyout}
          mode={flyoutMode}
          activity={activity}
          onClose={closeFlyout}
          onMode={setFlyoutMode}
          onUnreadChange={setUnread}
        />
      )}

      {openArtifact && !flyout && <ArtifactPanel result={openArtifact} onClose={() => setOpenArtifact(null)} />}
    </div>
    </ArtifactOpenContext.Provider>
  );
}

const headerButton =
  "ds-focus grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] active:bg-[var(--bg-active)]";

function safeToolLabel(name: string): string {
  const map: Record<string, string> = {
    get_company_stats: "Reading lead statistics",
    search_leads: "Searching leads",
    search: "Searching the web",
    terminal: "Running a command",
    sql: "Querying the database",
  };
  if (map[name]) return map[name];
  const words = name.replaceAll("_", " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Working";
}
