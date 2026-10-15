import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [p] = await query<Product>("select * from products where id=$1 and active", [id]);
  if (!p) notFound();
  const related = await query<Product>(
    "select * from products where active and category=$1 and id<>$2 order by name limit 4",
    [p.category, p.id],
  );
  const low = p.stock > 0 && p.stock <= p.reorder_level;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href={`/?cat=${encodeURIComponent(p.category)}#shop`} className="hover:underline">{p.category}</Link> /{" "}
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductImage name={p.name} category={p.category} imageUrl={p.image_url} className="aspect-square rounded-3xl" artClassName="h-full w-full p-10" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-betel">{p.category}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">{p.name}</h1>
          <p className="mt-4 text-3xl font-bold tabular-nums">{inr(p.price)}</p>
          <p className="mt-5 max-w-md leading-relaxed text-ink/75">{p.description}</p>

          <p className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${p.stock <= 0 ? "bg-brick/10 text-brick" : low ? "bg-turmeric/30 text-ink" : "bg-betel/10 text-betel"}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {p.stock <= 0 ? "Out of stock" : low ? `Only ${p.stock} left` : "In stock"}
          </p>

          <div className="mt-6 max-w-sm">
            <AddToCart p={p} withQty />
          </div>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            {["Packed fresh in Madurai and dispatched in 2 days", "Free delivery on orders above ₹999", "Pay on delivery, no card needed", "Easy returns if it isn't right"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-betel text-[11px] text-white">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">You may also like</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
