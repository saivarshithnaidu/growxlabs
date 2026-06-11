"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { usePostHog } from 'posthog-js/react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "default" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "default" | "icon";
  isLoading?: boolean;
  trackEvent?: string;
  trackProperties?: Record<string, any>;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      trackEvent,
      trackProperties,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      primary: "bg-[#355CFF] text-white hover:bg-[#2A4AD4] shadow-sm",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-transparent text-foreground hover:border-[#355CFF]/35 hover:bg-muted",
      ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10",
    };

    const posthog = usePostHog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) props.onClick(e);
      if (trackEvent && posthog) {
        posthog.capture(trackEvent, trackProperties);
      }
    };

    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp
          ref={ref as any}
          onClick={handleClick as any}
          className={cn(
            "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative active:scale-[0.98] hover:scale-[1.02]",
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
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
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
