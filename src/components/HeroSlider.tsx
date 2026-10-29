"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

/** Simple accessible carousel. Slides are rendered on the server and passed in as children. Autoplay stops on hover, focus and for reduced-motion users. */
export default function HeroSlider({ slides, label = "Featured offers", interval = 6500 }: { slides: ReactNode[]; label?: string; interval?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), interval);
    return () => clearInterval(t);
  }, [paused, n, interval]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={k} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i} className={`flex w-full shrink-0 ${k === i ? "slide-active" : ""}`} {...(k !== i ? { inert: "" as unknown as boolean } : {})}>
            {s}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous slide" className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white">
              <span aria-hidden>‹</span>
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next slide" className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white">
              <span aria-hidden>›</span>
            </button>
          </div>
          <div className="absolute bottom-6 left-7 flex gap-2 sm:left-10">
            {slides.map((_, k) => (
              <button key={k} type="button" onClick={() => go(k)} aria-label={`Go to slide ${k + 1}`} aria-current={k === i} className={`h-2.5 rounded-full transition-all ${k === i ? "w-7 bg-ink" : "w-2.5 bg-ink/25 hover:bg-ink/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
