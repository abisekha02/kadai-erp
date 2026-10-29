import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

/** Bacola-style category section: a banner with quick links on the left, a product grid on the right. */
export default function CategoryBlock({
  category,
  eyebrow,
  title,
  blurb,
  tint,
  tamil,
  products,
}: {
  category: string;
  eyebrow: string;
  title: string;
  blurb: string;
  tint: string;
  tamil: string;
  products: Product[];
}) {
  const href = `/?cat=${encodeURIComponent(category)}`;
  return (
    <section aria-label={category} className="mt-16">
      <Reveal className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{eyebrow}</p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-mute">{blurb}</p>
        </div>
        <Link href={href} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold hover:border-ink">
          View all <span aria-hidden>→</span>
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-2xl p-6 text-white" style={{ background: tint }}>
          <div className="tile-lotus absolute inset-0 -z-10" aria-hidden />
          <span className="pointer-events-none absolute -right-2 top-2 -z-10 font-tamil text-6xl font-bold text-white/15" lang="ta" aria-hidden>{tamil}</span>
          <div>
            <p className="font-display text-2xl font-bold leading-tight">{category}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} className="line-clamp-1 text-white/90 underline-offset-4 hover:text-white hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href={href} className="mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-sand">
            Shop all {category} <span aria-hidden>→</span>
          </Link>
        </div>

        <Reveal as="ul" stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
