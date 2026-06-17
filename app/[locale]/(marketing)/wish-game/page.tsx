"use client";

import { FormEvent, useState, useEffect } from "react";
import { Alfa_Slab_One, DM_Sans } from "next/font/google";

const alfa = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
});

let audioCtx: AudioContext | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function initAudio() {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function startAmbientSound() {
  try {
    initAudio();
    if (!audioCtx || ambientOsc) return;

    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    ambientOsc.type = "sine";
    ambientOsc.frequency.setValueAtTime(50, audioCtx.currentTime);

    ambientGain.gain.setValueAtTime(0.012, audioCtx.currentTime);

    ambientOsc.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    ambientOsc.start();
  } catch (e) {
    console.error(e);
  }
}

function playCreakSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.45);

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.error(e);
  }
}

function playSnapSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const popOsc = audioCtx.createOscillator();
    const popGain = audioCtx.createGain();
    popOsc.type = "triangle";
    popOsc.frequency.setValueAtTime(140, now);
    popOsc.frequency.exponentialRampToValueAtTime(10, now + 0.08);
    popGain.gain.setValueAtTime(0.2, now);
    popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    popOsc.connect(popGain);
    popGain.connect(audioCtx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.08);

    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(550, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    noiseNode.start(now);
  } catch (e) {
    console.error(e);
  }
}

function playTypewriterSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const bufferSize = audioCtx.sampleRate * 0.01;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2200, now);

    const gainNode = audioCtx.createGain();
    const vol = 0.012 + Math.random() * 0.012;
    gainNode.gain.setValueAtTime(vol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start(now);
  } catch (e) {
    console.error(e);
  }
}

type Screen = "gate" | "wish" | "cracking" | "consequence";

function WillowStick({
  animated = false,
  broken = false,
  cracking = false,
}: {
  animated?: boolean;
  broken?: boolean;
  cracking?: boolean;
}) {
  const topClass = `willow-piece willow-piece-top ${broken ? "willow-broken-top" : ""} ${
    cracking ? "willow-crack-top" : ""
  }`;
  const bottomClass = `willow-piece willow-piece-bottom ${broken ? "willow-broken-bottom" : ""} ${
    cracking ? "willow-crack-bottom" : ""
  }`;

  return (
    <svg
      className={`willow-svg ${animated ? "willow-pulse" : ""}`}
      viewBox="0 0 190 430"
      role="img"
      aria-label="One Wish Willow stick"
    >
      <g className={topClass}>
        <path
          d="M87 24 C73 62 82 95 70 131 C62 154 66 179 83 207"
          fill="none"
          stroke="#1A1A1A"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path
          d="M111 27 C123 64 113 98 122 132 C129 160 120 184 101 208"
          fill="none"
          stroke="#1A1A1A"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path d="M88 54 L116 86" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M107 95 L75 129" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M77 146 L115 181" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M84 205 L101 210" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M68 73 C48 71 42 55 35 38" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="7" />
        <path d="M124 118 C145 108 154 88 158 70" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g className={bottomClass}>
        <path
          d="M83 222 C70 252 78 280 67 314 C60 341 70 377 87 408"
          fill="none"
          stroke="#1A1A1A"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path
          d="M102 222 C118 251 108 286 122 319 C132 349 119 381 103 407"
          fill="none"
          stroke="#1A1A1A"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path d="M85 235 L119 270" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M112 289 L73 326" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M76 349 L111 383" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="8" />
        <path d="M68 284 C46 277 37 257 31 239" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="7" />
        <path d="M124 335 C148 332 161 314 168 296" stroke="#1A1A1A" strokeLinecap="round" strokeWidth="7" />
      </g>
      <path
        className={`crack-mark ${broken || cracking ? "crack-mark-visible" : ""}`}
        d="M77 210 L96 219 L83 230 L110 219"
        fill="none"
        stroke="#CC1F1F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
    </svg>
  );
}

