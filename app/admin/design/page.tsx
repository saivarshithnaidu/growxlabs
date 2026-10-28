"use client";
import { useSession } from "next-auth/react";

import { ErrorState, PageHeader } from "@/src/components/patterns";
import { ButtonsSection, ChipsBadgesSection, InputsSection, OverlaysSection, SurfacesSection, TokensSection } from "./_preview/Primitives";
import { DataSection, NavigationSection } from "./_preview/DataShell";
import { PatternsSection } from "./_preview/PatternsDemo";
import { BusinessSection, FeedbackSection } from "./_preview/Business";
import { InsightsSection } from "./_preview/Insights";

const SECTIONS = [
  ["tokens", "Tokens"], ["button", "Buttons"], ["inputs", "Inputs"], ["badges", "Chips & badges"], ["overlays", "Overlays"],
  ["surfaces", "Surfaces"], ["feedback", "Feedback"], ["data", "Data"], ["insights", "Dashboard"], ["business", "Business"], ["navigation", "Navigation"], ["patterns", "Patterns"],
] as const;

export default function DesignPreviewPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (status === "loading") return null;
  if (role !== "ADMIN" && role !== "CO_ADMIN") {
    return <ErrorState size="page" title="Admins only" description="The design system preview is limited to admin accounts." />;
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Design system" breadcrumb={[{ label: "Administration", href: "/admin/settings" }]} info="Every component in src/components/ui, src/components/business and src/components/patterns, with sample data only." />
      <nav aria-label="Sections" className="mb-6 flex flex-wrap gap-x-4 gap-y-1">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="ds-focus ds-t-body-strong rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">{label}</a>
        ))}
      </nav>
      <div className="flex flex-col gap-8">
        <TokensSection />
        <ButtonsSection />
        <InputsSection />
        <ChipsBadgesSection />
        <OverlaysSection />
        <SurfacesSection />
        <FeedbackSection />
        <DataSection />
        <InsightsSection />
        <BusinessSection />
        <NavigationSection />
        <PatternsSection />
      </div>
    </div>
  );
}
