"use client";

/**
 * Minimal home hero: features standard desktop view and the vertical
 * Swiss-design editorial mobile view inspired by 360labs.dev.
 * Includes individual letter neon flicker-in animation delays with
 * spaced text "GROW X LABS TECH" for maximum high-end readability.
 */
export function HeroSection() {
  const brandName = "GROW X LABS TECH";
  
  // Custom neon flicker-in delays to mimic a high-fidelity retro studio load
  const flickerDelays = [
    1.02, // G
    0.48, // R
    1.38, // O
    0.72, // W
    1.15, // X
    0.35, // L
    0.95, // A
    0.58, // B
    1.25, // S
    0.88, // T
    1.52, // E
    0.65, // C
    1.10  // H
  ];

  // Stagger counters to assign unique flicker delays to actual letters (skipping spaces)
  let letterIdxDesktop = 0;
  let letterIdxMobile = 0;
  
  return (
    <>
      {/* ═══ DESKTOP HERO (Hidden on mobile) ═══ */}
      <section
        className="hidden sm:flex sm:flex-col w-full relative overflow-hidden px-6 md:px-10 xl:px-16 2xl:px-24 pt-28 pb-0 min-h-[calc(100dvh-80px)] justify-between"
        aria-labelledby="hero-studio-heading-desktop"
      >
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Empty flex spacer at top to push content down */}
        <div className="flex-grow" />

        {/* Middle part: Swiss Grid columns aligned to the right */}
        <div className="w-full flex flex-col items-end mb-36 z-10 select-none">
          {/* Subtle horizontal grid line for Swiss architectural framing */}
          <div className="w-full max-w-4xl pr-8 mb-6">
            <div className="w-full h-[1px] bg-[#E5E2DC]" />
          </div>

          <div className="flex flex-row justify-between w-full max-w-4xl gap-8 font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-[#6B7280] leading-[1.65] uppercase text-left pr-8">
            <div>
              YOU ARE<br />
              NOW<br />
              ENTERING
            </div>
            <div>
              SCROLL<br />
              TO<br />
              EXPLORE
            </div>
            <div className="text-[#1A1A1A] font-bold">
              AI-NATIVE<br />
              PRODUCT STUDIO &<br />
              ENGINEERING LAB
            </div>
            <div>
              © 2026 // GL-X<br />
              ALL RIGHTS RESERVED
            </div>
          </div>
        </div>

        {/* Bottom part: Massive Brand Title touching the bottom */}
        <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none z-0 translate-y-[3%]">
          <h1
            id="hero-studio-heading-desktop"
            className="font-black select-none tracking-[-0.06em] text-[#1A1A1A] leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap"
          >
            {brandName.split("").map((char, idx) => {
              if (char === " ") {
                return (
                  <span key={idx} className="inline-block w-[0.25em]" />
                );
              }
              const currentDelay = flickerDelays[letterIdxDesktop % flickerDelays.length];
              letterIdxDesktop++;
              return (
                <span
                  key={idx}
                  className="inline-block animate-flicker"
                  style={{
                    animationDelay: `${currentDelay}s`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>
      </section>

      {/* ═══ SWISS-EDITORIAL MOBILE HERO (Visible only on mobile) ═══ */}
      <section
        className="flex sm:hidden w-full relative overflow-hidden px-6 pt-28 pb-10 min-h-[calc(100dvh-60px)] items-center"
        aria-labelledby="hero-studio-heading-mobile"
      >
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative w-full flex flex-row items-center justify-between">
          
          {/* Left Column: Swiss Editorial Stack */}
          <div className="flex flex-col justify-between h-[62dvh] text-left pr-4 select-none z-10">
            {/* Top Indicator */}
            <div className="font-mono text-[10px] tracking-[0.22em] font-extrabold text-[#1A1A1A] uppercase">
              [ GROWXLABS ]
            </div>

            {/* Middle Editorial Block */}
            <div className="flex flex-col gap-5 font-mono text-[9px] tracking-[0.18em] text-[#6B7280] leading-[1.65] uppercase">
              <div>
                YOU ARE<br />
                NOW<br />
                ENTERING
              </div>
              <div>
                GROWXLABS<br />
                TO<br />
                EXPLORE
              </div>
              <div className="w-5 h-[1px] bg-[#E5E2DC]" />
              <div className="text-[#1A1A1A] font-bold">
                AI-NATIVE<br />
                PRODUCT STUDIO &<br />
                ENGINEERING LAB
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="font-mono text-[9px] tracking-[0.15em] text-[#9CA3AF] uppercase leading-relaxed">
              © 2026 // GL-X<br />
              ALL RIGHTS RESERVED
            </div>
          </div>

          {/* Right Column: Rotated Vertical Brand Title pinned perfectly to the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[90px] h-[75dvh] flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <h1
              id="hero-studio-heading-mobile"
              className="rotate-[-90deg] whitespace-nowrap text-[#1A1A1A] font-black select-none tracking-[-0.04em] leading-none"
              style={{
                fontSize: "clamp(1.8rem, 6.8vh, 3.4rem)",
              }}
            >
              {brandName.split("").map((char, idx) => {
                if (char === " ") {
                  return (
                    <span key={idx} className="inline-block w-[0.25em]" />
                  );
                }
                const currentDelay = flickerDelays[letterIdxMobile % flickerDelays.length];
                letterIdxMobile++;
                return (
                  <span
                    key={idx}
                    className="inline-block animate-flicker"
                    style={{
                      animationDelay: `${currentDelay}s`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
          </div>

        </div>
      </section>
    </>
  );
}
