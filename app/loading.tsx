import { LogoLoader } from "@/components/ui/LogoLoader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <LogoLoader size={64} className="text-[var(--foreground)]" />
    </div>
  );
}
