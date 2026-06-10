"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
}

interface BlogInteractiveListProps {
  posts: BlogPost[];
  featuredPost: BlogPost;
}

const getPostImage = (slug: string): string => {
  const images: Record<string, string> = {
    "nvidia-vision-agentic-to-useful-ai": "/images/nvidia-vision-agentic-to-useful-ai.png",
    "chatbots-are-dying-agents-are-taking-over": "/images/chatbots-are-dying-agents-are-taking-over.png",
    "blue-origin-new-glenn-rocket-explosion": "/images/blue-origin-new-glenn-rocket-explosion.png",
    "claude-opus-4-8-anthropic-ai-model": "/images/claude_blog_woodcut_1780853620986.png",
    "google-io-2026": "/images/blog-google-io-2026.png",
    "ferraris-electric-future-why-the-luce-marks-a-historic-turning-point": "/images/blog-ferrari-luce.png",
    "google-search-is-no-longer-just-search": "/images/search_blog_woodcut_1780853646113.png",
    "why-anthropic-is-becoming-a-serious-threat-to-openai": "/images/anthropic_openai_woodcut_1780853674501.png",
    "ai-coding-tools-are-reshaping-modern-software-engineering": "/images/coding_blog_woodcut_1780853698423.png",
    "n8n-automation-for-business": "/images/blog-n8n-automation.png",
    "whatsapp-automation-for-lead-nurturing": "/images/blog-whatsapp-nurture.png",
    "restaurant-customer-retention-automation": "/images/blog-restaurant-retention.png",
    "indian-restaurant-website-usa": "/images/blog-restaurant-website.png"
  };
  return images[slug] || "/images/nvidia-vision-agentic-to-useful-ai.png";
};

const getAccentWord = (slug: string): string => {
  const accents: Record<string, string> = {
    "nvidia-vision-agentic-to-useful-ai": "Future",
    "chatbots-are-dying-agents-are-taking-over": "Dying",
    "blue-origin-new-glenn-rocket-explosion": "Explodes",
    "claude-opus-4-8-anthropic-ai-model": "Benchmarks",
    "google-io-2026": "AI-Native",
    "ferraris-electric-future-why-the-luce-marks-a-historic-turning-point": "Luce",
    "google-search-is-no-longer-just-search": "Search",
    "why-anthropic-is-becoming-a-serious-threat-to-openai": "Threat",
    "ai-coding-tools-are-reshaping-modern-software-engineering": "Reshaping",
    "n8n-automation-for-business": "Automation",
    "whatsapp-automation-for-lead-nurturing": "Nurturing",
    "restaurant-customer-retention-automation": "Lose",
    "indian-restaurant-website-usa": "Stop"
  };
  return accents[slug] || "";
};

const renderSerifTitle = (title: string, slug: string) => {
  const accent = getAccentWord(slug);
  if (accent && title.includes(accent)) {
    const parts = title.split(accent);
    return (
      <>
        {parts[0]}
        <span className="italic font-serif font-normal">{accent}</span>
        {parts.slice(1).join(accent)}
      </>
    );
  }
  return title;
};

