"use client";

import Link from "next/link";
import { useWishlist } from "@/components/WishlistProvider";
import ProductImage from "@/components/ProductImage";
import AddToCart from "@/components/AddToCart";
import { inr } from "@/lib/format";

export default function WishlistPage() {
  const { items, ready, remove } = useWishlist();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Your wishlist</h1>
      {!ready ? (
        <p className="mt-6 text-mute">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-display text-2xl font-bold">Nothing saved yet</p>
          <p className="mt-2 text-mute">Tap the heart on any product to keep it here for later.</p>
          <Link href="/?shop=all" className="btn btn-primary mt-5">Browse products</Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
              <Link href={`/product/${p.id}`} aria-label={p.name}>
                <ProductImage name={p.name} category={p.category} imageUrl={p.image_url} className="aspect-square" />
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={`/product/${p.id}`} className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug hover:underline">{p.name}</Link>
                <p className="text-xl font-bold tabular-nums">{inr(p.price)}</p>
                <AddToCart p={p} variant="soft" />
                <button onClick={() => remove(p.id)} className="text-sm text-mute underline underline-offset-4 hover:text-ink">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
