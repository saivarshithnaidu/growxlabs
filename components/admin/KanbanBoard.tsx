"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { CurrencyAmount } from "@/src/components/ui";
import { KanbanBoard as Board, KanbanCard, KanbanColumn } from "@/src/components/patterns";

interface Stage {
  id: string;
  name: string;
  probability: number;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  expected_close_date?: string;
  company?: { name: string };
  primary_contact?: { first_name: string; last_name: string };
  stage_id: string;
  probability?: number;
}

interface KanbanBoardProps {
  initialDeals: Deal[];
  stages: Stage[];
  onStageChange: (dealId: string, newStageId: string) => Promise<void>;
}

/** Deals pipeline: drag a card to another stage (optimistic, rolls back on failure). */
export function KanbanBoard({ initialDeals, stages, onStageChange }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedId(dealId);
    e.dataTransfer.setData("text/plain", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain") || draggedId;
    if (!dealId) return;

    const deal = deals.find(d => d.id === dealId);
    if (deal && deal.stage_id !== targetStageId) {
      // Optimistic Update
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage_id: targetStageId } : d));
      try {
        await onStageChange(dealId, targetStageId);
      } catch (err) {
        console.error("Failed to persist stage change:", err);
        // Rollback on failure
        setDeals(initialDeals);
      }
    }
    setDraggedId(null);
  };

  const getStageStats = (stageId: string) => {
    const stageDeals = deals.filter(d => d.stage_id === stageId);
    const count = stageDeals.length;
    const totalValue = stageDeals.reduce((acc, curr) => acc + Number(curr.value), 0);
    return { count, totalValue };
  };

  return (
    <Board label="Deals by stage">
      {stages.map((stage) => {
        const stageDeals = deals.filter(d => d.stage_id === stage.id);
        const { count, totalValue } = getStageStats(stage.id);

        return (
          <KanbanColumn
            key={stage.id}
            title={stage.name}
            count={count}
            meta={<CurrencyAmount value={totalValue} compact />}
            tone="accent"
            emptyText="Drag deals here"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
            footer={<span className="ds-t-meta text-[var(--text-muted)]">{stage.probability}% probability</span>}
          >
            {stageDeals.map((deal) => (
              <KanbanCard
                key={deal.id}
                title={deal.name}
                meta={deal.company?.name}
                draggable
                dragging={draggedId === deal.id}
                onDragStart={(e) => handleDragStart(e, deal.id)}
                onDragEnd={() => setDraggedId(null)}
                footnote={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} strokeWidth={1.5} aria-hidden />
                    {deal.expected_close_date
                      ? new Date(deal.expected_close_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                      : "No close date"}
                  </span>
                }
                assignee={<CurrencyAmount value={deal.value} className="ds-t-body-strong text-[var(--text-primary)]" />}
              />
            ))}
          </KanbanColumn>
        );
      })}
    </Board>
  );
}
