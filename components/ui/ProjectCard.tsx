import { ExternalLink } from "lucide-react";
import { CaseStudy } from "@/lib/data/projects";

type ProjectCardProps = Pick<CaseStudy, "title" | "tag" | "description" | "tech" | "metric" | "link" | "status"> & {
  href?: string;
  category?: string;
  image?: string;
};

export function ProjectCard({ title, tag, category, description, tech, metric, link, status }: ProjectCardProps) {
  const displayTag = tag || category || "";
  
  return (
    <div className="group h-full transition-transform duration-300 hover:-translate-y-1">
      <div className="h-full flex flex-col bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all duration-300 group-hover:border-[rgba(0,168,107,0.3)]">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#00A86B]/10 text-[#00A86B] border border-[#00A86B]/20">
            {displayTag}
          </span>
        </div>

        <h3 className="text-[20px] font-semibold text-white mb-3">{title}</h3>
        <p className="text-[#A0A0A0] text-[14px] leading-[1.7] mb-6 flex-1">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {tech?.map((t, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 text-white/60 border border-white/5"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            {status === "Live" && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00A86B]">
                <span className="w-2 h-2 rounded-full bg-[#00A86B]" />
                Live
              </span>
            )}
            {metric && (
              <span className="text-[12px] font-semibold text-white/50">
                {metric}
              </span>
            )}
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#00A86B] hover:text-[#00A86B]/80 transition-colors"
            >
              Visit <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
