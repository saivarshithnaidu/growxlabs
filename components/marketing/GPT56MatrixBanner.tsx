'use client';

import React, { useEffect, useRef } from 'react';

export function GPT56MatrixBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = ['5', '6', '.', '5', '6', '5.6', 'SOL', 'TERRA', 'LUNA'];
    const particles: Array<{
      x: number;
      y: number;
      char: string;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }> = [];

    const numParticles = 140;
    for (let i = 0; i < numParticles; i++) {
      const isLeft = Math.random() < 0.6;
      const x = isLeft 
        ? Math.random() * (width * 0.35) 
        : width * 0.65 + Math.random() * (width * 0.35);
      
      const y = Math.random() * height;
      const char = chars[Math.floor(Math.random() * chars.length)];
      const size = Math.floor(Math.random() * 10) + 11; // 11px to 21px
      const speed = Math.random() * 0.15 + 0.05;
      const opacity = Math.random() * 0.5 + 0.15;
      
      const colorOptions = [
        'rgba(249, 115, 22, ',  // Orange
        'rgba(234, 179, 8, ',   // Yellow
        'rgba(244, 63, 94, ',   // Rose/Red
        'rgba(156, 163, 175, '  // Grey
      ];
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];

      particles.push({ x, y, char, size, speed, opacity, color });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.15)'; // Deep pitch black background
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() < 0.6
            ? Math.random() * (width * 0.35)
            : width * 0.65 + Math.random() * (width * 0.35);
        }

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let currentOpacity = p.opacity;
        let scale = 1.0;

        if (dist < 100) {
          const factor = 1 - dist / 100;
          currentOpacity = Math.min(1.0, p.opacity + factor * 0.65);
          scale = 1.0 + factor * 0.35;
        }

        ctx.save();
        ctx.fillStyle = p.color + currentOpacity + ')';
        ctx.font = `${p.char.length > 2 ? 'bold' : 'normal'} ${Math.floor(p.size * scale)}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#030303] select-none pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
