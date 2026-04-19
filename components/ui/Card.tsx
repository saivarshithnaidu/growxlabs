import { cn } from "@/lib/utils";

export function Card({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn("glass rounded-xl p-6 transition-all hover:border-primary/50", className)}
    >
      {children}
    </div>
  );
}
