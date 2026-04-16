import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass rounded-xl p-6 transition-all hover:border-primary/50", className)}>
      {children}
    </div>
  );
}
