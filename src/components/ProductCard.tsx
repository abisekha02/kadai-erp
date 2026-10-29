import Link from "next/link";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCart from "./AddToCart";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ p, badge }: { p: Product; badge?: string }) {
  const out = p.stock <= 0;
  const low = !out && p.stock <= p.reorder_level;
  const flag = out ? "Sold out" : low ? `Only ${p.stock} left` : badge;
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition duration-200 hover:border-ink/30 hover:shadow-[0_8px_24px_-12px_rgba(23,61,43,0.28)]">
      <Link href={`/product/${p.id}`} className="relative block" aria-label={p.name}>
        <ProductImage name={p.name} category={p.category} imageUrl={p.image_url} zoom className="aspect-square" />
      </Link>
      {flag && (
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${out || low ? "bg-brick text-white" : "bg-saffron text-ink"}`}>
          {flag}
        </span>
      )}
      <WishlistButton p={p} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/product/${p.id}`} className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug hover:underline">
          {p.name}
        </Link>
        <p className={`text-xs font-semibold ${out ? "text-brick" : "text-betel"}`}>{out ? "Out of stock" : "In stock"}</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-ink">{inr(p.price)}</p>
        <div className="mt-2">
          <AddToCart p={p} variant="soft" />
        </div>
      </div>
    </li>
  );
}
