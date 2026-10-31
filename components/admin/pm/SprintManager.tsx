"use client";

import React from "react";
import { Zap } from "lucide-react";
import { Badge, Button, Card, CardHeader, KeyValueList, Tooltip } from "@/src/components/ui";
import { EmptyState } from "@/src/components/patterns";
import { ProgressMeter } from "./ProgressMeter";

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
  status: 'FUTURE' | 'ACTIVE' | 'COMPLETED';
  capacity_story_points: number;
  completed_story_points: number;
}

interface SprintManagerProps {
  sprints: Sprint[];
  onStartSprint?: (id: string) => Promise<void>;
  onCompleteSprint?: (id: string) => Promise<void>;
  /** Id of the sprint whose start/complete request is in flight. */
  busyId?: string | null;
}

const DAY_MS = 86_400_000;
const day = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};
const formatDay = (value?: string) => day(value)?.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) ?? "No date";
const range = (s: Sprint) => `${formatDay(s.start_date)} to ${formatDay(s.end_date)}`;
const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);

export function SprintManager({ sprints, onStartSprint, onCompleteSprint, busyId }: SprintManagerProps) {
  const activeSprint = sprints.find(s => s.status === "ACTIVE");
  const futureSprints = sprints.filter(s => s.status === "FUTURE");
  const completedSprints = sprints.filter(s => s.status === "COMPLETED").reverse();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-w-0 flex-col gap-6">
        <Card as="section">
          {activeSprint ? (
            <ActiveSprint sprint={activeSprint} onComplete={onCompleteSprint} busy={busyId === activeSprint.id} />
          ) : (
            <EmptyState
              icon={<Zap size={24} strokeWidth={1.5} />}
              title="No active sprint"
              description={futureSprints.length ? "Start one of the upcoming sprints to track its progress here." : "Once a sprint is planned, start it to track its progress here."}
            />
          )}
        </Card>

        {completedSprints.length > 0 && (
          <Card as="section" padding="none">
            <div className="px-5 pt-5"><CardHeader title="Completed sprints" description="Story points delivered against what was committed." /></div>
            <ul className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
              {completedSprints.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{s.name}</p>
                    <p className="ds-t-meta ds-num text-[var(--text-muted)]">{range(s)}</p>
                  </div>
                  <span className="ds-t-meta ds-num text-[var(--text-secondary)]">{s.completed_story_points || 0} of {s.capacity_story_points || 0} SP</span>
                  <ProgressMeter value={pct(s.completed_story_points, s.capacity_story_points)} barClassName="w-24" />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <Card as="section" padding="none" className="self-start">
        <div className="px-5 pt-5"><CardHeader title="Upcoming sprints" actions={futureSprints.length ? <Badge variant="neutral" noDot>{futureSprints.length}</Badge> : undefined} /></div>
        {futureSprints.length === 0 ? (
          <p className="ds-t-body border-t border-[var(--border-subtle)] px-5 py-6 text-[var(--text-muted)]">No upcoming sprints scheduled.</p>
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
            {futureSprints.map((sp) => {
              const start = onStartSprint && (
                <Button
                  size={28}
                  variant={activeSprint ? "secondary" : "primary"}
                  disabled={!!activeSprint || (!!busyId && busyId !== sp.id)}
                  loading={busyId === sp.id}
                  onClick={() => onStartSprint(sp.id)}
                >
                  Start sprint
                </Button>
              );
              return (
                <li key={sp.id} className="flex flex-col gap-2 px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="ds-t-body-strong truncate text-[var(--text-primary)]">{sp.name}</p>
                      <p className="ds-t-meta ds-num text-[var(--text-muted)]">{range(sp)}</p>
                    </div>
                    <span className="ds-t-meta ds-num shrink-0 text-[var(--text-secondary)]">{sp.capacity_story_points || 0} SP</span>
                  </div>
                  {sp.goal && <p className="ds-t-meta line-clamp-2 text-[var(--text-secondary)]">{sp.goal}</p>}
                  {start && (
                    <div>
                      {activeSprint ? <Tooltip content="Complete the active sprint first"><span className="inline-flex">{start}</span></Tooltip> : start}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ActiveSprint({ sprint, onComplete, busy }: { sprint: Sprint; onComplete?: (id: string) => Promise<void>; busy: boolean }) {
  const committed = sprint.capacity_story_points || 0;
  const completed = sprint.completed_story_points || 0;
  const remaining = Math.max(0, committed - completed);
  const start = day(sprint.start_date);
  const end = day(sprint.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The straight-line pace from the sprint dates; a reference, not a measurement.
  let schedule: { daysLeft: number; expected: number } | null = null;
  if (start && end && end > start) {
    const span = (end.getTime() - start.getTime()) / DAY_MS;
    const elapsed = Math.min(span, Math.max(0, (today.getTime() - start.getTime()) / DAY_MS));
    schedule = {
      daysLeft: Math.max(0, Math.ceil((end.getTime() - today.getTime()) / DAY_MS)),
      expected: Math.round((committed * elapsed) / span),
    };
  }
  const behind = schedule && committed > 0 && completed < schedule.expected;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="ds-t-title-sm truncate text-[var(--text-primary)]">{sprint.name}</h2>
            <Badge variant="info">Active</Badge>
          </div>
          <p className="ds-t-meta ds-num mt-0.5 text-[var(--text-muted)]">{range(sprint)}</p>
        </div>
        {onComplete && (
          <Button
            size={28}
            variant="secondary"
            loading={busy}
            onClick={() => { if (window.confirm(`Complete ${sprint.name}?`)) void onComplete(sprint.id); }}
          >
            Complete sprint
          </Button>
        )}
      </div>

      <p className="ds-t-body text-[var(--text-secondary)]">{sprint.goal || <span className="text-[var(--text-disabled)]">No sprint goal set.</span>}</p>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="ds-t-meta-strong text-[var(--text-secondary)]">Completed</span>
          <span className="ds-t-meta ds-num text-[var(--text-muted)]">{completed} of {committed} SP</span>
        </div>
        <ProgressMeter value={pct(completed, committed)} barClassName="flex-1" className="w-full" />
        {schedule && committed > 0 && (
          <p className={`ds-t-meta mt-2 ${behind ? "text-[var(--warning)]" : "text-[var(--text-muted)]"}`}>
            {behind
              ? `Behind pace: about ${schedule.expected} SP would be done by today at an even rate.`
              : `On pace: about ${schedule.expected} SP would be done by today at an even rate.`}
          </p>
        )}
      </div>

      <KeyValueList
        columns={2}
        items={[
          { label: "Committed", value: <span className="ds-num">{committed} SP</span> },
          { label: "Remaining", value: <span className="ds-num">{remaining} SP</span> },
          { label: "Days left", value: <span className="ds-num">{schedule ? schedule.daysLeft : "No end date"}</span> },
          { label: "Ends", value: formatDay(sprint.end_date) },
        ]}
      />
    </div>
  );
}
