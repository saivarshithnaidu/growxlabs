"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { Button, RelativeTime, Timeline } from "@/src/components/ui";
import { EmptyState, ErrorState, ListPage, LoadingState } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { AUDIT_ACTION_LABEL, auditTone, describeAudit, locationApi, type LocationAuditEntry } from "@/components/admin/location/api";

type AuditPage = { data: LocationAuditEntry[]; nextBefore: string | null };

export default function LocationActivityPage() {
  const breadcrumb = useAdminBreadcrumb();

  const audit = useInfiniteQuery({
    queryKey: ["admin", "location", "audit"],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      locationApi<AuditPage>(`audit-logs?limit=50${pageParam ? `&before=${encodeURIComponent(pageParam)}` : ""}`),
    getNextPageParam: (last) => last.nextBefore,
  });

  const entries = audit.data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <ListPage header={{ title: "Location activity", breadcrumb, info: "Every change staff made to Location tenants and API keys, newest first." }}>
      {audit.isPending ? (
        <LoadingState size="inline" label="Loading activity…" />
      ) : audit.error ? (
        <ErrorState description={audit.error.message} onRetry={() => audit.refetch()} />
      ) : entries.length === 0 ? (
        <EmptyState icon={<History size={24} strokeWidth={1.5} />} title="No activity yet" description="Creating tenants and issuing, rotating or revoking keys is recorded here." />
      ) : (
        <div className="flex max-w-[880px] flex-col gap-4">
          <Timeline
            label="Location activity"
            items={entries.map((entry) => ({
              id: entry.id,
              title: AUDIT_ACTION_LABEL[entry.action] ?? entry.action,
              time: <RelativeTime value={entry.createdAt} />,
              meta: entry.actorEmail,
              body: (
                <span className="flex flex-wrap gap-x-2">
                  {describeAudit(entry) && <span>{describeAudit(entry)}</span>}
                  {entry.tenantId && (
                    <Link href={`/admin/location/${entry.tenantId}`} className="ds-focus text-[var(--accent)] underline-offset-2 hover:underline">
                      View tenant
                    </Link>
                  )}
                </span>
              ),
              tone: auditTone(entry.action),
            }))}
          />
          {audit.hasNextPage && (
            <div>
              <Button variant="secondary" loading={audit.isFetchingNextPage} onClick={() => audit.fetchNextPage()}>Load older activity</Button>
            </div>
          )}
        </div>
      )}
    </ListPage>
  );
}
