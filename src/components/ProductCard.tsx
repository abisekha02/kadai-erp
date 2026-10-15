import Link from "next/link";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCart from "./AddToCart";

export default function ProductCard({ p }: { p: Product }) {
  const low = p.stock > 0 && p.stock <= p.reorder_level;
  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_-12px_rgba(20,33,61,0.25)]">
      <Link href={`/product/${p.id}`} className="relative block" aria-label={p.name}>
        <ProductImage
          name={p.name}
          category={p.category}
          imageUrl={p.image_url}
          className="aspect-square"
          artClassName="h-full w-full p-5 transition duration-300 group-hover:scale-105"
        />
        {(low || p.stock <= 0) && (
          <span className="absolute left-3 top-3 rounded-full bg-brick px-2.5 py-1 text-[11px] font-semibold text-white">
            {p.stock <= 0 ? "Sold out" : `Only ${p.stock} left`}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-betel">{p.category}</p>
          <Link href={`/product/${p.id}`} className="mt-1 block font-semibold leading-snug hover:underline">
            {p.name}
          </Link>
        </div>
        <p className="text-xl font-bold tabular-nums">{inr(p.price)}</p>
        <AddToCart p={p} />
      </div>
    </li>
  );
}
