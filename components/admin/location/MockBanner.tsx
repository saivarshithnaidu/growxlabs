"use client";

import { Alert } from "@/src/components/ui";
import { useLocationMockMode } from "./api";

/** Visible only while the server answers with local mock data (dev, GROWX_LOC_ADMIN_URL unset). */
export function LocationMockBanner() {
  const mock = useLocationMockMode();
  if (!mock) return null;
  return (
    <Alert variant="info" title="Mock data" className="mb-4">
      This is sample data for local development. Changes are kept in memory until the dev server restarts. Set GROWX_LOC_ADMIN_URL and GROWX_LOC_ADMIN_SECRET to use the real Growx Location API.
    </Alert>
  );
}
