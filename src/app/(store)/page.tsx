import Link from "next/link";
import { query } from "@/lib/db";
import { CATEGORIES, type Product } from "@/lib/types";
import { inr } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import CategoryBlock from "@/components/CategoryBlock";
import PromoCard from "@/components/PromoCard";
import SectionHeading from "@/components/SectionHeading";
import HeroSlider from "@/components/HeroSlider";
import Photo from "@/components/Photo";
import { HERO, dish } from "@/lib/photos";

export const dynamic = "force-dynamic";

type Row = Product & { sold: number };
const SORTS: Record<string, string> = { popular: "Popular", "price-asc": "Price: low to high", "price-desc": "Price: high to low" };

export default async function Home({ searchParams }: { searchParams: { q?: string; cat?: string; sort?: string; shop?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const cat = CATEGORIES.includes(searchParams.cat ?? "") ? searchParams.cat! : "";
  const sort = SORTS[searchParams.sort ?? ""] ? searchParams.sort! : "popular";
  const browsing = Boolean(q || cat || searchParams.shop === "all");

  const all = await query<Row>(
    `select p.*, coalesce(s.sold,0)::int as sold
     from products p
     left join (
       select oi.product_id, sum(oi.quantity) as sold
       from order_items oi join orders o on o.id = oi.order_id
       where o.status <> 'cancelled' group by oi.product_id
     ) s on s.product_id = p.id
     where p.active order by p.category, p.name`,
  );

  const byPopularity = (a: Row, b: Row) => b.sold - a.sold || a.name.localeCompare(b.name);
  const bestSellers = [...all].sort(byPopularity).slice(0, 8);
  const inCat = (c: string) => all.filter((p) => p.category === c).sort(byPopularity);
  const from = (c: string) => {
    const list = inCat(c);
    return list.length ? inr(Math.min(...list.map((p) => p.price))) : null;
  };

  /* ---------- Browse / search / filter view ---------- */
  if (browsing) {
    let products = all.filter(
      (p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
    else products = [...products].sort(byPopularity);

    const href = (over: { cat?: string; sort?: string }) => {
      const sp = new URLSearchParams();
      const c = over.cat ?? cat;
      if (c) sp.set("cat", c);
      if (q) sp.set("q", q);
      const so = over.sort ?? sort;
      if (so !== "popular") sp.set("sort", so);
      if (!c && !q) sp.set("shop", "all");
      return `/?${sp.toString()}`;
    };
    const chip = (label: string, active: boolean, to: string) => (
      <Link key={label} href={to} aria-current={active ? "true" : undefined}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
        {label}
      </Link>
    );

    return (
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-mute">
          <Link href="/" className="hover:underline">Home</Link> / <span className="text-ink">{cat || (q ? "Search" : "All products")}</span>
        </nav>
        <section id="shop" aria-label="Products" className="scroll-mt-32">
          <SectionHeading title={q ? `Results for “${q}”` : cat || "All products"} sub={`${products.length} ${products.length === 1 ? "product" : "products"}`} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {chip("All", !cat, href({ cat: "" }))}
              {CATEGORIES.map((c) => chip(c, cat === c, href({ cat: c })))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Sort products">
              <span className="text-mute">Sort:</span>
              {Object.entries(SORTS).map(([k, label]) => chip(label, sort === k, href({ sort: k })))}
            </div>
          </div>
          {products.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-line bg-white p-10 text-center text-mute">
              Nothing matches your search. Try another word or <Link href="/?shop=all" className="underline">clear the filters</Link>.
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </ul>
          )}
        </section>
      </div>
    );
  }

  /* ---------- Home ---------- */
  const slideBase = "relative isolate flex min-h-[420px] overflow-hidden text-white";
  const slides = [
    <div key="s1" className={`${slideBase} hero-green`}>
      <div className="absolute inset-y-0 right-0 w-full md:w-3/5">
        <Photo slot={HERO.slot} alt={HERO.alt} priority sizes="(min-width: 1024px) 560px, 100vw"
          fallback={<div className="tile-lotus flex h-full w-full items-end justify-end p-8" aria-hidden><span className="font-tamil text-6xl font-bold text-white/15 lg:text-7xl" lang="ta">சுவை</span></div>} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10 md:via-ink/60" aria-hidden />
      <div className="relative z-10 flex max-w-lg flex-col justify-center p-7 pb-14 sm:p-10 sm:pb-14">
        <p className="font-tamil text-base font-semibold text-sand" lang="ta">தென்னிந்திய சுவை</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">South Indian pantry · Madurai</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">The flavours of the South, delivered.</h1>
        <p className="mt-4 max-w-md leading-relaxed text-cream/85">Filter coffee, Guntur chilli, Idukki cardamom and the cast iron to cook it on. Small batches, packed fresh and priced fairly.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/?shop=all" className="btn btn-accent px-6 py-3 text-base">Shop the pantry</Link>
          <a href="#bestsellers" className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">Best sellers</a>
        </div>
      </div>
    </div>,
    <div key="s2" className={`${slideBase} bg-gradient-to-br from-[#5A3A28] to-[#3b2418]`}>
      <div className="tile-lotus absolute inset-0 -z-10" aria-hidden />
      <span className="pointer-events-none absolute -right-2 bottom-2 font-tamil text-[9rem] font-bold leading-none text-white/10" lang="ta" aria-hidden>காபி</span>
      <div className="relative z-10 flex max-w-lg flex-col justify-center p-7 pb-14 sm:p-10 sm:pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Coffee &amp; tea</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">Filter coffee, ground the way you like it</h2>
        <p className="mt-4 max-w-md leading-relaxed text-cream/85">Chicory-blend roast for the South Indian filter, and Nilgiri leaf for a proper cup of tea.</p>
        {from("Coffee & Tea") && <p className="mt-4 text-lg font-semibold text-sand">from {from("Coffee & Tea")}</p>}
        <div className="mt-6"><Link href="/?cat=Coffee%20%26%20Tea" className="btn btn-accent px-6 py-3 text-base">Shop coffee &amp; tea</Link></div>
      </div>
    </div>,
    <div key="s3" className={`${slideBase} bg-gradient-to-br from-clay to-terracotta`}>
      <div className="tile-lotus absolute inset-0 -z-10" aria-hidden />
      <span className="pointer-events-none absolute -right-2 bottom-2 font-tamil text-[8rem] font-bold leading-none text-white/10" lang="ta" aria-hidden>பாத்திரம்</span>
      <div className="relative z-10 flex max-w-lg flex-col justify-center p-7 pb-14 sm:p-10 sm:pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/80">Kitchenware</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">Cast iron and brass, built to last</h2>
        <p className="mt-4 max-w-md leading-relaxed text-cream/90">A dosa tawa that holds its heat, a brass tumbler and dabara, and a stone wet grinder for smooth batter.</p>
        {from("Kitchenware") && <p className="mt-4 text-lg font-semibold">from {from("Kitchenware")}</p>}
        <div className="mt-6"><Link href="/?cat=Kitchenware" className="btn bg-white px-6 py-3 text-base text-ink hover:bg-sand">Shop kitchenware</Link></div>
      </div>
    </div>,
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* 1. Hero slider + two side banners */}
      <section aria-label="Featured" className="grid gap-4 pt-6 lg:grid-cols-[2fr_1fr]">
        <HeroSlider slides={slides} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <PromoCard d={dish("filter-coffee")} eyebrow="Kumbakonam style" title="Filter coffee, made right" className="aspect-[16/9] lg:aspect-auto lg:min-h-[200px]" />
          <PromoCard d={dish("sweets")} eyebrow="Festival favourites" title="Sweets & snacks for every occasion" className="aspect-[16/9] lg:aspect-auto lg:min-h-[200px]" />
        </div>
      </section>

      {/* 2. Best sellers */}
      <section id="bestsellers" aria-label="Best sellers" className="mt-14 scroll-mt-32">
        <SectionHeading title="Best sellers" sub="What other kitchens keep reordering." href="/?shop=all" />
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {bestSellers.map((p, k) => <ProductCard key={p.id} p={p} badge={k < 3 && p.sold > 0 ? "Best seller" : undefined} />)}
        </ul>
      </section>

      {/* 3. Wide promo */}
      <section aria-label="Cash on delivery" className="mt-14">
        <div className="relative isolate flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-ink px-7 py-8 text-white sm:px-10">
          <div className="tile-lotus absolute inset-0 -z-10 opacity-60" aria-hidden />
          <h2 className="max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
            <span className="text-sand">Pay when it arrives.</span> Cash on delivery on every order, no card needed.
          </h2>
          <Link href="/?shop=all" className="btn btn-accent px-6 py-3 text-base">Shop now</Link>
        </div>
      </section>

      {/* 4. Category block: Spices */}
      <CategoryBlock category="Spices" eyebrow="Spices" title="Ground fresh, packed fresh" blurb="Guntur chilli, Tellicherry pepper and Idukki cardamom." tint="#8A3F22" tamil="மசாலா" products={inCat("Spices")} />

      {/* 5. Promo trio */}
      <section aria-label="Cook the South" className="mt-14">
        <ul className="grid gap-4 md:grid-cols-3">
          <li><PromoCard d={dish("dosa-chutney")} eyebrow="Crisp & golden" title="Dosa night, sorted" cta="Shop dosa" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("idli-sambar")} eyebrow="Soft & steamed" title="Idli rice for fluffy idlis" cta="Shop idli rice" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("parotta-salna")} eyebrow="Layered & flaky" title="Spices for parotta & salna" cta="Shop spices" sizes="(min-width: 768px) 380px, 90vw" /></li>
        </ul>
      </section>

      {/* 6. Category block: Kitchenware */}
      <CategoryBlock category="Kitchenware" eyebrow="Kitchenware" title="Built to last a lifetime" blurb="Cast iron, brass and stone, the way kitchens here have always cooked." tint="#1F5138" tamil="பாத்திரம்" products={inCat("Kitchenware")} />

      {/* 7. Second promo trio */}
      <section aria-label="From the kitchens of the South" className="mt-14">
        <ul className="grid gap-4 md:grid-cols-3">
          <li><PromoCard d={dish("biryani")} eyebrow="Biryani night" title="Biryani rice, the proper way" cta="Shop rice" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("chettinad-chicken")} eyebrow="Karaikudi heat" title="Pepper & chilli for Chettinad" cta="Shop spices" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("murukku")} eyebrow="Crunchy spirals" title="Murukku, fried fresh" cta="Shop snacks" sizes="(min-width: 768px) 380px, 90vw" /></li>
        </ul>
      </section>

      {/* 8. Shop by category */}
      <section aria-label="Shop by category" className="mt-16">
        <SectionHeading title="Shop by category" sub="Everything for a South Indian kitchen." href="/?shop=all" hrefLabel="All products" />
        <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c} category={c} count={all.filter((p) => p.category === c).length} rep={all.find((p) => p.category === c)} />
          ))}
        </ul>
      </section>
    </div>
  );
}
