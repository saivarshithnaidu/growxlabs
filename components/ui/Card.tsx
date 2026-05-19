import { cn } from "@/lib/utils";

export function Card({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg p-6 bg-white border border-[#E5E2DC] shadow-sm transition-all duration-300 hover:border-[#355CFF]/25 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
