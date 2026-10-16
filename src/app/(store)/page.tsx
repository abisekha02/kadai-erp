import Link from "next/link";
import { query } from "@/lib/db";
import { CATEGORIES, type Product } from "@/lib/types";
import { artFor } from "@/components/ProductArt";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import Photo from "@/components/Photo";
import BananaLeafArt from "@/components/BananaLeafArt";
import DishCard from "@/components/DishCard";
import Kolam from "@/components/Kolam";
import { DISHES, HERO } from "@/lib/photos";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const trust = [
  { t: "Fresh-packed", s: "Ground and sealed in small batches", d: "M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10zM12 8v6M9 11h6" },
  { t: "Free delivery", s: "On orders above ₹999", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01" },
  { t: "Pay on delivery", s: "No card needed to order", d: "M4 6h16v12H4zM4 10h16M8 15h3" },
  { t: "Easy returns", s: "Not happy? We make it right", d: "M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5" },
];

const reviews = [
  { n: "Priya R.", c: "Madurai", q: "The filter coffee smells exactly like my grandmother's kitchen. Already ordered a second pack." },
  { n: "Karthik S.", c: "Chennai", q: "Cardamom was fresh and fragrant, and the packaging kept everything sealed. Delivery in two days." },
  { n: "Divya N.", c: "Bengaluru", q: "The dosa tawa is heavy and seasons beautifully. Crisp dosas on the first try." },
];

export default async function Home({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const cat = CATEGORIES.includes(searchParams.cat ?? "") ? searchParams.cat! : "";
  const browsing = Boolean(q || cat);

  const all = await query<Product>("select * from products where active order by category, name");
  const products = all.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())),
  );

  const featured = (["coffee", "chilli", "tumbler"] as const)
    .map((k) => all.find((p) => artFor(p.name, p.category) === k))
    .filter(Boolean) as Product[];

  const chip = (label: string, value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("cat", value);
    if (q) params.set("q", q);
    const active = cat === value;
    return (
      <Link
        key={label}
        href={`/?${params.toString()}#shop`}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {!browsing && (
        <>
          <section className="hero-glow relative overflow-hidden text-white">
            <div className="temple-border" aria-hidden />
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-16">
              <div>
                <p className="font-tamil text-lg font-semibold text-turmeric" lang="ta">
                  தென்னிந்திய சுவை
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">South Indian pantry · Madurai</p>
                <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
                  The flavours of the <span className="text-turmeric">South</span>, delivered.
                </h1>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
                  Filter coffee, Guntur chilli, Idukki cardamom and the cast iron to cook it on. Small batches from Tamil Nadu and Kerala, packed fresh in Madurai.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#shop" className="btn btn-accent px-6 py-3 text-base">Shop the pantry</a>
                  <a href="#kitchens" className="btn border border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">Explore the flavours</a>
                </div>
                <dl className="mt-10 flex gap-8 text-sm">
                  <div><dt className="text-white/60">Pantry staples</dt><dd className="text-2xl font-bold">{all.length}+</dd></div>
                  <div><dt className="text-white/60">Dispatch</dt><dd className="text-2xl font-bold">2 days</dd></div>
                  <div><dt className="text-white/60">Payment</dt><dd className="text-2xl font-bold">On delivery</dd></div>
                </dl>
              </div>

              <div className="mx-auto w-full max-w-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-turmeric bg-wood shadow-2xl">
                  <Photo
                    slot={HERO.slot}
                    alt={HERO.alt}
                    priority
                    sizes="(min-width: 1024px) 440px, 90vw"
                    fallback={<BananaLeafArt className="h-full w-full" />}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-8 max-w-6xl px-4">
            <ul className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5 lg:grid-cols-4">
              {trust.map((t) => (
                <li key={t.t} className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-turmeric/25 text-ink">
                    <Icon d={t.d} />
                  </span>
                  <div>
                    <p className="font-semibold">{t.t}</p>
                    <p className="text-sm text-mute">{t.s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="kitchens" className="mx-auto mt-16 max-w-6xl scroll-mt-32 px-4">
            <Kolam />
            <div className="mt-4 text-center">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">From the kitchens of the South</h2>
              <p className="mx-auto mt-2 max-w-xl text-mute">
                The dishes we grew up on, and the pantry staples that make them. Pick one and shop the ingredients.
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DISHES.map((d) => (
                <DishCard key={d.slot} d={d} />
              ))}
            </ul>
          </section>

          <section className="mx-auto mt-14 max-w-6xl px-4">
            <h2 className="font-display text-3xl font-bold">Shop by category</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
              {CATEGORIES.map((c) => {
                const rep = all.find((p) => p.category === c);
                const count = all.filter((p) => p.category === c).length;
                return (
                  <li key={c}>
                    <Link href={`/?cat=${encodeURIComponent(c)}#shop`} className="group block overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg">
                      {rep && (
                        <ProductImage name={rep.name} category={c} imageUrl={rep.image_url} className="aspect-[4/3]" artClassName="h-full w-full p-3 transition duration-300 group-hover:scale-110" />
                      )}
                      <div className="p-3">
                        <p className="font-semibold leading-tight">{c}</p>
                        <p className="text-xs text-mute">{count} products</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <section id="shop" className="mx-auto mt-14 max-w-6xl scroll-mt-32 px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">
              {q ? `Results for “${q}”` : cat || "Our pantry"}
            </h2>
            <p className="mt-1 text-mute">{products.length} {products.length === 1 ? "product" : "products"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {chip("All", "")}
            {CATEGORIES.map((c) => chip(c, c))}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-line bg-white p-10 text-center text-mute">
            Nothing matches your search. Try another word or{" "}
            <Link href="/" className="underline">clear the filters</Link>.
          </p>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </ul>
        )}
      </section>

      {!browsing && (
        <>
          <section className="mx-auto mt-20 max-w-6xl px-4">
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-turmeric/20 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-wide text-betel">Our story</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
                  From Madurai kitchens to yours.
                </h2>
                <p className="mt-4 leading-relaxed text-ink/80">
                  We started Kadai &amp; Co. because good pantry staples are hard to find outside the town they come from. We work directly with small roasters, spice growers and metalworkers, check every batch, and pack it ourselves.
                </p>
                <ul className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[["3", "Partner suppliers"], ["100%", "Packed by hand"], ["2 days", "Typical dispatch"]].map(([n, l]) => (
                    <li key={l} className="rounded-xl bg-white/70 p-3">
                      <p className="font-display text-2xl font-bold">{n}</p>
                      <p className="text-xs text-mute">{l}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tile-dots flex items-center justify-center bg-turmeric/30 p-8">
                <ProductImage name="Brass Tumbler" category="Kitchenware" className="aspect-square w-3/4 max-w-xs rounded-full" artClassName="h-full w-full p-6" />
              </div>
            </div>
          </section>

          <section className="mx-auto mt-20 max-w-6xl px-4">
            <h2 className="font-display text-3xl font-bold">What customers say</h2>
            <p className="mt-1 text-sm text-mute">Sample reviews for this demo store.</p>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.n} className="rounded-2xl border border-line bg-white p-6">
                  <p className="text-turmeric" aria-label="5 out of 5 stars">★★★★★</p>
                  <p className="mt-3 leading-relaxed">“{r.q}”</p>
                  <p className="mt-4 text-sm font-semibold">{r.n}<span className="font-normal text-mute"> · {r.c}</span></p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
