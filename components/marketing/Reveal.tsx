"use client";

import React from "react";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
}

export function Reveal({ children, delay = 0, y = 20, scale = 1, ...props }: RevealProps) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

