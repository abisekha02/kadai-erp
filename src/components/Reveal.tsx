"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

/** Fades content up when it scrolls into view. With `stagger`, each child follows the one before. No effect for reduced-motion users. */
export default function Reveal({
  children,
  as = "div",
  className = "",
  stagger = false,
}: {
  children: ReactNode;
  as?: "div" | "ul" | "section";
  className?: string;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, className: `reveal ${stagger ? "stagger" : ""} ${shown ? "is-visible" : ""} ${className}` },
    children,
  );
}
