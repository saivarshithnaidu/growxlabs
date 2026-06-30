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
      // Clear canvas with deep space black
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

        // 1. Curved wave on the left (representing Sol / solar surface)
        const waveX = 90 + Math.sin(y / 110 + time / 1800) * 45;
        const waveWidth = 95;

        // 2. 3D Spherical Globe on the right (representing Terra / Earth sphere)
        const globeX = width - 180 + Math.cos(time / 4500) * 8;
        const globeY = height * 0.45 + Math.sin(time / 4500) * 8;
        const R = 140; // Globe radius

        for (let c = 0; c < cols; c++) {
          const x = c * gridSpacingX;

          // Check left wave boundary
          const insideLeftWave = x >= waveX - waveWidth && x <= waveX + waveWidth;
          
          // Check 3D sphere boundaries
          const dx = x - globeX;
          const dy = y - globeY;
          const distSq = dx * dx + dy * dy;
          const insideRightGlobe = distSq <= R * R;

          if (insideLeftWave || insideRightGlobe) {
            let opacity = 0;
            let colorStr = '';

            if (insideRightGlobe) {
              // 3D sphere projection coordinates
              const z = Math.sqrt(R * R - distSq);
              const lat = Math.asin(dy / R);
              const lon = Math.atan2(dx, z) + (time / 3200); // Smooth 3D rotation over time

              // Spherical grid lines for latitude and longitude (every 30 degrees)
              const latGrid = Math.abs(Math.sin(lat * 6)) < 0.17;
              const lonGrid = Math.abs(Math.sin(lon * 6)) < 0.17;
              
              // Outer silhouette rim
              const isOutline = distSq >= (R - 3) * (R - 3);

              if (latGrid || lonGrid || isOutline) {
                // Sphere shading: brighter in center, faded near edges
                const shading = z / R;
                
                const mdx = x - mouseX;
                const mdy = y - mouseY;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                let mouseBonus = 0;
                if (mdist < 100) {
                  mouseBonus = (1 - mdist / 100) * 0.45;
                }

                opacity = (shading * 0.65 + mouseBonus) * (Math.random() < 0.04 ? 0.4 : 1.0);
                
                // Color mapping: gold/yellow for the globe
                const cVal = Math.sin(x * y + time / 500);
                if (cVal > 0.4) {
                  colorStr = '234, 179, 8, ';  // Glowing Yellow
                } else if (cVal > 0.0) {
                  colorStr = '249, 115, 22, '; // Soft Orange
                } else {
                  colorStr = '156, 163, 175, '; // Grey
                }
              }
            } else if (insideLeftWave) {
              const distToCenter = Math.abs(x - waveX);
              const distRatio = 1 - distToCenter / waveWidth;

              const mdx = x - mouseX;
              const mdy = y - mouseY;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              let mouseBonus = 0;
              if (mdist < 100) {
                mouseBonus = (1 - mdist / 100) * 0.45;
              }

              opacity = (distRatio * 0.6 + mouseBonus) * (Math.random() < 0.03 ? 0.45 : 1.0);

              // Orange/red tones for left wave
              const cVal = Math.sin(x * y + time / 500);
              if (cVal > 0.4) {
                colorStr = '249, 115, 22, '; // Orange
              } else if (cVal > 0.0) {
                colorStr = '234, 179, 8, ';  // Gold/Yellow
              } else {
                colorStr = '156, 163, 175, '; // Grey
              }
            }

            if (opacity > 0.05) {
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
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
