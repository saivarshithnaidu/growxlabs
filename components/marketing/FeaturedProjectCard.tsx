import Image from "next/image";
import { Link } from "@/navigation";
import { ArrowUpRight } from "lucide-react";

interface FeaturedProjectCardProps {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  /** Natural size of the image, so a narrow crop is never upscaled past its own pixels. */
  imageWidth: number;
  imageHeight: number;
}

/*
 * Project card: the real product screen sits in a lit panel, and a white text card overlaps the
 * panel's empty lower edge. The whole card is one link (the title's ::after covers it).
 */
export function FeaturedProjectCard({ slug, tag, title, summary, image, imageAlt, imageWidth, imageHeight }: FeaturedProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#06080a] bg-[radial-gradient(110%_75%_at_50%_0%,rgba(192,240,251,0.26),transparent_62%)]">
        <div className="absolute inset-x-[9%] top-0 bottom-16 flex items-center justify-center lg:bottom-24">
          <Image
            src={image}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="h-auto w-full rounded-lg border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ maxWidth: imageWidth }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-16 flex flex-1 flex-col rounded-xl bg-white p-6 text-black shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:mx-8 sm:p-8 lg:-mt-24">
        <span className="self-start rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white">{tag}</span>
        <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl [overflow-wrap:break-word]">
          <Link
            href={`/portfolio/${slug}`}
            className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-everyblue"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base">{summary}</p>
        <span
          className="mt-8 inline-flex items-center gap-2 self-end rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-colors duration-200 group-hover:bg-neutral-800 motion-reduce:transition-none"
          aria-hidden="true"
        >
          View case study
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
