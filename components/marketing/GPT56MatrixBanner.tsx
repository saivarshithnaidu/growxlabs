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
      // Clear canvas with full pitch black
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      const gridSpacingX = 11;
      const gridSpacingY = 13;
      const cols = Math.ceil(width / gridSpacingX);
      const rows = Math.ceil(height / gridSpacingY);

      ctx.font = '900 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const time = Date.now();

      for (let r = 0; r < rows; r++) {
        const y = r * gridSpacingY;

        // Curve wave center for left matrix
        const waveX = 90 + Math.sin(y / 110 + time / 1800) * 45;
        const waveWidth = 95;

        // Circular shape coordinates for right matrix
        const globeX = width - 180 + Math.cos(time / 2800) * 12;
        const globeY = height * 0.42 + Math.sin(time / 2800) * 12;
        const globeRadius = 140;

        for (let c = 0; c < cols; c++) {
          const x = c * gridSpacingX;

          const insideLeftWave = x >= waveX - waveWidth && x <= waveX + waveWidth;
          
          const dx = x - globeX;
          const dy = y - globeY;
          const distToGlobe = Math.sqrt(dx * dx + dy * dy);
          const insideRightGlobe = distToGlobe < globeRadius;

          if (insideLeftWave || insideRightGlobe) {
            let distRatio = 0;
            let colorStr = '';

            if (insideLeftWave) {
              const distToCenter = Math.abs(x - waveX);
              distRatio = 1 - distToCenter / waveWidth;
              // Mix warm orange, gold, and grey colors
              const cVal = Math.sin(x * y + time / 500);
              if (cVal > 0.4) {
                colorStr = '249, 115, 22, '; // Orange
              } else if (cVal > 0.0) {
                colorStr = '234, 179, 8, ';  // Yellow/Gold
              } else {
                colorStr = '156, 163, 175, '; // Grey
              }
            } else {
              distRatio = 1 - distToGlobe / globeRadius;
              // Mostly grey and soft gold colors on the right
              const cVal = Math.sin(x * y + time / 600);
              if (cVal > 0.5) {
                colorStr = '234, 179, 8, ';  // Yellow/Gold
              } else {
                colorStr = '107, 114, 128, '; // Dark Grey
              }
            }

            // Calculate mouse distance boost
            const mdx = x - mouseX;
            const mdy = y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            let mouseBonus = 0;
            if (mdist < 100) {
              mouseBonus = (1 - mdist / 100) * 0.45;
            }

            const opacity = (distRatio * 0.65 + mouseBonus) * (Math.random() < 0.03 ? 0.45 : 1.0);

            if (opacity > 0.05) {
              // Flickering characters loop
              const charSeed = Math.floor(y * 13 + x * 7 + time / 220);
              const char = charSeed % 15 === 0 ? '.' : charSeed % 2 === 0 ? '5' : '6';

              ctx.fillStyle = `rgba(${colorStr}${opacity})`;
              ctx.fillText(char, x, y);
            }
          }
        }
      }

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
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
