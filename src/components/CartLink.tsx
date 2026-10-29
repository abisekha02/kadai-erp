"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { inr } from "@/lib/format";

export default function CartLink() {
  const { count, total, ready } = useCart();
  const c = ready ? count : 0;
  const t = ready ? total : 0;
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${c} ${c === 1 ? "item" : "items"}, ${inr(t)}`}
      className="flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-1.5 lg:pl-4 transition hover:border-ink"
    >
      <span className="hidden text-sm font-semibold tabular-nums lg:block">{inr(t)}</span>
      <span className="relative grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6" />
          <circle cx="9" cy="19" r="1.3" />
          <circle cx="17" cy="19" r="1.3" />
        </svg>
        <span key={c} className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[11px] font-bold leading-none text-white ${ready && c > 0 ? "badge-pop" : ""}`} aria-hidden>
          {c}
        </span>
      </span>
    </Link>
  );
}
