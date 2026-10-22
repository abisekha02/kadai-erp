"use client";

import Link from "next/link";
import CartLink from "./CartLink";
import { useWishlist } from "./WishlistProvider";

export default function HeaderLinks() {
  const { count, ready } = useWishlist();
  const c = ready ? count : 0;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/wishlist"
        aria-label={`Wishlist, ${c} ${c === 1 ? "item" : "items"}`}
        className="relative hidden h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink sm:grid"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
          <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z" />
        </svg>
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[11px] font-bold leading-none text-white" aria-hidden>{c}</span>
      </Link>
      <Link
        href="/admin"
        aria-label="Staff sign in"
        className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink lg:grid"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M5 20c.8-3.6 3.7-5.4 7-5.4s6.2 1.8 7 5.4" />
        </svg>
      </Link>
      <CartLink />
    </div>
  );
}
