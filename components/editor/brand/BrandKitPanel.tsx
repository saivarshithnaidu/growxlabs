"use client";

import React, { useRef, useState } from "react";
import { BRAND_FONTS, type BrandKit } from "./brandKit";

/*
 * Brand kit editor for the carousel's Theme tab. Styling follows the editor's own dark panel
 * (raw hex like the rest of StudioLeftPanel) so it sits in the same surface.
 */

interface Props {
  kit: BrandKit;
  onChange: (kit: BrandKit) => void;
  onSave: () => void;
  saveState: "saved" | "unsaved" | "saving" | "failed";
  onApplyCurrent: () => void;
  onApplyAll: () => void;
  slidesCount: number;
}

const COLOR_ROWS: Array<{ key: keyof BrandKit["colors"]; label: string; hint: string }> = [
  { key: "primary", label: "Primary", hint: "Buttons, category, bullets" },
  { key: "ink", label: "Text", hint: "Headings and body" },
  { key: "muted", label: "Muted", hint: "Author, dividers" },
  { key: "paper", label: "Background", hint: "Slide background" },
];

const label = "text-[11px] font-medium text-[#ececec] block";
const field = "h-7 w-full rounded-md border border-[#383838] bg-[#1f1f21] px-2 text-[11px] text-white focus:border-[#1687f8] focus:outline-none";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1687f8]";

export function BrandKitPanel({ kit, onChange, onSave, saveState, onApplyCurrent, onApplyAll, slidesCount }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const setColor = (key: keyof BrandKit["colors"], value: string) => onChange({ ...kit, colors: { ...kit.colors, [key]: value } });

  async function uploadLogo(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
      onChange({ ...kit, logoUrl: data.url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const status =
    saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : saveState === "failed" ? "Not saved" : "Unsaved changes";

  return (
    <section className="space-y-3" aria-label="Brand kit">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-white">Brand kit</span>
        <span className={`text-[10px] ${saveState === "failed" ? "text-rose-400" : "text-[#8e8e93]"}`} role="status">{status}</span>
      </div>

      <div className="space-y-1.5">
        {COLOR_ROWS.map((row) => (
          <label key={row.key} className="flex items-center gap-2">
            <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-white/20" style={{ backgroundColor: kit.colors[row.key] }}>
              <input
                type="color"
                value={kit.colors[row.key]}
                onChange={(e) => setColor(row.key, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={`${row.label} colour`}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] text-[#ececec]">{row.label}</span>
              <span className="block truncate text-[10px] text-[#8e8e93]">{row.hint}</span>
            </span>
            <span className="font-mono text-[10px] uppercase text-[#8e8e93]">{kit.colors[row.key]}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(["heading", "body"] as const).map((slot) => (
          <label key={slot} className="space-y-1">
            <span className={label}>{slot === "heading" ? "Heading font" : "Body font"}</span>
            <select
              value={kit.fonts[slot]}
              onChange={(e) => onChange({ ...kit, fonts: { ...kit.fonts, [slot]: e.target.value } })}
              className={field}
            >
              {BRAND_FONTS.map((f) => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </label>
        ))}
      </div>

      <label className="block space-y-1">
        <span className={label}>Footer name</span>
        <input type="text" value={kit.brandName} maxLength={60} onChange={(e) => onChange({ ...kit, brandName: e.target.value })} className={field} />
      </label>

      <div className="space-y-1">
        <span className={label}>Logo</span>
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#383838] bg-[#1f1f21]">
            {kit.logoUrl ? <img src={kit.logoUrl} alt="Brand logo" className="max-h-full max-w-full object-contain" /> : <span className="text-[10px] text-[#8e8e93]">None</span>}
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadLogo(f); e.target.value = ""; }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={`h-7 rounded-md border border-[#383838] bg-[#373737] px-2.5 text-[11px] text-[#ececec] hover:bg-[#404040] disabled:opacity-50 ${focus}`}>
            {uploading ? "Uploading" : kit.logoUrl ? "Replace" : "Upload"}
          </button>
          {kit.logoUrl && (
            <button type="button" onClick={() => onChange({ ...kit, logoUrl: "" })} className={`h-7 rounded-md px-2 text-[11px] text-[#8e8e93] hover:bg-white/5 hover:text-white ${focus}`}>
              Remove
            </button>
          )}
        </div>
        {uploadError && <p className="text-[10px] text-rose-400">{uploadError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1">
        <button type="button" onClick={onApplyCurrent} className={`h-8 rounded-lg border border-[#48484a]/40 bg-[#373737] text-[11px] font-medium text-[#ececec] hover:bg-[#404040] ${focus}`}>
          Apply to this slide
        </button>
        <button type="button" onClick={onApplyAll} className={`h-8 rounded-lg bg-[#1687f8] text-[11px] font-medium text-white hover:bg-[#1374d6] ${focus}`}>
          Apply to all {slidesCount > 1 ? slidesCount : ""} slides
        </button>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saveState === "saving" || saveState === "saved"}
        className={`h-7 w-full rounded-md text-[11px] text-[#ececec] hover:bg-white/5 disabled:cursor-default disabled:text-[#636366] ${focus}`}
      >
        {saveState === "saved" ? "Brand kit saved for all carousels" : "Save brand kit for all carousels"}
      </button>
    </section>
  );
}
