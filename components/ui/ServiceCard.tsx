import {
  Code,
  Settings,
  TrendingUp,
  Server,
  Globe,
  Zap,
  Shield,
  Clock,
  LucideIcon
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  settings: Settings,
  trending: TrendingUp,
  server: Server,
  globe: Globe,
  zap: Zap,
  shield: Shield,
  clock: Clock
};

interface ServiceCardProps {
  title: string;
  description: string;
  iconName: string;
}

export function ServiceCard({ title, description, iconName }: ServiceCardProps) {
  const Icon = ICON_MAP[iconName] || Settings;

  return (
    <div className="group h-full transition-transform duration-300 hover:-translate-y-1">
      <div className="h-full flex flex-col space-y-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all duration-300 group-hover:border-[rgba(0,168,107,0.3)] group-hover:border-l-2 group-hover:border-l-[#00A86B]">
        <div className="w-10 h-10 rounded-lg bg-[#00A86B]/10 flex items-center justify-center mb-1">
          <Icon className="text-[#00A86B] w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-[20px] font-semibold text-white">{title}</h3>
        <p className="text-[#A0A0A0] text-[15px] leading-[1.7]">
          {description}
        </p>
      </div>
    </div>
  );
}
