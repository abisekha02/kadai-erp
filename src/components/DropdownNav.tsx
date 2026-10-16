"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type Item = { href: string; label: string };

/** Accessible dropdown (button + list). Closes on outside click, Escape and link click. */
export default function DropdownNav({
  label,
  items,
  iconOnly = false,
  className = "",
  panelClassName = "w-64",
}: {
  label: string;
  items: Item[];
  iconOnly?: boolean;
  className?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={iconOnly ? label : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`btn btn-primary whitespace-nowrap ${iconOnly ? "h-10 w-10 !p-0" : "px-4"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        {!iconOnly && label}
      </button>
      {open && (
        <ul id={id} className={`absolute left-0 top-full z-50 mt-2 rounded-xl border border-line bg-white p-2 shadow-lg ${panelClassName}`}>
          {items.map((i) => (
            <li key={i.label}>
              <Link href={i.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-chalk">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
