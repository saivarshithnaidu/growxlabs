"use client";
import { ActionList, ChartCard, CompactFeed, SegmentedBar, StatRow, StatTile, TrendChart, formatCurrency } from "@/src/components/ui";
import { Row, Section } from "./Specimen";

const MONTHS = [
  { month: "May", pipeline: 120000, billed: 0 },
  { month: "Jun", pipeline: 180000, billed: 40000 },
  { month: "Jul", pipeline: 150000, billed: 60000 },
  { month: "Aug", pipeline: 260000, billed: 90000 },
  { month: "Sep", pipeline: 310000, billed: 120000 },
  { month: "Oct", pipeline: 450000, billed: 150000 },
];

export function InsightsSection() {
  return (
    <Section id="insights" title="Dashboard: StatTile, TrendChart, SegmentedBar, ActionList, CompactFeed">
      <Row label="StatRow" stack>
        <StatRow>
          <StatTile label="Pipeline" value="₹4.5L" delta={{ value: "18%", direction: "up" }} caption="vs last 30 days" trend={MONTHS.map((m) => m.pipeline)} href="/admin/design#insights" />
          <StatTile label="Contracted" value="₹1L" caption="1 active agreement" />
          <StatTile label="Billed" value="₹50K" caption="50% collected" progress={0.5} />
          <StatTile label="Churn" value="2%" delta={{ value: "1%", direction: "up", good: false }} caption="vs last quarter" />
        </StatRow>
      </Row>
      <Row label="TrendChart" stack>
        <ChartCard title="Pipeline added" legend={[{ label: "Pipeline", color: "var(--chart-1)" }, { label: "Billed", color: "var(--chart-compare)", dashed: true }]}>
          <TrendChart
            label="Sample: pipeline and billed per month"
            data={MONTHS}
            xKey="month"
            formatValue={(v) => formatCurrency(v, { compact: true })}
            series={[{ key: "pipeline", label: "Pipeline", color: "var(--chart-1)", area: true }, { key: "billed", label: "Billed", color: "var(--chart-compare)", dashed: true }]}
          />
        </ChartCard>
      </Row>
      <Row label="SegmentedBar" stack>
        <SegmentedBar
          label="Sample pipeline stages"
          segments={[
            { label: "Inbound leads", value: 241, weight: 1, color: "var(--chart-3)" },
            { label: "Discovery", value: "2 deals", weight: 1, color: "var(--chart-2)" },
            { label: "Proposals", value: "₹1L", weight: 1, color: "var(--chart-1)" },
            { label: "Executed", value: "₹3.5L", weight: 1, color: "var(--chart-4)" },
          ]}
        />
      </Row>
      <Row label="ActionList" stack>
        <div className="max-w-md">
          <ActionList label="Sample actions" items={[
            { id: "1", label: "Outstanding invoices", meta: "₹50K", tone: "danger", href: "/admin/design#insights" },
            { id: "2", label: "3 handoffs to review", href: "/admin/design#insights" },
            { id: "3", label: "Trionyx India Private Limited", meta: "Active client", tone: "success", href: "/admin/design#insights" },
          ]} />
        </div>
      </Row>
      <Row label="CompactFeed" stack>
        <div className="max-w-md">
          <CompactFeed label="Sample feed" items={[
            { id: "1", label: "Consulting payment · verified", time: "28 Oct" },
            { id: "2", label: "Contractor agreement · created", time: "5 Oct" },
            { id: "3", label: "Client onboarding · created", time: "4 Oct" },
          ]} />
        </div>
      </Row>
    </Section>
  );
}
