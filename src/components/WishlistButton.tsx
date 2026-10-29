"use client";

import { useWishlist, type WishItem } from "./WishlistProvider";

export default function WishlistButton({ p, className = "" }: { p: WishItem; className?: string }) {
  const { has, toggle, ready } = useWishlist();
  const on = ready && has(p.id);
  return (
    <button
      type="button"
      onClick={() => toggle({ id: p.id, name: p.name, price: p.price, category: p.category, image_url: p.image_url, stock: p.stock })}
      aria-pressed={on}
      aria-label={on ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm transition hover:border-terracotta hover:text-terracotta ${className}`}
    >
      <svg key={String(on)} viewBox="0 0 24 24" className={`h-[18px] w-[18px] ${on ? "heart-pop" : ""}`} fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
        <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z" />
      </svg>
    </button>
  );
}
