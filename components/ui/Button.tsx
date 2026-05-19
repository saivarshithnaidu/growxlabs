"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePostHog } from 'posthog-js/react';


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  trackEvent?: string;
  trackProperties?: Record<string, any>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, trackEvent, trackProperties, children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#355CFF] text-white hover:bg-[#2A4AD4] shadow-sm",
      secondary: "bg-[#EDEAE4] text-[#1A1A1A] hover:bg-[#E5E2DC]",
      outline: "border border-[#E5E2DC] bg-white text-[#1A1A1A] hover:border-[#355CFF]/35 hover:bg-[#F5F3EE]",
      ghost: "bg-transparent text-[#6B7280] hover:bg-[#EDEAE4] hover:text-[#1A1A1A]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

  const posthog = usePostHog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(e);
    if (trackEvent && posthog) {
      posthog.capture(trackEvent, trackProperties);
    }
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative active:scale-[0.98] hover:scale-[1.02]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span className={cn(isLoading && "opacity-0")}>{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
