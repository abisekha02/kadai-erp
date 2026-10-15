import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import { inr, tileColor } from "@/lib/format";
import AddToCart from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [p] = await query<Product>("select * from products where id=$1 and active", [id]);
  if (!p) notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className="flex aspect-square items-center justify-center rounded-lg text-[9rem]"
        style={{ background: tileColor[p.category] ?? "#E5E5DC" }}
      >
        <span aria-hidden>{p.emoji}</span>
      </div>
      <div>
        <Link href={`/?cat=${encodeURIComponent(p.category)}`} className="text-sm text-mute underline underline-offset-4">
          {p.category}
        </Link>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{p.name}</h1>
        <p className="mt-4 text-2xl font-bold tabular-nums">{inr(p.price)}</p>
        <p className="mt-4 max-w-md leading-relaxed text-mute">{p.description}</p>
        <p className={`mt-4 text-sm ${p.stock <= p.reorder_level ? "text-brick" : "text-betel"}`}>
          {p.stock <= 0 ? "Out of stock" : p.stock <= p.reorder_level ? `Only ${p.stock} left` : "In stock, ships in 2 days"}
        </p>
        <div className="mt-6 max-w-sm">
          <AddToCart p={p} withQty />
        </div>
      </div>
    </div>
  );
}
