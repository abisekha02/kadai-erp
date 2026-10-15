import Link from "next/link";
import { query } from "@/lib/db";
import { CATEGORIES, type Product } from "@/lib/types";
import { inr, tileColor } from "@/lib/format";
import AddToCart from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const cat = CATEGORIES.includes(searchParams.cat ?? "") ? searchParams.cat! : "";

  const products = await query<Product>(
    `select * from products
     where active
       and ($1 = '' or category = $1)
       and ($2 = '' or name ilike '%' || $2 || '%' or description ilike '%' || $2 || '%')
     order by category, name`,
    [cat, q],
  );

  const chip = (label: string, value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("cat", value);
    if (q) params.set("q", q);
    const active = cat === value;
    return (
      <Link
        key={label}
        href={`/?${params.toString()}`}
        className={`rounded-full border px-3 py-1 text-sm ${
          active ? "border-ink bg-ink text-white" : "border-line bg-white hover:bg-[#ecece5]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <section className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          The South Indian pantry, packed fresh and sent to your door.
        </h1>
        <p className="mt-3 text-mute">
          Kumbakonam coffee, Guntur chilli, Idukki cardamom and the brass to serve it in.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {chip("All", "")}
        {CATEGORIES.map((c) => chip(c, c))}
      </div>

      {products.length === 0 ? (
        <p className="panel p-8 text-center text-mute">
          Nothing matches “{q}”. Try a different word or clear the category filter.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="panel flex flex-col overflow-hidden">
              <Link
                href={`/product/${p.id}`}
                className="flex h-40 items-center justify-center text-7xl"
                style={{ background: tileColor[p.category] ?? "#E5E5DC" }}
                aria-label={p.name}
              >
                <span aria-hidden>{p.emoji}</span>
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex-1">
                  <Link href={`/product/${p.id}`} className="font-semibold hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-mute">{p.category}</p>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold tabular-nums">{inr(p.price)}</span>
                  <span className={`text-xs ${p.stock <= p.reorder_level ? "text-brick" : "text-mute"}`}>
                    {p.stock <= 0 ? "Out of stock" : p.stock <= p.reorder_level ? `Only ${p.stock} left` : "In stock"}
                  </span>
                </div>
                <AddToCart p={p} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