export default function WishGamePage() {
  const [screen, setScreen] = useState<Screen>("gate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wish, setWish] = useState("");
  const [consequence, setConsequence] = useState("");
  const [displayedConsequence, setDisplayedConsequence] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!consequence) {
      setDisplayedConsequence("");
      return;
    }
    
    let index = 0;
    setDisplayedConsequence("");
    
    const interval = setInterval(() => {
      setDisplayedConsequence((prev) => prev + consequence.charAt(index));
      playTypewriterSound();
      index++;
      if (index >= consequence.length) {
        clearInterval(interval);
      }
    }, 45);
    
    return () => clearInterval(interval);
  }, [consequence]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      startAmbientSound();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("click", handleFirstInteraction);
      window.addEventListener("keydown", handleFirstInteraction);
      window.addEventListener("touchstart", handleFirstInteraction);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
      }
    };
  }, []);

  async function submitSubscriber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setError("The box demands a name and email.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/save-subscriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "The willow refused the entry.");
      }

      setScreen("wish");
    } catch (subscriberError) {
      setError(subscriberError instanceof Error ? subscriberError.message : "The willow refused the entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function crackWish() {
    const cleanWish = wish.trim();

    if (!cleanWish) {
      setError("Whisper a wish before you crack it.");
      return;
    }

    startAmbientSound();
    playCreakSound();

    setError("");
    setConsequence("");
    setScreen("cracking");
    setIsGenerating(true);

    const reveal = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        playSnapSound();
        setScreen("consequence");
        resolve();
      }, 2000);
    });

    const generate = fetch("/api/generate-consequence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wish: cleanWish, email: email.trim().toLowerCase() }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "The wish curdled before it could answer.");
        }
        setConsequence(data.consequence);
      })
      .catch((generateError) => {
        setError(generateError instanceof Error ? generateError.message : "The wish curdled before it could answer.");
      })
      .finally(() => {
        setIsGenerating(false);
      });

    await Promise.allSettled([reveal, generate]);
  }

  function playAgain() {
    setWish("");
    setConsequence("");
    setError("");
    setIsGenerating(false);
    setScreen("wish");
  }

  return (
    <main className={`wish-game ${dmSans.className}`}>
      {/* Decorative polaroids in the background empty space */}
      <div className="background-gallery">
        <div className="polaroid polaroid-left-1">
          <div className="tape" />
          <img src="/images/willow-whole-table.jpg" alt="Unbroken Willow" />
          <p className="polaroid-caption">Specimen A: Unbroken</p>
        </div>
        <div className="polaroid polaroid-left-2">
          <div className="tape" />
          <img src="/images/willow-snapped-table.jpg" alt="Broken Willow" />
          <p className="polaroid-caption">Specimen B: Cursed</p>
        </div>
        <div className="polaroid polaroid-right-1">
          <div className="tape" />
          <img src="/images/willow-snapping-action.png" alt="Willow Snap" />
          <p className="polaroid-caption">The Crack of Doom</p>
        </div>
      </div>

      <section className={`game-screen email-screen ${screen === "gate" ? "active" : ""}`} aria-hidden={screen !== "gate"}>
        <div className="box-panel">
          <div className="packaging-header">
            <p>HOME OF THE AUTHENTIC</p>
            <h1 className={alfa.className}>ONE WISH WILLOW</h1>
          </div>

          <div className="hero-stick">
            <WillowStick />
          </div>

          <p className={`one-wish ${alfa.className}`}>YOU ONLY GET ONE WISH</p>
          <p className="novelty-copy">Amaze your friends!</p>

          <form className="retro-form" onSubmit={(e) => { startAmbientSound(); submitSubscriber(e); }}>
            <input
              aria-label="Your name"
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              onFocus={startAmbientSound}
              placeholder="Your name..."
              type="text"
              value={name}
            />
            <input
              aria-label="Your email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              onFocus={startAmbientSound}
              placeholder="Your email..."
              type="email"
              value={email}
            />
            <button disabled={isSaving} type="submit" onClick={startAmbientSound}>
              {isSaving ? "OPENING THE BOX..." : "ENTER TO MAKE YOUR WISH"}
            </button>
          </form>
          {error && screen === "gate" ? <p className="error-text">{error}</p> : null}
          <div className="box-poster">
            <img src="/images/willow-poster-bg.png" alt="One Wish Willow Poster" />
          </div>
        </div>
      </section>

      <section className={`game-screen wish-screen ${screen === "wish" ? "active" : ""}`} aria-hidden={screen !== "wish"}>
        <div className="box-panel">
          <div className="simple-banner">
            <h2 className={alfa.className}>MAKE YOUR WISH</h2>
          </div>

          <div className="hero-stick hero-stick-small">
            <WillowStick animated />
          </div>

          <p className="wish-prompt">What do you wish for?</p>
          <textarea
            aria-label="Your wish"
            maxLength={260}
            onChange={(event) => setWish(event.target.value)}
            onFocus={startAmbientSound}
            placeholder="I wish..."
            value={wish}
          />
          <button className="crack-button" onClick={crackWish} type="button">
            CRACK IT
          </button>
          <p className="warning-text">⚠ You only get one wish. Choose wisely.</p>
          {error && screen === "wish" ? <p className="error-text">{error}</p> : null}
          <div className="box-poster">
            <img src="/images/willow-poster-bg.png" alt="One Wish Willow Poster" />
          </div>
        </div>
      </section>

      <section
        className={`game-screen cracking-screen ${screen === "cracking" ? "active" : ""}`}
        aria-hidden={screen !== "cracking"}
      >
        <div className="crack-stage">
          <WillowStick cracking />
          <p className={alfa.className}>CRACKING...</p>
        </div>
      </section>

      <section
        className={`game-screen consequence-screen ${screen === "consequence" ? "active" : ""}`}
        aria-hidden={screen !== "consequence"}
      >
        <div className="box-panel consequence-panel">
          <div className="simple-banner">
            <h2 className={alfa.className}>YOUR WISH HAS BEEN GRANTED</h2>
          </div>

          <div className="hero-stick hero-stick-broken">
            <WillowStick broken />
          </div>

          {consequence ? (
            <p className={`consequence-copy ${alfa.className}`}>{displayedConsequence}</p>
          ) : (
            <p className={`consequence-copy waiting ${alfa.className}`}>
              {isGenerating ? "THE WILLOW IS LISTENING..." : "THE WILLOW WENT SILENT."}
            </p>
          )}

          {error && screen === "consequence" ? <p className="error-text">{error}</p> : null}
          <p className="help-line">Need help? Call 1-323-747-7118</p>
          <button className="play-button" onClick={playAgain} type="button">
            PLAY AGAIN
          </button>
          <div className="box-poster">
            <img src="/images/willow-poster-bg.png" alt="One Wish Willow Poster" />
          </div>
        </div>
      </section>

      <style>{`
        .wish-game {
          --cream: #F5EDD8;
          --red: #CC1F1F;
          --stick: #1A1A1A;
          --white: #FFFFFF;
          --shadow: #3B2A1A;
          background:
            radial-gradient(circle at 12% 18%, rgba(204, 31, 31, 0.09) 0 10%, transparent 11%),
            repeating-linear-gradient(0deg, rgba(59, 42, 26, 0.035) 0 1px, transparent 1px 9px),
            var(--cream);
          color: var(--stick);
          min-height: 100svh;
          overflow: hidden;
          position: relative;
        }

        .box-poster {
          width: calc(100% - 32px);
          margin: 18px auto 4px auto;
          border: 4px solid var(--stick);
          box-shadow: 5px 5px 0 var(--shadow);
          background: var(--cream);
          overflow: hidden;
        }

        .box-poster img {
          width: 100%;
          height: auto;
          display: block;
        }

        .background-gallery {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .polaroid {
          background: #FDFBF7;
          border: 1px solid rgba(59, 42, 26, 0.15);
          box-shadow: 0 8px 25px rgba(59, 42, 26, 0.15), 0 1px 3px rgba(59, 42, 26, 0.05);
          padding: 8px 8px 18px 8px;
          position: absolute;
          width: 190px;
          transition: all 400ms ease;
          display: none;
          pointer-events: auto;
        }

        @media (min-width: 1200px) {
          .polaroid {
            display: block;
          }
        }

        .polaroid img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border: 1px solid rgba(59, 42, 26, 0.08);
          filter: sepia(0.25) contrast(1.05) brightness(0.95);
        }

        .polaroid-caption {
          font-family: monospace;
          font-size: 0.75rem;
          color: rgba(26, 26, 26, 0.6);
          margin-top: 8px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tape {
          background: rgba(230, 220, 195, 0.5);
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          height: 16px;
          left: 50%;
          position: absolute;
          top: -8px;
          transform: translateX(-50%) rotate(-2deg);
          width: 65px;
        }

        .polaroid-left-1 {
          left: 4%;
          bottom: 6%;
          transform: rotate(-6deg);
        }

        .polaroid-left-2 {
          left: 15%;
          bottom: 12%;
          transform: rotate(5deg);
        }

        .polaroid-right-1 {
          right: 5%;
          bottom: 8%;
          transform: rotate(6deg);
        }

        .polaroid-left-1:hover {
          transform: scale(1.06) translateY(-5px) rotate(-3deg);
          box-shadow: 0 15px 35px rgba(59, 42, 26, 0.25);
          z-index: 10;
        }

        .polaroid-left-2:hover {
          transform: scale(1.06) translateY(-5px) rotate(2deg);
          box-shadow: 0 15px 35px rgba(59, 42, 26, 0.25);
          z-index: 10;
        }

        .polaroid-right-1:hover {
          transform: scale(1.06) translateY(-5px) rotate(3deg);
          box-shadow: 0 15px 35px rgba(59, 42, 26, 0.25);
          z-index: 10;
        }

        .game-screen {
          align-items: center;
          display: flex;
          inset: 0;
          justify-content: center;
          min-height: 100svh;
          opacity: 0;
          padding: 18px;
          pointer-events: none;
          position: absolute;
          transform: translateY(16px) scale(0.985);
          transition: opacity 360ms ease, transform 360ms ease;
          width: 100%;
        }

        .game-screen.active {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scale(1);
          z-index: 2;
        }

        .box-panel {
          align-items: center;
          display: flex;
          flex-direction: column;
          max-height: calc(100svh - 24px);
          max-width: 440px;
          overflow-y: auto;
          padding: 0 0 16px;
          width: min(100%, 440px);
        }

        .packaging-header,
        .simple-banner {
          background: var(--red);
          border: 5px solid var(--stick);
          box-shadow: 7px 7px 0 var(--shadow);
          color: var(--white);
          text-align: center;
          text-transform: uppercase;
          width: 100%;
        }

        .packaging-header {
          padding: 14px 10px 18px;
        }

        .packaging-header p {
          font-size: clamp(0.7rem, 2.9vw, 0.88rem);
          font-weight: 900;
          letter-spacing: 0;
          margin: 0 0 2px;
        }

        .packaging-header h1,
        .simple-banner h2 {
          line-height: 0.94;
          margin: 0;
          text-shadow: 3px 3px 0 var(--stick);
        }

        .packaging-header h1 {
          font-size: clamp(2rem, 10.8vw, 4rem);
        }

        .simple-banner {
          padding: 13px 10px;
        }

        .simple-banner h2 {
          font-size: clamp(1.55rem, 7.6vw, 3rem);
        }

        .hero-stick {
          display: grid;
          filter: drop-shadow(7px 8px 0 rgba(59, 42, 26, 0.24));
          margin: 12px 0 4px;
          max-height: 39svh;
          place-items: center;
          width: 100%;
        }

        .hero-stick-small {
          max-height: 34svh;
        }

        .hero-stick-broken {
          margin-top: 18px;
          max-height: 28svh;
        }

        .willow-svg {
          display: block;
          height: min(360px, 39svh);
          max-width: 56vw;
          overflow: visible;
          width: 190px;
        }

        .hero-stick-small .willow-svg {
          height: min(310px, 34svh);
        }

        .hero-stick-broken .willow-svg {
          height: min(245px, 28svh);
        }

        .willow-piece,
        .crack-mark {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 500ms ease;
        }

        .willow-pulse {
          animation: willowGlow 1.55s ease-in-out infinite;
        }

        .willow-broken-top {
          transform: translate(-11px, -7px) rotate(-8deg);
        }

        .willow-broken-bottom {
          transform: translate(13px, 9px) rotate(7deg);
        }

        .willow-crack-top {
          animation: crackTop 780ms cubic-bezier(.16, .9, .28, 1) forwards;
        }

        .willow-crack-bottom {
          animation: crackBottom 780ms cubic-bezier(.16, .9, .28, 1) forwards;
        }

        .crack-mark {
          opacity: 0;
        }

        .crack-mark-visible {
          opacity: 1;
        }

        .one-wish {
          color: var(--red);
          font-size: clamp(1.6rem, 8.6vw, 3.25rem);
          line-height: 0.98;
          margin: 8px 0 0;
          text-align: center;
          text-shadow: 2px 2px 0 var(--white), 4px 4px 0 rgba(59, 42, 26, 0.28);
          text-transform: uppercase;
        }

        .novelty-copy {
          color: var(--stick);
          font-size: 1.08rem;
          font-style: italic;
          font-weight: 900;
          margin: 8px 0 14px;
          text-align: center;
        }

        .retro-form {
          display: grid;
          gap: 10px;
          width: 100%;
        }

        input,
        textarea {
          background: var(--cream);
          border: 4px solid var(--stick);
          border-radius: 0;
          box-shadow: 5px 5px 0 rgba(59, 42, 26, 0.26);
          color: var(--stick);
          font: inherit;
          font-size: 1rem;
          font-weight: 800;
          outline: none;
          padding: 14px;
          width: 100%;
        }

        textarea {
          min-height: 132px;
          resize: vertical;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(26, 26, 26, 0.54);
        }

        input:focus,
        textarea:focus {
          box-shadow: 0 0 0 4px rgba(204, 31, 31, 0.24), 5px 5px 0 rgba(59, 42, 26, 0.26);
          border-color: var(--red);
        }

        button {
          background: var(--red);
          border: 4px solid var(--stick);
          border-radius: 0;
          box-shadow: 6px 6px 0 var(--shadow);
          color: var(--white);
          cursor: pointer;
          font: inherit;
          font-size: clamp(0.96rem, 4vw, 1.1rem);
          font-weight: 1000;
          min-height: 56px;
          padding: 13px 14px;
          text-transform: uppercase;
          transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
          width: 100%;
        }

        button:active {
          box-shadow: 2px 2px 0 var(--shadow);
          transform: translate(4px, 4px);
        }

        button:disabled {
          cursor: wait;
          opacity: 0.76;
        }

        .wish-prompt {
          color: var(--red);
          font-size: clamp(1.9rem, 9vw, 3.5rem);
          font-style: italic;
          font-weight: 1000;
          line-height: 1;
          margin: 4px 0 14px;
          text-align: center;
        }

        .crack-button,
        .play-button {
          margin-top: 12px;
        }

        .warning-text,
        .help-line,
        .error-text {
          font-size: 0.9rem;
          font-weight: 1000;
          margin: 14px 0 0;
          text-align: center;
        }

        .warning-text,
        .help-line {
          color: var(--stick);
        }

        .error-text {
          color: var(--red);
          max-width: 34ch;
        }

        .cracking-screen {
          background: var(--red);
          animation: screenShake 420ms linear 1;
        }

        .cracking-screen.active::before {
          animation: redFlash 430ms ease-out 1;
          background: var(--white);
          content: "";
          inset: 0;
          opacity: 0;
          pointer-events: none;
          position: absolute;
        }

        .crack-stage {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 18px;
          justify-content: center;
        }

        .crack-stage .willow-svg {
          filter: drop-shadow(9px 10px 0 rgba(26, 26, 26, 0.24));
          height: min(360px, 58svh);
          max-width: 72vw;
        }

        .crack-stage p {
          color: var(--white);
          font-size: clamp(2rem, 12vw, 5rem);
          line-height: 0.95;
          margin: 0;
          text-align: center;
          text-shadow: 4px 4px 0 var(--stick);
        }

        .consequence-panel {
          justify-content: center;
        }

        .consequence-copy {
          color: var(--red);
          font-size: clamp(1.2rem, 6.3vw, 2.55rem);
          line-height: 1.08;
          margin: 12px auto 0;
          max-width: 13ch;
          text-align: center;
          text-shadow: 2px 2px 0 var(--white), 4px 4px 0 rgba(59, 42, 26, 0.2);
          text-transform: uppercase;
        }

        .consequence-copy.waiting {
          max-width: 11ch;
        }

        @keyframes willowGlow {
          0%, 100% {
            filter: drop-shadow(0 0 0 rgba(204, 31, 31, 0));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(204, 31, 31, 0.54));
            transform: scale(1.018);
          }
        }

        @keyframes crackTop {
          0% { transform: translate(0, 0) rotate(0deg); }
          40% { transform: translate(-3px, -3px) rotate(-2deg); }
          100% { transform: translate(-42px, -20px) rotate(-18deg); }
        }

        @keyframes crackBottom {
          0% { transform: translate(0, 0) rotate(0deg); }
          40% { transform: translate(4px, 3px) rotate(2deg); }
          100% { transform: translate(45px, 24px) rotate(17deg); }
        }

        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          18% { transform: translate(-7px, 5px); }
          36% { transform: translate(8px, -6px); }
          54% { transform: translate(-5px, -4px); }
          72% { transform: translate(6px, 4px); }
        }

        @keyframes redFlash {
          0% { opacity: 0; }
          22% { opacity: 0.88; }
          100% { opacity: 0; }
        }

        @media (min-width: 720px) {
          .game-screen {
            padding: 30px;
          }

          .box-panel {
            max-width: 520px;
          }

          .willow-svg {
            max-width: 240px;
          }

          .consequence-copy {
            max-width: 18ch;
          }
        }
      `}</style>
    </main>
  );
}