export function BlogInteractiveList({ posts, featuredPost }: BlogInteractiveListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" "); // Space handles state initial trigger cleanly
  const [realSearch, setRealSearch] = useState<string>("");

  const categories = ["All", "AI & Agents", "Automation", "Engineering", "Tech & Science"];

  const getCategoryGroup = (category: string): string => {
    const cat = category.toLowerCase();
    if (cat.includes("automation") || cat.includes("whatsapp") || cat.includes("n8n") || cat.includes("retention")) {
      return "Automation";
    }
    if (cat.includes("engineering") || cat.includes("code") || cat.includes("web")) {
      return "Engineering";
    }
    if (cat.includes("space") || cat.includes("automotive") || cat.includes("future") || cat.includes("science")) {
      return "Tech & Science";
    }
    if (cat.includes("ai") || cat.includes("agent") || cat.includes("anthropic") || cat.includes("openai") || cat.includes("search")) {
      return "AI & Agents";
    }
    return "Other";
  };

  const filtered = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || getCategoryGroup(post.category) === activeCategory;
    const matchesSearch =
      realSearch === "" ||
      post.title.toLowerCase().includes(realSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(realSearch.toLowerCase()) ||
      post.category.toLowerCase().includes(realSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showFeatured = featuredPost && (
    (activeCategory === "All" || getCategoryGroup(featuredPost.category) === activeCategory) &&
    (realSearch === "" ||
     featuredPost.title.toLowerCase().includes(realSearch.toLowerCase()) ||
     featuredPost.excerpt.toLowerCase().includes(realSearch.toLowerCase()))
  );

  const displayFeatured = showFeatured ? featuredPost : filtered[0];
  const feedPosts = showFeatured
    ? filtered.filter((p) => p.slug !== featuredPost.slug)
    : filtered.slice(1);

  // Divide regular feed posts into Left Column (2 items) and Right Column (remaining items)
  const leftColumnPosts = feedPosts.slice(0, 2);
  const rightColumnPosts = feedPosts.slice(2);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRealSearch(val);
    setSearchQuery(val || " ");
  };

  return (
    <div className="space-y-12">
      {/* Minimalistic Inline Navigation & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        {/* Transparent Category Tabs */}
        <div className="flex flex-wrap items-center gap-6 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-mono tracking-widest uppercase pb-2 border-b transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Minimalist Search Icon & Input */}
        <div className="relative w-full md:max-w-xs order-1 md:order-2">
          <input
            type="text"
            value={realSearch}
            onChange={handleSearchChange}
            placeholder="Search insights..."
            className="w-full bg-transparent border-b border-white/10 py-1.5 px-0 pl-7 text-xs focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground transition-all font-mono"
          />
          <Search className="absolute left-0 top-1.5 w-4.5 h-4.5 text-muted-foreground" />
        </div>
      </div>

      {/* Grid Layout inspired by every.to */}
      {displayFeatured ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* 1. LEFT COLUMN (col-span-3): Stacked Stories */}
          <div className="lg:col-span-3 space-y-12 order-2 lg:order-1">
            {leftColumnPosts.map((post) => (
              <div key={post.slug} className="group block space-y-3">
                {/* Clean Widescreen Thumbnail */}
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md bg-[#0C0C0C] border border-white/5 flex items-center justify-center">
                    <Image
                      src={getPostImage(post.slug)}
                      alt={post.title}
                      fill
                      className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-w-768px) 100vw, 300px"
                    />
                  </div>
                </Link>

                {/* Metadata */}
                <div className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground uppercase">
                  {post.date} IN <span className="text-primary font-semibold">{getCategoryGroup(post.category)}</span>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="font-serif font-black text-xl text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors">
                    {renderSerifTitle(post.title, post.slug)}
                  </h3>
                </Link>

                {/* Author row */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#161616]">
                    <img
                      src="/images/avatars/growxlabs.png"
                      alt="GXL Editor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0a0a0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`;
                      }}
                    />
                  </div>
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                    BY GROWXLABS TEAM
                  </span>
                </div>
              </div>
            ))}
            
            {leftColumnPosts.length === 0 && (
              <p className="text-xs font-mono text-muted-foreground text-center py-6">No matching insights in index feed.</p>
            )}
          </div>

          {/* 2. MIDDLE COLUMN (col-span-6): Huge Primary Featured Post */}
          <div className="lg:col-span-6 space-y-5 order-1 lg:order-2 border-b border-white/10 lg:border-b-0 pb-10 lg:pb-0">
            <div className="group block space-y-4">
              {/* Huge featured cover image */}
              <Link href={`/blog/${displayFeatured.slug}`}>
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-[#0C0C0C] border border-white/5 flex items-center justify-center">
                  <Image
                    src={getPostImage(displayFeatured.slug)}
                    alt={displayFeatured.title}
                    fill
                    className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-w-1024px) 100vw, 800px"
                    priority
                  />
                </div>
              </Link>

              {/* Metadata */}
              <div className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase">
                {displayFeatured.date} IN <span className="text-primary font-bold">{getCategoryGroup(displayFeatured.category)}</span>
              </div>

              {/* Large title */}
              <Link href={`/blog/${displayFeatured.slug}`} className="block">
                <h2 className="font-serif font-black text-3xl md:text-4xl text-foreground leading-[1.15] tracking-tight group-hover:text-primary transition-colors">
                  {renderSerifTitle(displayFeatured.title, displayFeatured.slug)}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-muted-foreground text-[14px] leading-relaxed max-w-3xl">
                {displayFeatured.excerpt}
              </p>

              {/* Author row */}
              <div className="flex items-center gap-2 pt-2">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#161616]">
                  <img
                    src="/images/avatars/growxlabs.png"
                    alt="GXL Editor"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a0a0a0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`;
                    }}
                  />
                </div>
                <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                  BY GROWXLABS TEAM
                </span>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN (col-span-3): RECENT ESSAYS Feed */}
          <div className="lg:col-span-3 space-y-6 order-3 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Recent Insights
              </span>
              <span className="text-xs text-muted-foreground font-mono">→</span>
            </div>
            
            <div className="space-y-6">
              {rightColumnPosts.map((post) => (
                <div key={post.slug} className="group flex gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0 items-start">
                  
                  {/* Small Square Thumbnail */}
                  <Link href={`/blog/${post.slug}`} className="shrink-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[#0C0C0C] border border-white/5 flex items-center justify-center">
                      <Image
                        src={getPostImage(post.slug)}
                        alt={post.title}
                        fill
                        className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="80px"
                      />
                    </div>
                  </Link>

                  {/* Title & Author Info */}
                  <div className="flex-1 space-y-1">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h4 className="font-serif font-black text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                        {renderSerifTitle(post.title, post.slug)}
                      </h4>
                    </Link>
                    <div className="font-mono text-[8px] tracking-wider text-muted-foreground uppercase">
                      BY GROWXLABS TEAM
                    </div>
                  </div>
                  
                </div>
              ))}

              {rightColumnPosts.length === 0 && (
                <p className="text-xs font-mono text-muted-foreground text-center py-6">No other recent articles.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
          <p className="text-muted-foreground text-sm font-mono">No articles found matching your query.</p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setRealSearch("");
              setSearchQuery(" ");
            }}
            className="mt-4 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
          >
            Reset search filters
          </button>
        </div>
      )}
    </div>
  );
}
