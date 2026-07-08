"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";

/** Old URL: subscription plans now live on Services (`#subscriptions`). */
export default function SubscriptionsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/services#subscriptions");
  }, [router]);

  return (
    <div className="min-h-[min(70dvh,520px)] flex items-center justify-center px-6 pt-28 pb-24">
      <p className="text-[15px] text-muted-foreground text-center max-w-sm">
        Subscription plans moved to Services. Taking you there…
      </p>
    </div>
  );
}
