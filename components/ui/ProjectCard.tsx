import { ExternalLink } from "lucide-react";
import { CaseStudy } from "@/lib/data/projects";
import Image from "next/image";

type ProjectCardProps = Pick<CaseStudy, "title" | "tag" | "description" | "tech" | "metric" | "link" | "status" | "image">;

export function ProjectCard({ title, tag, description, tech, metric, link, status, image }: ProjectCardProps) {
  return (
    <div className="group h-full transition-transform duration-300 hover:-translate-y-1">
      <div className="h-full flex flex-col bg-white border border-[#E5E2DC] rounded-lg overflow-hidden transition-all duration-300 shadow-sm group-hover:border-[#355CFF]/25 group-hover:shadow-lg group-hover:shadow-[#355CFF]/[0.04]">
        {/* Image Section */}
        {image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#355CFF] border border-[#E5E2DC]">
                {tag}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-3 tracking-tight">{title}</h3>
          <p className="text-[#6B7280] text-[14px] leading-[1.6] mb-6 flex-1">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tech?.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F5F3EE] text-[#6B7280] border border-[#E5E2DC]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-[#E5E2DC] mt-auto">
            <div className="flex items-center gap-3">
              {status === "Live" && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#355CFF]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-pulse" />
                  Live
                </span>
              )}
              {metric && (
                <span className="text-[11px] font-bold text-[#6B7280]/60 uppercase tracking-widest">
                  {metric}
                </span>
              )}
            </div>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#355CFF] hover:text-[#2A4AD4] transition-colors"
              >
                Launch <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
