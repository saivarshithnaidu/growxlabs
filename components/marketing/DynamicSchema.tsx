import React from "react";

interface SchemaProps {
  graph: any[];
}

/**
 * AEO: Dynamic Schema Component
 * Used to inject page-specific knowledge graph entities.
 */
export function DynamicSchema({ graph }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph
        })
      }}
    />
  );
}
