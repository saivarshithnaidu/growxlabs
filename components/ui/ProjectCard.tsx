import { ExternalLink } from "lucide-react";
import { CaseStudy } from "@/lib/data/projects";
import Image from "next/image";
import { Link } from "@/navigation";

type ProjectCardProps = Pick<CaseStudy, "slug" | "title" | "tag" | "description" | "tech" | "metric" | "link" | "status" | "image">;

export function ProjectCard({ slug, title, tag, description, tech, metric, link, status, image }: ProjectCardProps) {
  return (
    <div className="group h-full relative overflow-hidden transform-none">
      <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-[opacity,background-color,border-color] duration-200 shadow-sm group-hover:border-primary/20">
        
        {/* Clickable Image Section */}
        <Link href={`/portfolio/${slug}`} className="relative h-48 w-full overflow-hidden rounded-t-lg block bg-[#050505] border-b border-border/10">
          {image && (
            <>
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-101"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40 pointer-events-none" />
            </>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-card text-primary border border-border">
              {tag}
            </span>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-1">
          {/* Clickable Title */}
          <Link href={`/portfolio/${slug}`} className="hover:text-primary transition-colors block mb-2">
            <h3 className="text-[20px] font-bold text-foreground tracking-tight">{title}</h3>
          </Link>
          
          <p className="text-muted-foreground text-[14px] leading-[1.6] mb-6 flex-1">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tech?.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
            <div className="flex items-center gap-3">
              {status === "Live" && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Live
                </span>
              )}
              {metric && (
                <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  {metric}
                </span>
              )}
            </div>

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
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
