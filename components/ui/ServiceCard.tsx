import {
  Code,
  Settings,
  TrendingUp,
  Server,
  Globe,
  Zap,
  Shield,
  Clock,
  ArrowRight,
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
    <div className="group h-full transition-all duration-300 hover:-translate-y-0.5">
      <div className="h-full flex flex-col bg-white border border-[#E5E2DC] rounded-lg p-6 transition-all duration-300 shadow-sm group-hover:border-[#355CFF]/25 group-hover:shadow-md">
        <div className="w-11 h-11 rounded-md bg-[#EDEAE4] flex items-center justify-center mb-5 group-hover:bg-[#355CFF]/10 transition-colors">
          <Icon className="text-[#355CFF] w-[22px] h-[22px]" aria-hidden="true" />
        </div>
        <h3 className="text-[17px] font-semibold text-[#1A1A1A] mb-2">{title}</h3>
        <p className="text-[#6B7280] text-[14px] leading-[1.6] mb-5 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-[#355CFF] text-[14px] font-semibold group-hover:gap-2.5 transition-all">
          Learn more <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
