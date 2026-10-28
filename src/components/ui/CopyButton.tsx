"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { IconButton } from "./Button";

/** Copies `value` to the clipboard and shows a check for 2s. */
export function CopyButton({ value, label = "Copy", size = 28 }: { value: string; label?: string; size?: 28 | 32 }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <IconButton
      size={size}
      label={copied ? "Copied" : label}
      icon={copied ? <Check size={14} strokeWidth={1.5} className="text-[var(--success)]" /> : <Copy size={14} strokeWidth={1.5} />}
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      }}
    />
  );
}
