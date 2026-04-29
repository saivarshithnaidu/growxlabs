import { ExternalLink } from "lucide-react";
import { CaseStudy } from "@/lib/data/projects";
import Image from "next/image";

type ProjectCardProps = Pick<CaseStudy, "title" | "tag" | "description" | "tech" | "metric" | "link" | "status" | "image">;

export function ProjectCard({ title, tag, description, tech, metric, link, status, image }: ProjectCardProps) {
  return (
    <div className="group h-full transition-transform duration-300 hover:-translate-y-1">
      <div className="h-full flex flex-col bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-[rgba(0,168,107,0.3)]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white border border-white/10">
                {tag}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-[20px] font-bold text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-[#A0A0A0] text-[14px] leading-[1.6] mb-6 flex-1">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tech?.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-3">
              {status === "Live" && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#00A86B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                  Live
                </span>
              )}
              {metric && (
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
                  {metric}
                </span>
              )}
            </div>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#00A86B] hover:text-[#00A86B]/80 transition-colors"
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
